import {Component} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {environment} from '../environments/environment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  template:
    `
      <router-outlet></router-outlet>
    `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dataspire-lite';

  authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: environment.authSetting.issuer,
    redirectUri: environment.authSetting.redirectUrl,
    loginUrl: 'https://identity.apaleo.com/connect/authorize',
    clientId: environment.authSetting.clientId,
    responseType: 'code',
    oidc: true,
    disablePKCE: true,
    scope: environment.authSetting.scope,
    showDebugInformation: true,
  };

  constructor(
    private oauthService: OAuthService,
    private route: ActivatedRoute
  ) {
    const scope: string = this.route.snapshot?.data?.scope?.allowScopeList?.join(' ');
    const clientId: string = this.route.snapshot?.data?.scope?.clientId;
    this.configure(scope, clientId);
  }

  private configure(scope: string, clientId: string): void {

    this.oauthService.configure({
      ...this.authCodeFlowConfig,
      scope,
      clientId
    });
  }


}
