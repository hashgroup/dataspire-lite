package com.devrupt.services.config.graphql.instance;

import graphql.schema.DataFetcher;

import java.util.LinkedHashMap;
import java.util.Map;

public class GraphQLInstance
{
    public Map<String, DataFetcher> queryTypeWiringMap;
    public Map<String, DataFetcher> mutationTypeWiringMap;

    private static GraphQLInstance instance;

    private GraphQLInstance(){}

    public static GraphQLInstance getInstance(){
        if(instance == null){
            instance = new GraphQLInstance();
            instance.queryTypeWiringMap = new LinkedHashMap<>();
            instance.mutationTypeWiringMap = new LinkedHashMap<>();

        }
        return instance;
    }
}
