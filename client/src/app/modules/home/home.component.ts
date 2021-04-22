import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LoadingService} from '../../services/loading.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  template: `

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav-content>
        <div class="flex-container flex-dir-column flex-child-auto height-100">
          <div class="">
            <mat-toolbar color="primary">
              <span class="h2 margin-bottom-0 text-bold">{{title}}</span>
              <span class="h2 margin-bottom-0 text-light">lite</span>
              <div class="space"></div>
              <div class="lgo">
                <img class="height-100" src="../../../assets/HCGlogo-Transparent-White.png" alt="HCG logo">
              </div>
            </mat-toolbar>
            <mat-progress-bar *ngIf="isLoading$|async" mode="indeterminate"></mat-progress-bar>
          </div>
          <div class="flex-child-auto">
            <app-stepper></app-stepper>
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>

  `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  title = 'Dataspire';
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService,
  ) {
  }

  ngOnInit(): void {
  }


}
