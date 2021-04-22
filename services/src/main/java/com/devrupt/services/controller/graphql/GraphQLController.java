package com.devrupt.services.controller.graphql;

import com.devrupt.services.config.graphql.OneGraphQL;
import com.devrupt.services.config.graphql.RequestContent;
import com.devrupt.services.config.graphql.error.CustomGraphQLException;
import graphql.ExecutionResult;
import graphql.GraphQLError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class GraphQLController
{
    @Autowired
    private OneGraphQL oneGraphQL;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping(value = "/graphql",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity executeGraphQL(@RequestBody RequestContent request)
    {
        ExecutionResult executionResult = oneGraphQL.executeQuery(request);
        if(executionResult.getErrors().isEmpty())
        {
            return ResponseEntity.ok(executionResult.toSpecification());
        }
        else
        {
            List<GraphQLError> errors = executionResult.getErrors().stream()
                    .map(CustomGraphQLException::new)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
        }
    }
}
