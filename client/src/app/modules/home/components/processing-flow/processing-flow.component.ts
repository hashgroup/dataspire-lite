import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProcessApisService} from '../../../../apis/process/process.apis.service';
import {ActivatedRoute} from '@angular/router';
import {interval, Observable} from 'rxjs';
import {Process, ProcessStatusEnum} from '../../../../graphql/generated/graphql';
import {shareReplay, startWith, switchMap, takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-processing-flow',
  template: `
    <div class="grid-container full custom-step-container">
      <div class="flex-container flex-dir-column flex-child-auto align-center-middle align-self-middle width-50">
        <div class="margin-bottom-2">
          <p class="text-center">
            Hotel Data is being processed by AI Models : Guest Segmentation, Customer Lifetime Value Classification, VIP
            Guest Prediction. Please try to press Refresh button after 1 minute to check if the result is ready.
          </p>
        </div>
        <div class="">
          <div class="flex-container flex-dir-column align-center-middle">
            <img src="../../../../../assets/process.png" class="margin-bottom-2" alt="process">
            <div
              class="flex-container flex-dir-column margin-bottom-1"
              *ngIf="(process$|async) as process; else loading">
              <div class="flex-container align-center-middle">
                <h3 class="margin-bottom-0"><strong>{{process?.status}}</strong></h3>
                <mat-icon
                  class="margin-left-1 text-success"
                  *ngIf="process?.status === processStatus?.Ready">
                  check
                </mat-icon>

                <mat-icon
                  class="margin-left-1 text-success fa-spin"
                  *ngIf="process?.status === processStatus?.Processing"
                >
                  loop
                </mat-icon>
              </div>
              <p *ngIf="process?.status === processStatus?.Error">{{process?.message}}</p>
            </div>

          </div>

        </div>
      </div>

      <div class="flex-container align-justify margin-top-1">
        <button mat-icon-button color="primary" (click)="backStep.emit()">
          <mat-icon>keyboard_backspace</mat-icon>
        </button>

        <button
          mat-raised-button
          color="primary"
          *ngIf="(process$ | async)?.status === processStatus.Ready"
          (click)="nextStep.emit(null)">
          View results
        </button>

        <button
          mat-raised-button
          color="primary"
          *ngIf="(process$ | async)?.status === processStatus.Processing"
          (click)="refresh()">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      </div>
    </div>

    <ng-template #loading>
      <div class="flex-container align-center-middle">
        <h3 class="margin-bottom-0"><strong>Loading</strong></h3>
        <mat-icon
          class="margin-left-1 text-success fa-spin"
        >
          loop
        </mat-icon>
      </div>
    </ng-template>
  `,
  styleUrls: ['./processing-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessingFlowComponent implements OnInit {
  @Output() nextStep = new EventEmitter<Process>();
  @Output() backStep = new EventEmitter<Process>();

  process$: Observable<Process>;
  processId: string;

  processStatus = ProcessStatusEnum;

  constructor(
    private processApiService: ProcessApisService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.processId = this.route.snapshot?.queryParams?.id;
    this.process$ = interval(1000).pipe(
      startWith(0),
      switchMap(() => this.processApiService.getProcessState({filter: {processId: this.processId}})),
      takeWhile(val => val?.status !== this.processStatus.Ready, true),
      shareReplay(3)
    );

  }

  refresh(): void {
    this.process$ = interval(2000).pipe(
      startWith(0),
      switchMap(() => this.processApiService.getProcessState({filter: {processId: this.processId}})),
      takeWhile(val => val?.status !== this.processStatus.Ready, true),
      shareReplay(3)
    );
  }
}
