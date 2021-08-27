import {Observable} from "rxjs";
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
} from 'src/app/graphql/generated/graphql';


export interface ProcessApis {

  startProcess(variables: MutationStartProcessArgs): Observable<Process>;

  getProcessState(variables: QueryGetProcessStateArgs): Observable<Process>;

  getTotalRecordCount(variables: QueryGetTotalRecordCountArgs): Observable<number>;

  getCustomerLifetimeValueList(variables: QueryGetCustomerLifetimeValueListArgs): Observable<Array<CustomerLifetimeValue>>;

  getClvClassList(variables: QueryGetClvClassListArgs): Observable<Array<ClvClass>>;

  getIdentifiedGuestSegmentation(variables: QueryGetCustomerLifetimeValueListArgs): Observable<Array<IdentifiedGuestSegmentation>>;

  getStatistic(variables: QueryGetStatisticArgs): Observable<Statistic>;

}
