import { NgZorroAntdModule } from './../../../ng-zorro-antd.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { GuestComponent } from './components/guest/guest.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [GuestComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
  ],
  exports: [GuestComponent]
})
export class TableModule {
}
