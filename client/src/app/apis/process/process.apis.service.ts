import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {ExecuteGraphqlService} from '../../services/execute-graphql.service';
import {Observable} from 'rxjs';
import {MutationStartProcessDocs} from '../../graphql/generated/mutations';
import {
  ClvClass,
  CustomerLifetimeValue,
  IdentifiedGuestSegmentation,
  MutationStartProcessArgs,
  Process,
  QueryGetClvClassListArgs,
  QueryGetCustomerLifetimeValueListArgs,
  QueryGetProcessStateArgs,
  QueryGetStatisticArgs,
  QueryGetTotalRecordCountArgs,
  Statistic
} from '../../graphql/generated/graphql';
import {
  QueryGetClvClassListDocs,
  QueryGetCustomerLifetimeValueListDocs,
  QueryGetIdentifiedGuestSegmentationDocs,
  QueryGetProcessStateDocs,
  QueryGetStatisticDocs,
  QueryGetTotalRecordCountDocs
} from '../../graphql/generated/queries';
import {ProcessApis} from './process-api';


@Injectable({
  providedIn: 'root'
})
export class ProcessApisService implements ProcessApis {

  constructor(private execute: ExecuteGraphqlService) {
  }


  startProcess(variables: MutationStartProcessArgs): Observable<Process> {
    return this.execute.runMutation({
      mutation: MutationStartProcessDocs,
      variables
    }).pipe(map(({response}) => response));
  }

  getProcessState(variables: QueryGetProcessStateArgs): Observable<Process> {
    return this.execute.runQuery({
      query: QueryGetProcessStateDocs,
      variables
    }).pipe(map(({response}) => response));
  }

  getTotalRecordCount(variables: QueryGetTotalRecordCountArgs): Observable<number> {
    return this.execute.runQuery({
      query: QueryGetTotalRecordCountDocs,
      variables
    }).pipe(map(({response}) => response));
  }


  getCustomerLifetimeValueList(variables: QueryGetCustomerLifetimeValueListArgs): Observable<Array<CustomerLifetimeValue>> {
    return this.execute.runQuery({
      query: QueryGetCustomerLifetimeValueListDocs,
      variables
    }).pipe(map(({response}) => response));
  }

  getClvClassList(variables: QueryGetClvClassListArgs): Observable<Array<ClvClass>> {
    return this.execute.runQuery({
      query: QueryGetClvClassListDocs,
      variables
    }).pipe(map(({response}) => response));
  }

  getIdentifiedGuestSegmentation(variables: QueryGetCustomerLifetimeValueListArgs): Observable<Array<IdentifiedGuestSegmentation>> {
    return this.execute.runQuery({
      query: QueryGetIdentifiedGuestSegmentationDocs,
      variables
    }).pipe(map(({response}) => response));
  }


  getStatistic(variables: QueryGetStatisticArgs): Observable<Statistic> {
    return this.execute.runQuery({
      query: QueryGetStatisticDocs,
      variables
    }).pipe(map(({response}) => response));
  }

}
