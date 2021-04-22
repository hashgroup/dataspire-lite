import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {ExecuteGraphqlService} from '../services/execute-graphql.service';
import {Observable} from 'rxjs';
import {MutationExchangeTokenDocs} from '../graphql/generated/mutations';
import {ApaleoClient, MutationExchangeTokenArgs, TokenResponse} from '../graphql/generated/graphql';
import {QueryGetApaleoClientDocs} from '../graphql/generated/queries';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthApisService {

  constructor(private execute: ExecuteGraphqlService,
              private http: HttpClient) {
  }

  getApaleoClient(): Observable<ApaleoClient> {
    return this.execute.runQuery({
      query: QueryGetApaleoClientDocs,
    }).pipe(map(({response}) => response));
  }


  exchangeToken(variables: MutationExchangeTokenArgs): Observable<TokenResponse> {
    return this.execute.runMutation({
      mutation: MutationExchangeTokenDocs,
      variables
    }).pipe(map(({response}) => response));
  }


  apaleoLogout(): void {
  }


}
