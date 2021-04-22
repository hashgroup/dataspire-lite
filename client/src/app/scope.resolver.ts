import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthApisService} from './apis/auth.apis.service';
import {ApaleoClient} from './graphql/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class ScopeResolver implements Resolve<ApaleoClient> {
  constructor(private authService: AuthApisService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApaleoClient> {
    return this.authService.getApaleoClient();
  }
}
