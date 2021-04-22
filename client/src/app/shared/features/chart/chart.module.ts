import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColumnComponent} from './components/column/column.component';
import {PieComponent} from './components/pie/pie.component';


@NgModule({
  declarations: [ColumnComponent, PieComponent],
  imports: [
    CommonModule
  ],
  exports: [ColumnComponent, PieComponent]
})
export class ChartModule {
}
