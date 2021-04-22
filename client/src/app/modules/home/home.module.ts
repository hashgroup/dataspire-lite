import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ChartModule} from '../../shared/features/chart/chart.module';
import {MatSelectModule} from '@angular/material/select';
import {StepperComponent} from './components/stepper/stepper.component';
import {AuthenticationFlowComponent} from './components/authentication-flow/authentication-flow.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ScopeResolver} from '../../scope.resolver';
import {ProcessingFlowComponent} from './components/processing-flow/processing-flow.component';
import {DashboardModule} from '../../shared/features/dashboard/dashboard.module';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      scope: ScopeResolver
    },
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    StepperComponent,
    AuthenticationFlowComponent,
    ProcessingFlowComponent,
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatStepperModule,
    MatFormFieldModule,
    ChartModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DashboardModule,

  ]
})
export class HomeModule {
}
