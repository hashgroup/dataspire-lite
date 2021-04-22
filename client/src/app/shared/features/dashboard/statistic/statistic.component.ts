import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-statistic',
  template: `
    <div class="grid-x grid-margin-x margin-bottom-1">
      <div class="cell medium-5 grid-x grid-margin-x">
        <div class="cell medium-6 text-center bordered padding-1">
          <h3 class="margin-bottom-0">Total Processed Records</h3>
          <h2 class="text-bold margin-bottom-0">{{(totalRecord|number) || '--'}}</h2>
        </div>
        <div class="cell medium-6 text-center bordered padding-1">
          <h3 class="margin-bottom-0">Total Identifiable Guests</h3>
          <h2 class="text-bold margin-bottom-0">{{(totalGuest|number) || '--'}}</h2>
        </div>
      </div>
      <div class="cell medium-7 grid-x grid-margin-x">
        <div class="cell auto text-center bordered padding-1">
          <h3 class="margin-bottom-0">Potential VIP Guests</h3>
          <h2 class="text-bold margin-bottom-0">{{(potentialGuest|number) || '--'}}</h2>
        </div>
        <div class="cell auto text-center bordered padding-1">
          <h3 class="margin-bottom-0">VIP Guests</h3>
          <h2 class="text-bold margin-bottom-0">{{(highValueGuest | number) || '--'}}</h2>
        </div>
      </div>

    </div>
  `,
  styleUrls: ['./statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticComponent {
  @Input() totalRecord: number;
  @Input() totalGuest: number;
  @Input() potentialGuest: number;
  @Input() highValueGuest: number;


}
