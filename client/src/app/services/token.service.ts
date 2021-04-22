import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenResponse} from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token = new BehaviorSubject<TokenResponse>(null);
  token$: Observable<TokenResponse> = this.token.asObservable();

  constructor() {
  }

  setToken(res: TokenResponse): void {
    this.token.next(res);
  }

  getAccessToken = (): string => this.token?.value?.access_token;
  getRefreshToken = (): string => this.token?.value?.refresh_token;
  getTokenType = (): string => this.token?.value?.token_type;

}
