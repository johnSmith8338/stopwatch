import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardFacade } from '../../../../services/dashboard.facade';

@Component({
  selector: 'app-dashboard-timer',
  imports: [],
  templateUrl: './dashboard-timer.html',
  styleUrl: './dashboard-timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTimer {
  readonly facade = inject(DashboardFacade);
}
