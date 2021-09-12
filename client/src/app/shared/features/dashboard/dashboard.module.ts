import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DashboardComponent} from "./dashboard.component";
import {StatisticComponent} from "./statistic/statistic.component";
import {ChartModule} from "../chart/chart.module";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {RouterModule} from "@angular/router";
import { TableModule } from '../table/table.module';

@NgModule({
  declarations: [DashboardComponent,
    StatisticComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
  ],
  exports: [DashboardComponent,
    StatisticComponent
  ]
})
export class DashboardModule {
}
