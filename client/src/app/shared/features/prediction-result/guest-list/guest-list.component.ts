import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ProcessApisMockService } from 'src/app/apis/process/process.apis.mock.service';
import { ProcessApisService } from 'src/app/apis/process/process.apis.service';
import { GuestService } from 'src/app/services/guest.service';
import { environment } from 'src/environments/environment';
import FuzzySearch from 'fuzzy-search';
import { ActivatedRoute } from '@angular/router';
export interface Guest {
  fullname: string;
  email: string;
  low: number;
  mid: number;
  high: number;
  type: string;
}

interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-guest-list',
  template: `
    <div class="grid-container full guest-container">
      <div class="grid-x grid-padding-x align-right">
        <div>
          <mat-form-field appearance="standard" class="">
            <mat-label>Filter</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Ex. test" #input>
          </mat-form-field>
        </div>
        <div class="guest-select">
          <mat-form-field appearance="standard">
            <mat-label>Choose an option</mat-label>
                <mat-select [(ngModel)]="selectedValue" name="type" (selectionChange)="selectionChange($event)">
                  <mat-option *ngFor="let type of types" [value]="type.value">
                    {{type.viewValue}}
                  </mat-option>
                </mat-select>
          </mat-form-field>
        </div>
      </div>
    
    


<table mat-table [dataSource]="guests" class="guest-table-info">
<ng-container matColumnDef="fullname">
    <th mat-header-cell *matHeaderCellDef> Fullname </th>
    <td mat-cell *matCellDef="let element"> {{element.fullname}} </td>
  </ng-container>
  <ng-container matColumnDef="email">
    <th mat-header-cell *matHeaderCellDef> Email </th>
    <td mat-cell *matCellDef="let element"> {{element.email}} </td>
  </ng-container>
  <ng-container matColumnDef="type">
    <th mat-header-cell *matHeaderCellDef> Type </th>
    <td mat-cell *matCellDef="let element"> {{element.type}} </td>
  </ng-container>
  <ng-container matColumnDef="low">
    <th mat-header-cell *matHeaderCellDef> Low </th>
    <td mat-cell *matCellDef="let element"> {{element.low}} </td>
  </ng-container>
  <ng-container matColumnDef="mid">
    <th mat-header-cell *matHeaderCellDef> Mid </th>
    <td mat-cell *matCellDef="let element"> {{element.mid}} </td>
  </ng-container>

  <ng-container matColumnDef="high">
    <th mat-header-cell *matHeaderCellDef> high </th>
    <td mat-cell *matCellDef="let element"> {{element.high}} </td>
  </ng-container>
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

  <!-- Row shown when there is no matching data. -->
  <tr class="mat-row" *matNoDataRow>
    <td class="mat-cell" colspan="4">No data matching the filter</td>
  </tr>
</table>

<mat-paginator #paginator [pageSizeOptions]="[5, 10, 20]"
                 showFirstLastButtons 
                 aria-label="Select page of guest list">
  </mat-paginator>
  `,
  styleUrls: ['./guest-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ProcessApisService,
      useClass: environment.production ? ProcessApisService : ProcessApisMockService,
    },
  ]
})


export class GuestListComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private processApiService: ProcessApisService, private guestService: GuestService,
     private cdr: ChangeDetectorRef,
     private route: ActivatedRoute) { }
  displayedColumns: String[] = ["fullname", "email", "type", "low", "mid", "high"];
  guests: MatTableDataSource<Guest>;
  unscrible = new Subject();
  resultsLength: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedValue: string;
  selectedCar: string;
  types: Type[] = [
    { value: '1st-Time Guest', viewValue: '1st-Time Guest' },
    { value: 'Returning Guest', viewValue: 'Returning Guest' },
  ];
  dataStore: Guest[] = [];

  ngOnInit(): void {
    const processId = this.route.snapshot.queryParams?.id;
    combineLatest(this.guestService.getchartItemSelected(), this.processApiService.getCustomerLifetimeValueList({ filter: { processId } })).pipe(
      tap(([nameFilter, resData]) => {
        let _nameFilter: string[] = [...[], ...nameFilter as string[]];
        let results = [...[], ...resData];
        results = results.filter(item => _nameFilter?.includes(item.type))
          .map(i => ({
            fullname: `${i?.firstName} ${i?.lastName}`,
            email: i?.email,
            low: i?.low,
            mid: i?.mid,
            high: i?.high,
            type: i?.type
          }))

        this.updateDatasource(results as Guest[]);
        this.dataStore = [...[], ...results as Guest[]];
        this.cdr.detectChanges();
      })
    ).subscribe()
  }

  ngAfterViewInit() {
    const processId = this.route.snapshot.queryParams?.id;
    this.processApiService.getCustomerLifetimeValueList({ filter: { processId } })
      .pipe(
        takeUntil(this.unscrible),
        map(x => x?.map(i => ({
          fullname: `${i?.firstName} ${i?.lastName}`,
          email: i?.email,
          low: i?.low,
          mid: i?.mid,
          high: i?.high,
          type: i?.type
        })))).subscribe(rs => {
          this.updateDatasource(rs);
          this.dataStore = [...[], ...rs as Guest[]];
        });
  }

  ngOnDestroy() {
    if (this.unscrible) {
      this.unscrible.next();
      this.unscrible.complete();
    }
  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searcher = new FuzzySearch(this.guests.data, ["fullname"], {
      caseSensitive: false
    });
    const result = searcher.search(filterValue.trim().toLowerCase());
    this.updateDatasource(result);

    if (filterValue.trim().toLowerCase() == '') {
      this.guests = new MatTableDataSource<Guest>([...[], ...this.dataStore]);
      this.updateDatasource(this.dataStore);
    }
  }

  updateDatasource(data: Guest[]) {
    this.guests = new MatTableDataSource<Guest>([...[], ...data]);
    this.paginator.pageIndex = 0;
    this.guests.paginator = this.paginator;
  }



  selectionChange(event: any) {
    this.guestService.setChartItemSelected([this.selectedValue]);
  }

}
