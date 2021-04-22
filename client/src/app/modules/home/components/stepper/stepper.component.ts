import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Process} from '../../../../graphql/generated/graphql';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRouterService} from '../../../../services/app-router.service';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {LoadingService} from '../../../../services/loading.service';

@Component({
  selector: 'app-stepper',
  template: `
    <div class="grid-container margin-vertical-2">
      <mat-horizontal-stepper
        class="container stepper"
        [selectedIndex]="(stepperIdx$|async)"
        [linear]="isLinear"
        #stepper>
        <mat-step label="Data Preparation">
          <app-authentication-flow
            (nextStep)="handleStep($event ,1)">
          </app-authentication-flow>
        </mat-step>
        <mat-step label="AI Processing">
          <app-processing-flow
            *ngIf="(stepperIdx$|async) === 1"
            (nextStep)="handleStepResult(2)"
            (backStep)="backStep(0)">
          </app-processing-flow>
        </mat-step>
        <mat-step label="Prediction Result">
          <app-dashboard
            *ngIf="(stepperIdx$|async) === 2"
          >
            <div class="">
              <a
                mat-button
                color="primary"
                [routerLink]="['/','home']"
                [queryParams]="{step:0}">
                Back to home
              </a>
            </div>
            <a
              mat-raised-button
              color="primary"
              target="_blank"
              [routerLink]="['/','result']"
              [queryParams]="{id:(id$|async)}">
              <mat-icon>download</mat-icon>
              Save Dashboard as PDF
            </a>
            <a
              mat-raised-button
              color="primary"
              [href]="(file$|async)"
              target="_blank"
            >
              <mat-icon>download</mat-icon>
              Download results</a>
          </app-dashboard>
        </mat-step>
      </mat-horizontal-stepper>
    </div>
  `,
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent implements OnInit {
  isLinear = false;
  process: Process;
  stepperIdx$: Observable<number> = this.route.queryParams
    .pipe(
      map(x => {
        const step = (+x.step || 0);
        if (step > 2) {
          return 2;
        } else if (step < 0) {
          return 0;
        } else {
          return step;
        }
      }),
    );
  file$: Observable<string> = this.route.queryParams.pipe(map(x => `${environment.apiURL}/download/process/${x?.id}`));
  id$: Observable<string> = this.route.queryParams.pipe(map(x => `${x?.id}`));
  @ViewChild('pageEle') ref: ElementRef<HTMLDivElement>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private appRouterService: AppRouterService) {
  }

  ngOnInit(): void {

  }

  handleStep(evt: Process, stepIdx: number = 0): void {
    // this.stepperIdx = stepIdx;
    this.process = evt;
    this.appRouterService.updateRouteQueryParams({step: stepIdx, id: evt.id});
  }

  handleStepResult(stepIdx: number): void {
    // this.stepperIdx = stepIdx;
    const queryParams = this.route.snapshot.queryParams;
    this.appRouterService.updateRouteQueryParams({...queryParams, step: stepIdx});
  }

  changeStep(evt: StepperSelectionEvent): void {
    // this.stepperIdx = evt.selectedIndex;
  }

  backStep(stepIdx: number): void {
    // this.stepperIdx = stepIdx;
    const queryParams = this.route.snapshot.queryParams;
    this.appRouterService.updateRouteQueryParams({...queryParams, step: stepIdx});
  }
}
