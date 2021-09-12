import {ActivatedRoute} from '@angular/router';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {CookieService} from 'ngx-cookie-service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {environment} from '../../../../environments/environment';
import {ProcessApisMockService} from '../../../apis/process/process.apis.mock.service';
import {ProcessApisService} from '../../../apis/process/process.apis.service';
import {Statistic} from '../../../graphql/generated/graphql';
import {TokenService} from '../../../services/token.service';

import { GuestInfo, GuestType, GUEST_COLUMNS } from './dashboard.definition';

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
      <div class="grid-x">
        <div class="cell flex-container align-justify margin-top-2">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="grid-x margin-top-2">
        <form class="search-form-container" [formGroup]="formSearch">
          <mat-form-field appearance="fill" class="margin-right-1">
            <mat-label>Search by name</mat-label>
            <input matInput placeholder="Search by name" formControlName="name" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option *ngFor="let option of guestInfoData$ | async" [value]="option.fullName">
                {{option.fullName}}
              </mat-option>
            </mat-autocomplete>
            <mat-icon matPrefix aria-hidden="false" aria-label="Search">search</mat-icon>
            <mat-icon matSuffix aria-hidden="false" aria-label="Clear" (click)="clearFilter($event, 'name')">clear</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Search by type</mat-label>
            <mat-select formControlName="type" [disableOptionCentering]="true">
              <mat-option *ngFor="let type of guestTypes" value="{{type}}">{{type}}</mat-option>
            </mat-select>
            <mat-icon matSuffix aria-hidden="false" aria-label="Clear" (click)="clearFilter($event, 'type')">clear</mat-icon>
          </mat-form-field>
        </form>
      </div>

      <div class="grid-x" *ngIf="(guestInfoData$ | async) as guestRows">
        <div class="cell">
          <app-table [columns]="guestColumns" [rows]="guestRows"></app-table>
        </div>
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
  guestInfoData$: Observable<Array<GuestInfo>>;
  clv$: Observable<Array<{
    category: string;
    first: number;
    second: number;
  }>>;

  guestColumns = GUEST_COLUMNS;
  formSearch: FormGroup;
  guestTypes = Object.values(GuestType);

  constructor(
    private processApiService: ProcessApisService,
    private cookieService: CookieService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    ) {
  }

  private updateData(): void {
    const processId = this.route.snapshot.queryParams?.id;

    // Allows approximate search customer by name (on table)
    const guestName = this.formSearch.get('name').value;

    // Filter data shall reflect on the 2 charts above.
    // Type of filter: Returing guest / 1st - Time guest.
    const guestType = this.formSearch.get('type').value;

    // get segment data (left chart)
    this.segmentationData$ = this.processApiService.getIdentifiedGuestSegmentation({ filter: { processId } })
      .pipe(map(function(resp) {
        let updatedResp = resp?.map(function (i) {
          return { name: i?.segment, value: i?.value };
        });
        if (guestType && updatedResp.length) {
          updatedResp = updatedResp.filter(function(seg) {
            return (guestType === seg.name);
          });
        }
        return updatedResp;
      }));

    // get bar chart data (right chart)
    this.clv$ = this.processApiService.getClvClassList({ filter: { processId } })
      .pipe(map(x => x?.map(i => ({
        category: i?.name,
        first: !guestType || guestType === GuestType.firstTime ? i?.typeList?.find(e => e?.name === GuestType.firstTime)?.value : 0,
        second: !guestType || guestType === GuestType.returning ? i?.typeList?.find(e => e?.name === GuestType.returning)?.value : 0,
      }))));

    // get row data table
    this.guestInfoData$ = this.processApiService.getCustomerLifetimeValueList({ filter: { processId } })
      .pipe(map(function(resp) {
        let updatedResp = resp?.map(function(i) {
          return new GuestInfo(i);
        });
        if (guestName || guestType) {
          updatedResp = updatedResp.filter(function(guestInfo) {
            let matched = true;
            if (guestType) {
              matched = (guestInfo?.type === guestType);
            }
            if (guestName && matched) {
              matched = guestInfo?.fullName?.includes(guestName);
            }
            return matched;
          });
        }
        return updatedResp;
      }));
  }

  ngOnInit(): void {
    // Init form search
    this.formSearch = this.fb.group({
      name: new FormControl(''),
      type: new FormControl(''),
    });

    const processId = this.route.snapshot.queryParams?.id;
    this.count$ = this.processApiService.getTotalRecordCount({filter: {processId}});
    this.statistic$ = this.processApiService.getStatistic({filter: {processId}});
    // update data to display from rawData
    this.updateData();


    // Filter data since formSearch has changed (user inputted to search)
    this.formSearch.valueChanges.subscribe(this.updateData.bind(this));

  }

  /**
   * Clear filtered data when click X icon
   * @param $event is mouse click event, it should be ignore (don't show dropdown)
   * @param controlName is field's formControlName
   */
  clearFilter($event: MouseEvent, controlName: string): void {
    $event.stopPropagation();
    this.formSearch.get(controlName).setValue('');
  }
}
