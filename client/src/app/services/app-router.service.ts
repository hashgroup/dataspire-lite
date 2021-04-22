import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppRouterService {

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  updateRouteQueryParams(queryParams): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
      });
  }

}
