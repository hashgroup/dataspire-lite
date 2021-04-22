package com.devrupt.services.config.graphql.error;

import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CustomGraphQLException implements GraphQLError
{
    private static final long serialVersionUID = -6515875528909061411L;
    private GraphQLError e;

    public CustomGraphQLException(GraphQLError e)
    {
        this.e = e;
    }

    @Override
    public Map<String, Object> getExtensions()
    {
        Map<String, Object> customAttributes = new LinkedHashMap<>();

        customAttributes.put("message", this.getMessage());

        return customAttributes;
    }

    @Override
    public String getMessage()
    {
        return e.getMessage();
    }

    @Override
    public List<SourceLocation> getLocations()
    {
        return e.getLocations();
    }

    @Override
    public ErrorType getErrorType()
    {
        return e.getErrorType();
    }
}
