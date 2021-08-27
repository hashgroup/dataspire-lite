import gql from 'graphql-tag';

export const QueryGetApaleoClientDocs = gql`
    query GetApaleoClient {
  response: getApaleoClient {
    allowScopeList
    clientId
  }
}
    `;
export const QueryGetClvClassListDocs = gql`
    query GetClvClassList($filter: ClvClassFilter) {
  response: getClvClassList(filter: $filter) {
    name
    typeList {
      name
      value
    }
  }
}
    `;
export const QueryGetCustomerLifetimeValueListDocs = gql`
    query GetCustomerLifetimeValueList($filter: CustomerLifetimeValueFilter) {
  response: getCustomerLifetimeValueList(filter: $filter) {
    firstName
    lastName
    email
    ltvClass
    low
    mid
    high
    type
  }
}
    `;
export const QueryGetIdentifiedGuestSegmentationDocs = gql`
    query GetIdentifiedGuestSegmentation($filter: IdentifiedGuestSegmentationFilter) {
  response: getIdentifiedGuestSegmentation(filter: $filter) {
    segment
    value
  }
}
    `;
export const QueryGetProcessStateDocs = gql`
    query GetProcessState($filter: ProcessStatusFilter) {
  response: getProcessState(filter: $filter) {
    id
    status
    message
  }
}
    `;
export const QueryGetReservationListDocs = gql`
    query GetReservationList($filter: ReservationFilter) {
  response: getReservationList(filter: $filter) {
    count
  }
}
    `;
export const QueryGetStatisticDocs = gql`
    query GetStatistic($filter: StatisticFilter) {
  response: getStatistic(filter: $filter) {
    totalIdentifiedGuest
    totalPotentialVipGuest
    highValueGuest
  }
}
    `;
export const QueryGetTotalRecordCountDocs = gql`
    query GetTotalRecordCount($filter: ProcessDetailsFilter) {
  response: getTotalRecordCount(filter: $filter)
}
    `;