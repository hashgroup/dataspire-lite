package com.devrupt.services.service.integration;

import com.devrupt.services.dto.integration.*;
import com.devrupt.services.dto.reservation.ReservationDto;
import com.devrupt.services.dto.reservation.ReservationFilter;
import com.devrupt.services.service.reservation.ReservationService;
import com.devrupt.services.utils.RestUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class IntegrationServiceImpl implements IntegrationService
{
    @Value("${mock-data}")
    private Boolean mockData;

    @Value("${ai.api.send-input-data.endpoint}")
    private String sendInputDataEndpoint;

    @Value("${ai.api.check-process-status.endpoint}")
    private String checkProcessStatusEndpoint;

    @Value("${ai.api.get-prediction-file.endpoint}")
    private String getPredictionFileEndpoint;

    @Value("${ai.api.get-file-details.endpoint}")
    private String getFileDetailsEndpoint;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private RestUtils restUtils;

    /**
     * Get reservation data from apaleo, then transform to training input data, send input to AI services
     * @param input
     * @return
     * @throws JsonProcessingException
     */
    @Override
    public ProcessDto startProcess(ProcessInput input) throws JsonProcessingException
    {
        String id = UUID.randomUUID().toString();
        Integer recordCount;
        ReservationFilter reservationFilter = new ReservationFilter();
        reservationFilter.setRefreshToken(input.getRefreshToken());
        reservationFilter.setHotelIdList(input.getHotelIdList());

        List<ReservationDto> reservationList = reservationService.getReservationList(reservationFilter).getData();
        List<TrainingDataInput> dataInputList = this.transformData(reservationList);
        recordCount = dataInputList.size();

        HttpHeaders headers = new HttpHeaders();
        headers.add("FileID", id);
        headers.add("ForceRun", "1");
        headers.setContentType(MediaType.APPLICATION_JSON);

        CompletableFuture.runAsync(() ->{
            try
            {
                String inputAsJson = objectMapper.writeValueAsString(dataInputList);
                restUtils.constructRequestAndCall(sendInputDataEndpoint, inputAsJson, headers, HttpMethod.POST, String.class);
            } catch (JsonProcessingException e)
            {
                e.printStackTrace();
            }
        });

        return new ProcessDto(id, ProcessStatusEnum.PROCESSING, "Processing", recordCount);
    }

    /**
     * check process status
     * @param filter
     * @return
     * @throws JsonProcessingException
     */
    @Override
    public ProcessDto getProcessState(ProcessFilter filter) throws JsonProcessingException
    {
        String processId = filter.getProcessId();
        HttpHeaders headers = new HttpHeaders();
        headers.add("FileID", processId);

        String response = restUtils.constructRequestAndCall(checkProcessStatusEndpoint, "", headers, HttpMethod.GET, String.class);

        ProcessDto process = objectMapper.readValue(response, ProcessDto.class);
        process.setId(processId);

        return process;
    }

    /**
     * Get prediction data
     * @param filter
     * @return
     * @throws IOException
     */
    @Override
    public List<CustomerLifetimeValueDto> getCustomerLifetimeValueList(
            CustomerLifetimeValueFilter filter) throws IOException
    {
        List<CustomerLifetimeValueDto> rs = new ArrayList<>();

        if (mockData)
        {
            File file = new ClassPathResource("template/data_output_schema.json").getFile();

            JsonNode jsonNode = objectMapper.readTree(file);
            rs = objectMapper.convertValue(jsonNode.get("dataList"), new TypeReference<List<CustomerLifetimeValueDto>>() {});
        }
        else
        {
            String processId = filter.getProcessId();
            HttpHeaders headers = new HttpHeaders();
            headers.add("FileID", processId);

            String response = restUtils.constructRequestAndCall(getPredictionFileEndpoint, "", headers, HttpMethod.GET, String.class);
            ProcessDto process = objectMapper.readValue(response, ProcessDto.class);
            if (process.getStatus().equals(ProcessStatusEnum.SUCCESS))
            {
                rs = process.getResponse();
            }
        }
        return rs;
    }


    @Override
    public Integer getTotalRecordCount(ProcessFilter filter) throws JsonProcessingException
    {
        Integer rs = null;
        String processId = filter.getProcessId();
        HttpHeaders headers = new HttpHeaders();
        headers.add("FileID", processId);

        String response = restUtils.constructRequestAndCall(getFileDetailsEndpoint, "", headers, HttpMethod.GET, String.class);
        if(response != null)
        {
            JsonNode jsonNode = objectMapper.readTree(response);
            List<ProcessDetails> processDetails = objectMapper.convertValue(jsonNode.get("dataList"), new TypeReference<List<ProcessDetails>>() {});
            if(!CollectionUtils.isEmpty(processDetails))
            {
                rs = processDetails.get(0).getTotalRecordCount();
            }
        }

        return rs;
    }

    /**
     * transform
     * @param reservationList
     * @return
     */
    private List<TrainingDataInput> transformData(List<ReservationDto> reservationList)
    {
        return reservationList.stream().map(r ->
        {
            BigDecimal roomPrice = r.getReservationTimeSliceList().stream()
                    .map(ts -> ts.getRoomPrice().getGrossAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String roomGroupId = null;
            String roomNumber= null;
            if (r.getRoom() != null)
            {
                roomGroupId = r.getRoom().getRoomGroupId();
                roomNumber = r.getRoom().getRoomNumber();
            }

            String firstName = null;
            String lastName = null;
            String countryCode = null;
            String email = null;
            if (r.getGuest() != null)
            {
                firstName = r.getGuest().getFirstName();
                lastName = r.getGuest().getLastName();
                email = r.getGuest().getEmail();

                if (r.getGuest().getAddress() != null)
                {
                    countryCode = r.getGuest().getAddress().getCountryCode();
                }
            }

            Integer children = r.getChildrenAgeList() != null ?
                    r.getChildrenAgeList().size() :
                    null;

            return TrainingDataInput.builder()
                    .createdDate(r.getCreated())
                    .status(r.getStatus())
                    .roomGroupId(roomGroupId)
                    .arrivalDate(r.getArrival())
                    .departureDate(r.getDeparture())
                    .roomPrice(roomPrice)
                    .lastName(lastName)
                    .firstName(firstName)
                    .totalNight(r.getReservationTimeSliceList().size())
                    .channel(r.getChannelCode())
                    .totalAmount(r.getTotalGrossAmount().getAmount())
                    .countryCode(countryCode)
                    .adults(r.getAdults())
                    .children(children)
                    .email(email)
                    .roomNumber(roomNumber)
                    .build();
        }).collect(Collectors.toList());
    }
}
