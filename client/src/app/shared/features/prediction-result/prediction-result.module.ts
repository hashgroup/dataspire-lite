import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionResultComponent } from './prediction-result.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [PredictionResultComponent, GuestListComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule
  ],
  exports: [
    GuestListComponent
  ]
})
export class PredictionResultModule { }
