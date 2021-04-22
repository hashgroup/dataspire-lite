export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Built-in java.math.BigDecimal */
  BigDecimal: any;
  /** Long type */
  Long: any;
}


export enum ProcessStatusEnum {
  Success = 'SUCCESS',
  Ready = 'READY',
  Processing = 'PROCESSING',
  Error = 'ERROR'
}

export interface Query {
  test?: Maybe<Scalars['String']>;
  getApaleoClient?: Maybe<ApaleoClient>;
  getProcessState?: Maybe<Process>;
  getCustomerLifetimeValueList?: Maybe<Array<Maybe<CustomerLifetimeValue>>>;
  getTotalRecordCount?: Maybe<Scalars['Int']>;
  getReservationList?: Maybe<ReservationList>;
  getStatistic?: Maybe<Statistic>;
  getIdentifiedGuestSegmentation?: Maybe<Array<Maybe<IdentifiedGuestSegmentation>>>;
  getClvClassList?: Maybe<Array<Maybe<ClvClass>>>;
}


export interface QueryGetProcessStateArgs {
  filter?: Maybe<ProcessStatusFilter>;
}


export interface QueryGetCustomerLifetimeValueListArgs {
  filter?: Maybe<CustomerLifetimeValueFilter>;
}


export interface QueryGetTotalRecordCountArgs {
  filter?: Maybe<ProcessDetailsFilter>;
}


export interface QueryGetReservationListArgs {
  filter?: Maybe<ReservationFilter>;
}


export interface QueryGetStatisticArgs {
  filter?: Maybe<StatisticFilter>;
}


export interface QueryGetIdentifiedGuestSegmentationArgs {
  filter?: Maybe<IdentifiedGuestSegmentationFilter>;
}


export interface QueryGetClvClassListArgs {
  filter?: Maybe<ClvClassFilter>;
}

export interface Address {
  countryCode?: Maybe<Scalars['String']>;
}

export interface ReservationFilter {
  hotelIdList: Array<Maybe<Scalars['String']>>;
  refreshToken: Scalars['String'];
  pageNumber?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}

export interface ReservationList {
  data?: Maybe<Array<Maybe<Reservation>>>;
  count?: Maybe<Scalars['Int']>;
}

export interface CustomerLifetimeValueFilter {
  processId: Scalars['String'];
}

export interface Process {
  id?: Maybe<Scalars['String']>;
  status?: Maybe<ProcessStatusEnum>;
  message?: Maybe<Scalars['String']>;
  recordCount?: Maybe<Scalars['Int']>;
}

export interface Reservation {
  id?: Maybe<Scalars['String']>;
  bookingId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  arrival?: Maybe<Scalars['String']>;
  departure?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  adults?: Maybe<Scalars['String']>;
  chilrenAgeList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  channelCode?: Maybe<Scalars['String']>;
  reservationTimeSliceList?: Maybe<Array<Maybe<ReservationTimeSlice>>>;
  room?: Maybe<ReservationRoom>;
  guest?: Maybe<ReservationGuest>;
  totalGrossAmount?: Maybe<Monetary>;
}

export interface Statistic {
  totalIdentifiedGuest?: Maybe<Scalars['Int']>;
  totalPotentialVipGuest?: Maybe<Scalars['Int']>;
  highValueGuest?: Maybe<Scalars['Int']>;
}

export interface ClvType {
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
}

export interface ReservationRoom {
  id?: Maybe<Scalars['String']>;
  roomNumber?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  roomGroupId?: Maybe<Scalars['String']>;
}

export interface TokenRequest {
  code?: Maybe<Scalars['String']>;
  redirectUrl?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
}

export interface ProcessInput {
  processId?: Maybe<Scalars['String']>;
  hotelIdList: Array<Maybe<Scalars['String']>>;
  refreshToken: Scalars['String'];
}

export interface ProcessStatusFilter {
  processId: Scalars['String'];
}

export interface ReservationTimeSlice {
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  roomPrice?: Maybe<Monetary>;
}

export interface Monetary {
  grossAmount?: Maybe<Scalars['BigDecimal']>;
  netAmount?: Maybe<Scalars['BigDecimal']>;
  vatType?: Maybe<Scalars['String']>;
  vatPercent?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
}

export interface ClvClass {
  name?: Maybe<Scalars['String']>;
  typeList?: Maybe<Array<Maybe<ClvType>>>;
}

export interface IdentifiedGuestSegmentation {
  segment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
}

export interface ProcessDetailsFilter {
  processId: Scalars['String'];
}


export interface StatisticFilter {
  processId: Scalars['String'];
}

export interface ReservationGuest {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
}

export interface IdentifiedGuestSegmentationFilter {
  processId: Scalars['String'];
}

export interface ApaleoClient {
  allowScopeList?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientId?: Maybe<Scalars['String']>;
}

export interface CustomerLifetimeValue {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  guestId?: Maybe<Scalars['String']>;
  ltvClass?: Maybe<Scalars['Float']>;
  low?: Maybe<Scalars['Float']>;
  mid?: Maybe<Scalars['Float']>;
  high?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
}

export interface TokenResponse {
  idToken?: Maybe<Scalars['String']>;
  accessToken?: Maybe<Scalars['String']>;
  expiresIn?: Maybe<Scalars['Long']>;
  tokenType?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
}


export interface ClvClassFilter {
  processId: Scalars['String'];
}

export interface Mutation {
  exchangeToken?: Maybe<TokenResponse>;
  renewToken?: Maybe<TokenResponse>;
  startProcess?: Maybe<Process>;
}


export interface MutationExchangeTokenArgs {
  input?: Maybe<TokenRequest>;
}


export interface MutationRenewTokenArgs {
  input?: Maybe<TokenRequest>;
}


export interface MutationStartProcessArgs {
  input?: Maybe<ProcessInput>;
}
