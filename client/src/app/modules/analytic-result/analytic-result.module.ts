import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AnalyticResultComponent} from './analytic-result.component';
import {ChartModule} from '../../shared/features/chart/chart.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {DashboardModule} from "../../shared/features/dashboard/dashboard.module";


const routes: Routes = [
  {path: '', component: AnalyticResultComponent,},
];

@NgModule({
  declarations: [
    AnalyticResultComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DashboardModule
  ]
})
export class AnalyticResultModule {
}
