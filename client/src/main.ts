import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import * as am4core from '@amcharts/amcharts4/core';
import {useTheme} from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

// tslint:disable-next-line:variable-name
const am4themes_myTheme = (target) => {
  if (target instanceof am4charts.Axis) {
    // target.background.fill = am4core.color('#DCCCA3');
  }
  if (target instanceof am4core.ColorSet) {
    target.list = [
      am4core.color('#489976')
    ];
  }
};


useTheme(am4themes_animated);
useTheme(am4themes_dark);
useTheme(am4themes_myTheme);

if (environment.production) {
  enableProdMode();
  window.console.log = () => {
  };
  window.console.error = () => {
  };
  window.console.warn = () => {
  };
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
