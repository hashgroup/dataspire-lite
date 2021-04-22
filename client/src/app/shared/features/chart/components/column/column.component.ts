import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-column',
  template: `
    <div #chartEle [style.height.px]="height"></div>
  `,
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('chartEle') chartEle: ElementRef<HTMLDivElement>;
  @Input() height = 350;
  @Input() data: Array<{
    category: string;
    first: number;
    second: number;
  }>;

  private chart: am4charts.XYChart;

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

  ngOnInit(): void {
  }


  ngOnChanges({data}: SimpleChanges): void {
    this.browserOnly(() => {
      if (this.chart && data.currentValue) {
        this.chart.data = data.currentValue;
      }
    });
  }

  ngAfterViewInit(): void {
    this.browserOnly(() => {
      const ele = this.chartEle.nativeElement;
      const chart = am4core.create(ele, am4charts.XYChart);

      chart.colors.step = 2;

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.marginLeft = 20;
      chart.legend.labels.template.maxWidth = 95;

      const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = 'category';
      xAxis.renderer.cellStartLocation = 0.1;
      xAxis.renderer.cellEndLocation = 0.9;
      xAxis.renderer.grid.template.location = 0;


      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;

      function createSeries(value, name): am4charts.ColumnSeries {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = value;
        series.dataFields.categoryX = 'category';
        series.name = name;

        // series.events.on('hidden', arrangeColumns);
        // series.events.on('shown', arrangeColumns);

        const bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.interactionsEnabled = false;
        bullet.dy = 30;
        bullet.label.text = '{valueY}';
        bullet.label.fill = am4core.color('#ffffff');

        return series;
      }

      createSeries('first', '1st-Time Guest');
      createSeries('second', 'Returning Guest');

      function arrangeColumns(): void {

        const series = chart.series.getIndex(0);

        const w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
          const x0 = xAxis.getX(series.dataItems.getIndex(0), 'categoryX');
          const x1 = xAxis.getX(series.dataItems.getIndex(1), 'categoryX');
          const delta = ((x1 - x0) / chart.series.length) * w;
          if (am4core.isNumber(delta)) {
            const middle = chart.series.length / 2;

            let newIndex = 0;
            chart.series.each((series) => {
              if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
              } else {
                series.dummyData = chart.series.indexOf(series);
              }
            });
            const visibleCount = newIndex;
            const newMiddle = visibleCount / 2;

            chart.series.each((series) => {
              const trueIndex = chart.series.indexOf(series);
              const newIndex = series.dummyData;

              const dx = (newIndex - trueIndex + middle - newMiddle) * delta;

              series.animate({property: 'dx', to: dx}, series.interpolationDuration, series.interpolationEasing);
              series.bulletsContainer.animate({
                property: 'dx',
                to: dx
              }, series.interpolationDuration, series.interpolationEasing);
            });
          }
        }
      }

// Cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = 'panX';
      chart.data = this.data;
      this.chart = chart;

    });
  }


  ngOnDestroy(): void {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
