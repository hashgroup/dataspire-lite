package com.devrupt.services.config.graphql.typeWiring;

import com.devrupt.services.config.graphql.instance.GraphQLInstance;
import graphql.schema.DataFetcher;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@Getter
@Setter
public class TypeWiringFactory
{
    private final Map<String, DataFetcher> _QUERY_TYPE = GraphQLInstance.getInstance().queryTypeWiringMap;
    private final Map<String, DataFetcher> _MUTATION_TYPE = GraphQLInstance.getInstance().mutationTypeWiringMap;

    @Autowired(required = false)
    private List<FetcherContainer> fetcherContainerList = new ArrayList<>();

    /**
     *
     */
    public void injectDataFetcher(){
        for( FetcherContainer fetcherContainer:fetcherContainerList){
            _QUERY_TYPE.putAll( fetcherContainer.query());
            _MUTATION_TYPE.putAll( fetcherContainer.mutation());
        }
    }
}
