import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ProcessApisService} from '../../../apis/process/process.apis.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Statistic} from '../../../graphql/generated/graphql';
import {map} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {TokenService} from '../../../services/token.service';
import {environment} from '../../../../environments/environment';
import {ProcessApisMockService} from '../../../apis/process/process.apis.mock.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="grid-container full">
      <app-statistic
        *ngIf="(statistic$ | async) as statistic"
        [totalRecord]="count$|async"
        [highValueGuest]="statistic.highValueGuest"
        [potentialGuest]="statistic.totalPotentialVipGuest"
        [totalGuest]="statistic.totalIdentifiedGuest"
      ></app-statistic>
      <div class="grid-x grid-margin-x">
        <div class="cell medium-5">
          <ng-container *ngIf="(segmentationData$ | async) as data">
            <app-pie
              [data]="data">
            </app-pie>
          </ng-container>

        </div>
        <div class="cell medium-7">
          <ng-container *ngIf="(clv$ | async) as data">
            <app-column
              [data]="data">
            </app-column>
          </ng-container>

        </div>
      </div>
      <div class="flex-container align-justify margin-top-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ProcessApisService,
      useClass: environment.production ? ProcessApisService : ProcessApisMockService,
    },
  ]
})
export class DashboardComponent implements OnInit {

  statistic$: Observable<Statistic>;
  count$: Observable<number>;
  segmentationData$: Observable<Array<{ name: string, value: number }>>;
  clv$: Observable<Array<{
    category: string;
    first: number;
    second: number;
  }>>;

  constructor(
    private processApiService: ProcessApisService,
    private cookieService: CookieService,
    private tokenService: TokenService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const processId = this.route.snapshot.queryParams?.id;
    this.count$ = this.processApiService.getTotalRecordCount({filter: {processId}});
    this.statistic$ = this.processApiService.getStatistic({filter: {processId}});
    this.segmentationData$ = this.processApiService.getIdentifiedGuestSegmentation({filter: {processId}})
      .pipe(map(x => x?.map(i => ({name: i?.segment, value: i?.value}))));

    this.clv$ = this.processApiService.getClvClassList({filter: {processId}})
      .pipe(map(x => x?.map(i => ({
          category: i?.name,
          first: i?.typeList?.find(e => e?.name === '1st-Time Guest')?.value,
          second: i?.typeList?.find(e => e?.name === 'Returning Guest')?.value,
        }))),
      );


  }

}
