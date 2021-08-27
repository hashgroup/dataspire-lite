import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {TokenService} from '../../../../services/token.service';
import {AuthApisService} from '../../../../apis/auth.apis.service';
import {InventoryApisService} from '../../../../apis/inventory.apis.service';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../../../environments/environment';
import {switchMap, tap} from 'rxjs/operators';
import {Process, TokenResponse} from '../../../../graphql/generated/graphql';
import {FormControl} from '@angular/forms';
import {ProcessApisService} from '../../../../apis/process/process.apis.service';
import {LoadingService} from '../../../../services/loading.service';
import {ActivatedRoute} from '@angular/router';
import {noop, Observable} from 'rxjs';


@Component({
  selector: 'app-authentication-flow',
  template: `
    <div class="grid-container full custom-step-container">
      <div class="flex-container flex-dir-column flex-child-auto align-center-middle align-self-middle width-50">
        <div class="margin-bottom-2">
          <p class="text-center">
            Press Authorize button below and login to your Apaleo account. Upon authenticated successfully, you shall be
            able
            to select which hotel data to be submit to AI model for processing. By default, all hotels data is selected.
          </p>
        </div>
        <div class="">
          <div class="flex-container flex-dir-column align-center-middle">
            <img src="../../../../../assets/logo-apaleo.png" class="margin-bottom-2" alt="logo apaleo">
            <button
              mat-raised-button
              color="primary"
              class="margin-bottom-2"
              [disabled]="(isLoading$ | async)"
              (click)="login()">
              Authorize
              <mat-icon>{{(token$|async) ? 'lock_outline' : 'lock_open'}}</mat-icon>
            </button>
          </div>
          <div class="">
            <mat-form-field
              *ngIf="(token$|async)"
              class="width-100"
              appearance="outline">
              <mat-label>Select hotel(s)</mat-label>
              <mat-select
                [disabled]="!properties"
                multiple
                [formControl]="hotelId">
                <mat-option
                  *ngFor="let i of properties"
                  [value]="i.id">
                  {{i.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>

          </div>
        </div>
      </div>
      <div class="flex-container align-justify margin-top-1">
        <a mat-icon-button color="primary" href="https://identity.apaleo.com/Account/Logout" target="_blank">
          Logout
        </a>
        <button
          mat-raised-button
          [disabled]="!hotelId.value || isProcess"
          color="primary" (click)="startProcess()">
          <mat-icon
            class="margin-left-1 text-success fa-spin"
            *ngIf="isProcess"
          >
            loop
          </mat-icon>
          Start AI Process
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./authentication-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationFlowComponent implements OnInit {

  @Output() nextStep = new EventEmitter<Process>();

  properties: { id: string, name: string }[];
  hotelId = new FormControl(null);
  scope: string;
  token$ = this.tokenService.token$;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  isProcess = false;

  constructor(
    private oauthService: OAuthService,
    private tokenService: TokenService,
    private authService: AuthApisService,
    private inventoryService: InventoryApisService,
    private cookieService: CookieService,
    private processApisService: ProcessApisService,
    private loadingService: LoadingService,
    private route: ActivatedRoute
  ) {
    this.scope = this.route.snapshot?.data?.scope?.allowScopeList?.join(' ');

  }

  ngOnInit(): void {
    const code = this.cookieService.get('auth_code');
    if (code?.length) {
      this.getProperties(code);
    }
  }

  login(): void {

    this.loadingService.setLoading(true);
    this.oauthService.initImplicitFlowInPopup({height: 600, width: 600})
      .then()
      .catch()
      .finally(() => {
        const code = this.cookieService.get('auth_code');
        this.getProperties(code);
      });
  }

  private getProperties(code): void {
    this.loadingService.setLoading(true);

    this.authService.exchangeToken({input: {code, redirectUrl: environment.authSetting.redirectUrl}})
      .pipe(
        tap(({accessToken, expiresIn, idToken, refreshToken, tokenType}: TokenResponse) => {
          this.tokenService.setToken({
            access_token: accessToken,
            refresh_token: refreshToken,
            scope: this.scope,
            token_type: tokenType,
            expires_in: expiresIn,
            id_token: idToken
          });
          this.cookieService.delete('auth_code');
        }),
        switchMap(() => this.inventoryService.inventories())
      ).subscribe(res => {
      this.properties = res;
      this.hotelId.setValue(res.map(x => x.id));
      this.loadingService.setLoading(false);
    });
  }

  startProcess(): void {
    this.isProcess = true;
    this.processApisService.startProcess({
      input: {
        hotelIdList: this.hotelId.value,
        refreshToken: this.tokenService.getRefreshToken(),
        processId: '123'
      }
    }).subscribe(
      (value) => this.nextStep.emit(value),
      noop,
      () => this.isProcess = false);

  }
}
