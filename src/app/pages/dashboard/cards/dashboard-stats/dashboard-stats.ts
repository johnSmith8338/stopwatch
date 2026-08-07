import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DashboardFacade } from '../../../../services/dashboard.facade';
import { DashboardStatCard } from '../../../../models/dashboard';

@Component({
  selector: 'app-dashboard-stats',
  imports: [],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStats {
  readonly card = input.required<DashboardStatCard>();
}
