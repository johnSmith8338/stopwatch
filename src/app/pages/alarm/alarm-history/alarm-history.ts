import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmHistoryFacade } from '../../../services/alarm-history.facade';

@Component({
  selector: 'app-alarm-history',
  imports: [],
  templateUrl: './alarm-history.html',
  styleUrl: './alarm-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmHistory {
  readonly facade = inject(AlarmHistoryFacade);

  readonly history = this.facade.history;
}
