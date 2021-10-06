import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor() { }
  chartItemSelected = new Subject();
  chartItemSelected$ = this.chartItemSelected.asObservable();
  setChartItemSelected(value: string[]) {
    this.chartItemSelected.next(value);
  }

  getchartItemSelected() {
    return this.chartItemSelected$;
  }
}
