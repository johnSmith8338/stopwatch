import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardFacade } from '../../../../services/dashboard.facade';

@Component({
  selector: 'app-dashboard-alarm',
  imports: [],
  templateUrl: './dashboard-alarm.html',
  styleUrl: './dashboard-alarm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAlarm {
  readonly facade = inject(DashboardFacade);
}
