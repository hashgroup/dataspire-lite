import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRouting} from './app.routing';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {OAuthModule} from 'angular-oauth2-oidc';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { IconDefinition } from '@ant-design/icons-angular';

import * as AllIcons from '@ant-design/icons-angular/icons';

registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    FormsModule,

  ],
  providers: [{ provide: NZ_I18N, useValue: en_US },{ provide: NZ_ICONS, useValue: icons }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
