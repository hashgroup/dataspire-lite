import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ProcessApisService } from 'src/app/apis/process/process.apis.service';
import { CustomerLifetimeValue } from 'src/app/graphql/generated/graphql';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GuestListService } from './guest-list.service';

interface CustomerType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestListComponent implements OnInit, OnDestroy, AfterViewInit {
  unsubscribe$: Subject<any> = new Subject();

  dataSource: MatTableDataSource<CustomerLifetimeValue>;
  dataCount: number;

  query = null;
  customerType: CustomerType[] = [
    { value: null, viewValue: 'None' },
    { value: '1st-Time Guest', viewValue: '1st-Time guest' },
    { value: 'Returning Guest', viewValue: 'Returning guest' },
  ];

  displayedColumns: string[] = [
    'fullName',
    'email',
    'type',
    'low',
    'mid',
    'high'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private processApiService: ProcessApisService,
    private guestListService: GuestListService
  ) {}

  ngOnInit(): void {
    this.fetchLifetimeCustomerValue();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchLifetimeCustomerValue() {
    const processId = this.route.snapshot.queryParams?.id;
    this.processApiService
      .getCustomerLifetimeValueList({ filter: { processId } })
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((customer: CustomerLifetimeValue[]) => {
          this.dataCount = customer.length;
        }),
        map(this.appendCustomerData),
        map(this.applyQuery)
      )
      .subscribe((customer: CustomerLifetimeValue[]) => {
        this.dataSource = new MatTableDataSource(customer);
        this.filterSegmentationData(customer);
        this.filterClvData(customer);
      });
  }

  filterClvData(customers: CustomerLifetimeValue[]){
    const clvData = [
      {
        category: 'Low', first: 0, second: 0
      },
      {
        category: 'Medium', first: 0, second: 0
      },
      {
        category: 'High', first: 0, second: 0
      }
    ];
    Object.values(customers.reduce((a, {type, low, mid, high}) => {
      if(type === '1st-Time Guest'){
        Math.round(low) && (clvData[0].first += 1)
        Math.round(mid) && (clvData[1].first += 1)
        Math.round(high) && (clvData[2].first += 1)
      } else {
        Math.round(low) && (clvData[0].second += 1)
        Math.round(mid) && (clvData[1].second += 1)
        Math.round(high) && (clvData[2].second += 1)
      }
      return a;
    }, {}));
    this.guestListService.clvClassListDataChanged.next(clvData);
  }

  filterSegmentationData(customers: CustomerLifetimeValue[]){
    const result = Object.values(customers.reduce((a, {type}) => {
      a[type] = a[type] || {name: type, value: 0};
      a[type].value += 1;
      return a;
    }, {}));
    const segmentationData = result.map(data => {
      return {...data, value: data.value / this.dataCount}
    });
    this.guestListService.segmentationDataChanged
    .next(segmentationData);
  }

  appendCustomerData(customers: CustomerLifetimeValue[]) {
    return customers.map((customer: CustomerLifetimeValue) => {
      const { firstName, lastName } = customer;
      const fullName = `${firstName} ${lastName}`;
      return { ...customer, fullName };
    });
  }

  applyQuery = (customers: CustomerLifetimeValue[]) => {
    if (!this.query) {
      return customers;
    }
    return customers.filter(
      (customer: CustomerLifetimeValue) => customer.type === this.query
    );
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelect(event: Event) {
    this.query = event;
    this.fetchLifetimeCustomerValue();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
