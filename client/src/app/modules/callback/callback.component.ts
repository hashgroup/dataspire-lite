import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {ActivatedRoute} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-callback',
  template: `
    <p>
      callback works!
    </p>
    <button mat-button (click)="getToken()">GetToken</button>
    <a routerLink="/">home</a>
  `,
  styleUrls: ['./callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallbackComponent implements OnInit {


  constructor(
    private oauthService: OAuthService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
  ) {
  }

  ngOnInit(): void {

    const {code, state} = this.route.snapshot.queryParams;
    this.cookieService.set('auth_code', code);
    this.cookieService.set('auth_state', state);
    window.close();
  }


  getToken(): void {
    console.log(this.oauthService.getAccessToken());
  }
}
