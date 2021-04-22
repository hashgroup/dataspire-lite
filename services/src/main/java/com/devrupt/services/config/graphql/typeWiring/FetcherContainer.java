package com.devrupt.services.config.graphql.typeWiring;

import graphql.schema.DataFetcher;

import java.util.Map;

public interface FetcherContainer {
    Map<String, DataFetcher<?>> query();
    Map<String, DataFetcher<?>> mutation();
}
