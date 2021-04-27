import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-callback',
  template: `
    <p>Loading...</p>
    <a routerLink="/">home</a>
  `,
  styleUrls: ['./callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallbackComponent implements OnInit {


  constructor(
    private oauthService: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
  ) {
  }

  ngOnInit(): void {

    const {code, state} = this.route.snapshot.queryParams;
    this.cookieService.set('auth_code', code);
    this.cookieService.set('auth_state', state);
    window.close();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }


  getToken(): void {
    console.log(this.oauthService.getAccessToken());
  }
}
