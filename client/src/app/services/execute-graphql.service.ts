import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {DocumentNode} from 'graphql';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';


interface FetchQueryOptions {
  query: DocumentNode;
  variables?: any;
}

interface MutationOptions {
  mutation: DocumentNode;
  variables?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ExecuteGraphqlService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  };

  private api = `${environment.apiURL}/graphql`;

  constructor(private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  runQuery({query, variables}: FetchQueryOptions, customHttpHeaders?: HttpHeaders) {
    const httpOptions = customHttpHeaders
      ? {headers: customHttpHeaders}
      : {...this.httpOptions};

    return this.http.post(this.api, {
      query: query.loc.source.body,
      variables
    }, httpOptions)
      .pipe(map(({data}: any) => data));
  }

  // tslint:disable-next-line:typedef
  runMutation({mutation, variables}: MutationOptions, customHttpHeaders?: HttpHeaders) {
    const httpOptions = customHttpHeaders
      ? {headers: customHttpHeaders}
      : {...this.httpOptions};

    return this.http.post(this.api, {
      query: mutation.loc.source.body,
      variables
    }, httpOptions)
      .pipe(map(({data}: any) => data));
  }
}
