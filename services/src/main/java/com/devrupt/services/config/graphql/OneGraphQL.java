package com.devrupt.services.config.graphql;

import com.devrupt.services.config.graphql.instance.GraphQLInstance;
import com.devrupt.services.config.graphql.instrumentation.CustomInstrumentation;
import com.devrupt.services.config.graphql.typeWiring.TypeWiringFactory;
import graphql.ExecutionInput;
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.execution.instrumentation.ChainedInstrumentation;
import graphql.execution.instrumentation.Instrumentation;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.*;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.UnaryOperator;

@Component
public class OneGraphQL implements InitializingBean
{
    private final String _QUERY = "Query";
    private final String _MUTATION = "Mutation";

    @Value("classpath*:graphqls/**/*.graphql")
    private Resource[] graphqlFiles;

    @Autowired
    private TypeWiringFactory typeWiringFactory;

    @Autowired
    private CustomInstrumentation customInstrumentation;

    private GraphQL graphQL;

    public class CustomComparator implements Comparator<Resource> {
        @Override
        public int compare(Resource o1, Resource o2) {
            return o1.getFilename().compareTo(o2.getFilename());
        }
    }

    @Override
    public void afterPropertiesSet() throws Exception
    {
        System.out.println("RUN LOAD SCHEMA IN afterPropertiesSet");
        List<Resource> resources = Arrays.asList(graphqlFiles);
        if( resources.size() > 0 ){
            Collections.sort(resources, new CustomComparator());

            // parse schema for _firstInit
            TypeDefinitionRegistry typeRegistry = null;
            SchemaParser parser = new SchemaParser();
            for(Resource r : resources )
            {
                System.out.println("Graphql : " + r.getFilename());
                InputStream is = r.getInputStream();
                byte[] bdata = FileCopyUtils.copyToByteArray(is);
                String data = new String(bdata, StandardCharsets.UTF_8);
                if(!StringUtils.isEmpty(data))
                {
                    typeRegistry = (typeRegistry == null)
                            ? parser.parse(data)
                            : typeRegistry.merge(parser.parse(data));

                }
            }
            //Inject Data Fetcher
            typeWiringFactory.injectDataFetcher();

            RuntimeWiring wiring = this.buildRuntimeWiring();
            GraphQLSchema schema = new SchemaGenerator().makeExecutableSchema(typeRegistry, wiring);
            List<Instrumentation> chainedList = new ArrayList<>();
            chainedList.add(customInstrumentation);
            ChainedInstrumentation chainedInstrumentation = new ChainedInstrumentation(chainedList);

            graphQL = GraphQL
                    .newGraphQL(schema)
                    .instrumentation(chainedInstrumentation)
                    .build();
        }
    }

    public ExecutionResult executeQuery(RequestContent request){

        return graphQL.execute(ExecutionInput.newExecutionInput()
                .query(request.getQuery())
                .operationName(request.getOperationName())
                .variables(request.getVariables())
                .build()
        );
    }

    private UnaryOperator<TypeRuntimeWiring.Builder> queryRuntimeWiring = typeWiring ->
    {
        typeWiring.dataFetchers(GraphQLInstance.getInstance().queryTypeWiringMap);
        return typeWiring;
    };

    private UnaryOperator<TypeRuntimeWiring.Builder> mutationRuntimeWiring = typeWiring ->
    {
        typeWiring.dataFetchers(GraphQLInstance.getInstance().mutationTypeWiringMap);
        return typeWiring;
    };

    private RuntimeWiring buildRuntimeWiring() {
        return RuntimeWiring.newRuntimeWiring()
                .type(_QUERY, queryRuntimeWiring)
                .type(_MUTATION, mutationRuntimeWiring)
                .build();
    }


}
