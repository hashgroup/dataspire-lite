package com.devrupt.services.config.graphql;

import com.fasterxml.jackson.databind.JsonNode;
import graphql.GraphQLError;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ResponseContent {

    private JsonNode data;

    private List<GraphQLError> errors;

    private transient boolean dataPresent;

    private transient Map<Object, Object> extensions;

    public ResponseContent(){
        super();
    }
}
