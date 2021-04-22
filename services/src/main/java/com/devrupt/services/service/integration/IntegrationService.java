package com.devrupt.services.service.integration;

import com.devrupt.services.dto.integration.*;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.IOException;
import java.util.List;

public interface IntegrationService
{
    Double CLASS_HIGH = 3d;
    Double CLASS_MID = 2d;
    Double CLASS_LOW = 1d;

    String FIRST_TIME_GUEST = "1st-Time Guest";
    String RETURNING_GUEST = "Returning Guest";

    ProcessDto startProcess(ProcessInput input) throws JsonProcessingException;

    ProcessDto getProcessState(ProcessFilter filter) throws JsonProcessingException;

    List<CustomerLifetimeValueDto> getCustomerLifetimeValueList(CustomerLifetimeValueFilter filter) throws IOException;

    Integer getTotalRecordCount(ProcessFilter filter) throws JsonProcessingException;

}
