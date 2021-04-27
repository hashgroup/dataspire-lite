import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {ScopeResolver} from './scope.resolver';

const routes: Routes = [
  {
    component: AppComponent,
    path: '',
    resolve: {
      scope: ScopeResolver
    },
    children:
      [
        {
          path: 'home',
          loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
        },
        {
          path: 'result',
          loadChildren: () => import('./modules/analytic-result/analytic-result.module').then(m => m.AnalyticResultModule)
        },
        {path: '', redirectTo: '/home', pathMatch: 'full'},
      ],
  },
  {
    path: 'callback',
    loadChildren: () => import('./modules/callback/callback.module').then(m => m.CallbackModule)

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRouting {
}
