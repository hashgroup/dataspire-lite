import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CallbackComponent} from './callback.component';


const routes: Routes = [
  {path: '', component: CallbackComponent},
];

@NgModule({
  declarations: [CallbackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CallbackModule {
}
