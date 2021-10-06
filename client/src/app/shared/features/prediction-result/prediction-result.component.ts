import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-prediction-result',
  template: `
    <p>
      prediction-result works!
    </p>
  `,
  styleUrls: ['./prediction-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PredictionResultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
