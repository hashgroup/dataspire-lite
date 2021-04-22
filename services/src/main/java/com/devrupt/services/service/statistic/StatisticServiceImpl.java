package com.devrupt.services.service.statistic;

import com.devrupt.services.dto.integration.CustomerLifetimeValueDto;
import com.devrupt.services.dto.integration.CustomerLifetimeValueFilter;
import com.devrupt.services.dto.statistic.*;
import com.devrupt.services.service.integration.IntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticServiceImpl implements StatisticService
{
    @Autowired
    private IntegrationService integrationService;

    /**
     *
     * @param filter
     * @return
     * @throws IOException
     */
    @Override
    public StatisticDto getStatistic(StatisticFilter filter) throws IOException
    {
        StatisticDto rs = new StatisticDto();

        List<CustomerLifetimeValueDto> data = integrationService
                .getCustomerLifetimeValueList(CustomerLifetimeValueFilter
                        .builder()
                            .processId(filter.getProcessId())
                        .build());

        Integer totalIdentifiedGuest = data.size();
        Integer totalPotentialVipGuest = Math.toIntExact(data.stream()
                .filter(this::isPotentialVipGuest)
                .count());
        Integer highValueGuest = Math.toIntExact(data.stream()
                .filter(this::isHighValueGuest)
                .count());

        rs.setTotalIdentifiedGuest(totalIdentifiedGuest);
        rs.setTotalPotentialVipGuest(totalPotentialVipGuest);
        rs.setHighValueGuest(highValueGuest);

        return rs;
    }

    /**
     *
     * @param filter
     * @return
     * @throws IOException
     */
    @Override
    public List<IdentifiedGuestSegmentationDto> getIdentifiedGuestSegmentation(IdentifiedGuestSegmentationFilter filter) throws IOException
    {
        List<IdentifiedGuestSegmentationDto> rs = new ArrayList<>();

        List<CustomerLifetimeValueDto> data = integrationService
                .getCustomerLifetimeValueList(CustomerLifetimeValueFilter
                        .builder()
                        .processId(filter.getProcessId())
                        .build());

        Map<String, List<CustomerLifetimeValueDto>> dataMap = data.stream().collect(Collectors.groupingBy(CustomerLifetimeValueDto::getType));
        IdentifiedGuestSegmentationDto identifiedGuestSegmentation;
        for(Map.Entry<String, List<CustomerLifetimeValueDto>> entry : dataMap.entrySet())
        {
            identifiedGuestSegmentation = new IdentifiedGuestSegmentationDto();
            identifiedGuestSegmentation.setSegment(entry.getKey());
            identifiedGuestSegmentation.setValue((double) entry.getValue().size() / data.size());

            rs.add(identifiedGuestSegmentation);
        }
        return rs;
    }

    /**
     *
     * @param filter
     * @return
     * @throws IOException
     */
    @Override
    public List<ClvClassDto> getClvClassList(ClvClassFilter filter) throws IOException
    {
        List<ClvClassDto> rs = new ArrayList<>();

        List<CustomerLifetimeValueDto> data = integrationService
                .getCustomerLifetimeValueList(CustomerLifetimeValueFilter
                        .builder()
                        .processId(filter.getProcessId())
                        .build());
        Map<Double, List<CustomerLifetimeValueDto>> dataMap = data.stream()
                .filter(customer -> customer.getLtvClass() != null)
                .collect(Collectors.groupingBy(CustomerLifetimeValueDto::getLtvClass));

        Map<Double, List<CustomerLifetimeValueDto>> sortedDataMap = new LinkedHashMap<>();
        dataMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEachOrdered(x -> sortedDataMap.put(x.getKey(), x.getValue()));

        ClvClassDto clvClass;
        List<ClvTypeDto> clvTypeList;
        ClvTypeDto firstTimeGuestType;
        ClvTypeDto returningGuestType;
        for(Map.Entry<Double, List<CustomerLifetimeValueDto>> entry : sortedDataMap.entrySet())
        {
            String name = getClassNameByValue(entry.getKey());
            clvClass = new ClvClassDto();
            clvTypeList = new ArrayList<>();
            firstTimeGuestType = new ClvTypeDto(IntegrationService.FIRST_TIME_GUEST, 0);
            returningGuestType = new ClvTypeDto(IntegrationService.RETURNING_GUEST, 0);

            clvClass.setName(name);

            for(CustomerLifetimeValueDto customer : entry.getValue())
            {
                if (customer.getType().equals(IntegrationService.FIRST_TIME_GUEST))
                {
                    firstTimeGuestType.setValue(firstTimeGuestType.getValue() + 1);
                }
                else if (customer.getType().equals(IntegrationService.RETURNING_GUEST))
                {
                    returningGuestType.setValue(returningGuestType.getValue() + 1);
                }
            }

            clvTypeList.add(firstTimeGuestType);
            clvTypeList.add(returningGuestType);
            clvClass.setTypeList(clvTypeList);
            rs.add(clvClass);
        }
        return rs;
    }

    private boolean isPotentialVipGuest(CustomerLifetimeValueDto input)
    {
        return input.getLtvClass().equals(IntegrationService.CLASS_HIGH) &&
                input.getType().equalsIgnoreCase(IntegrationService.FIRST_TIME_GUEST);
    }

    private boolean isHighValueGuest(CustomerLifetimeValueDto input)
    {
        return input.getLtvClass().equals(IntegrationService.CLASS_HIGH);
    }

    private String getClassNameByValue(Double classValue)
    {
        if (classValue.compareTo(IntegrationService.CLASS_HIGH) == 0)
        {
            return "High";
        }
        else if (classValue.compareTo(IntegrationService.CLASS_MID) == 0)
        {
            return "Medium";
        }
        else if (classValue.compareTo(IntegrationService.CLASS_LOW) == 0)
        {
            return "Low";
        }
        else
        {
            return null;
        }
    }
}
