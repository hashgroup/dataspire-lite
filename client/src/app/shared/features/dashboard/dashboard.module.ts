import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from "./dashboard.component";
import {StatisticComponent} from "./statistic/statistic.component";
import {ChartModule} from "../chart/chart.module";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import { GuestListModule } from '../guest-list/guest-list.module';


@NgModule({
  declarations: [DashboardComponent,
    StatisticComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    MatButtonModule,
    RouterModule,
    GuestListModule
  ],
  exports: [DashboardComponent,
    StatisticComponent
  ]
})
export class DashboardModule {
}
