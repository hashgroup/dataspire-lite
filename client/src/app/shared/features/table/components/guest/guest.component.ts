import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CustomerLifetimeValue } from 'src/app/graphql/generated/graphql';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

import * as _ from 'lodash';

@Component({
  selector: 'app-guest',
  template: `
    <div class="app-guest">
    <nz-table nzFrontPagination="true" (nzPageIndexChange)="pageIndexChange()" nzShowPagination="true" [nzPageSize]="5"
    #listGuestTable [nzData]="listOfFilterSearching" [nzScroll]="{ x: '1100px' }"
    >
      <thead>
        <tr>
        <th  [nzAlign]="'center'" nzCustomFilter [nzSortFn]="sortFnName">
            Full Name
            <nz-filter-trigger [(nzVisible)]="visible" [nzActive]="searchValue.length > 0" [nzDropdownMenu]="menu">
              <i nz-icon nzType="search"></i>
            </nz-filter-trigger>
          </th>
          <th  [nzAlign]="'center'" *ngFor="let column of listOfColumns"   [nzSortFn]="column.compare">
            {{column.title}}
          </th>


        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of listGuestTable.data">
        <td >{{ data.firstName + " "+ data.lastName }}</td>
          <td [nzAlign]="'center'">{{ data.email }}</td>
          <td [nzAlign]="'center'">{{ data.type }}</td>
          <td [nzAlign]="'center'" >{{ data.low }}</td>
          <td [nzAlign]="'center'">{{ data.mid }}</td>
          <td [nzAlign]="'center'">{{ data.high }}</td>
        </tr>
      </tbody>
    </nz-table>
    <nz-dropdown-menu #menu="nzDropdownMenu">
      <div class="ant-table-filter-dropdown">
        <div class="search-box">
          <input type="text" nz-input placeholder="Search name" (keyup.enter)="search()" [(ngModel)]="searchValue" />
          <button nz-button nzSize="small" nzType="primary" (click)="search()" class="search-button">Search</button>
          <button nz-button nzSize="small" (click)="reset()">Reset</button>
        </div>
      </div>
    </nz-dropdown-menu>
    </div>
  `,
  styleUrls: ['./guest.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestComponent {
  @Input() data: Array<CustomerLifetimeValue>;
  @Input() listSeriesVisible: Array<any>;
  listOfDisplayData: Array<CustomerLifetimeValue>;
  listOfFilterSearching: Array<CustomerLifetimeValue>;

  listOfColumns: Array<any>;
  visible: boolean;
  searchValue: string;
  sortFnName: any;
  constructor(private cd: ChangeDetectorRef) {
    this.visible = false;
    this.searchValue= '';
    this.listOfColumns = [
      {
        title: 'Email',
        compare: (a: CustomerLifetimeValue, b: CustomerLifetimeValue) => a.email.localeCompare(b.email),
      },
      {
        title: 'Type',
        compare: (a: CustomerLifetimeValue, b: CustomerLifetimeValue) => a.type.localeCompare(b.type),
      },
      {
        title: 'Low',
        compare: (a: CustomerLifetimeValue, b: CustomerLifetimeValue) => a.low - b.low,
      },
      {
        title: 'Mid',
        compare: (a: CustomerLifetimeValue, b: CustomerLifetimeValue) => a.mid - b.mid,
      },
      {
        title: 'High',
        compare: (a: CustomerLifetimeValue, b: CustomerLifetimeValue) => a.high - b.high,

      },

    ]
    this.sortFnName = (a: CustomerLifetimeValue, b: CustomerLifetimeValue) => a.firstName.localeCompare(b.firstName)
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  ngOnChanges(changes: any): void {
    this.filterData()
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }
  reset(): void {
    this.searchValue = '';
    this.search();
  }
  filterData() {
    let result = new Array<CustomerLifetimeValue>()
    this.listOfDisplayData = new Array<CustomerLifetimeValue>()
    this.listSeriesVisible.forEach(el => {
      if (el.visible) {
        this.listOfDisplayData = this.listOfDisplayData.concat(this.data.filter((item: CustomerLifetimeValue) => item.type == el.name))
      }
    })
    this.listOfFilterSearching = this.listOfDisplayData

  }
  search(): void {
    this.visible = false;
    this.listOfFilterSearching = this.listOfDisplayData.filter((item: CustomerLifetimeValue) => {
      return item.firstName.toUpperCase().trim().indexOf(this.searchValue.toUpperCase().trim()) !== -1
        || item.lastName.toUpperCase().trim().indexOf(this.searchValue.toUpperCase().trim()) !== -1
    });
  }
  pageIndexChange() {
    this.cd.detectChanges()
  }
}

