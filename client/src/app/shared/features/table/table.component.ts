import { isPlatformBrowser } from "@angular/common";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from "@angular/core";

import { Column, DEFAULT_PAGE_SIZE_OPTIONS } from "./table.definition";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnChanges, OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @Input() rows: any[] = [];
  @Input() columns: Column[] = [];
  @Input() pageSizeOptions: number[] = DEFAULT_PAGE_SIZE_OPTIONS;

  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {
  }

  // Run the function only in the browser
  browserOnly = (f: () => void): void => {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnChanges({ rows }: SimpleChanges): void {
    this.browserOnly(() => {
      if (rows.currentValue) {
        this.dataSource = new MatTableDataSource(rows.currentValue);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(row => row.key);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
