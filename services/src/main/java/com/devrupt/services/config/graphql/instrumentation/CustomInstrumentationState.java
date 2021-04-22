package com.devrupt.services.config.graphql.instrumentation;

import graphql.execution.instrumentation.InstrumentationState;

import java.util.HashMap;
import java.util.Map;

public class CustomInstrumentationState implements InstrumentationState
{
    private Map<String, Object> anyStateYouLike = new HashMap<>();

    public void recordTiming(String key, long time) {
        anyStateYouLike.put(key, time);
    }

    public Map<String, Object> getAnyStateYouLike()
    {
        return anyStateYouLike;
    }

    public void setAnyStateYouLike(Map<String, Object> anyStateYouLike)
    {
        this.anyStateYouLike = anyStateYouLike;
    }
}
