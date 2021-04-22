import {ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild} from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-analytic-result',
  template: `
    <div class="grid-container full">
      <mat-card class="example-card">
        <mat-card-content>
          <div #pageEle class="margin-top-2">
            <app-dashboard></app-dashboard>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <div class="flex-container align-justify">
            <a
              mat-stroked-button
              color="primary"
              routerLink="/home">
              <mat-icon>home</mat-icon>
              Back to home
            </a>

            <button
              mat-raised-button
              color="primary"
              (click)="openPDF()">
              <mat-icon>download</mat-icon>
              Save Dashboard as PDF
            </button>
          </div>
        </mat-card-actions>
      </mat-card>

    </div>
  `,
  styleUrls: ['./analytic-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticResultComponent {
  @ViewChild('pageEle') ref: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {
  }

  public openPDF(): void {
    const DATA = this.ref.nativeElement;

    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        html2canvas(DATA, {backgroundColor: '#263138'}).then(canvas => {

          const fileWidth = 208;
          const fileHeight = canvas.height * fileWidth / canvas.width;

          const FILEURI = canvas.toDataURL('image/png');
          const PDF = new jsPDF('p', 'mm', 'a4');
          const position = 0;
          PDF.addImage(FILEURI, 'JPEG', 0, position, fileWidth, fileHeight);

          PDF.save('dataspire-lite.pdf');
        });
      });
    }

  }
}
