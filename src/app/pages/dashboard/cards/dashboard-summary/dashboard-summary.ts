import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-summary',
  imports: [],
  templateUrl: './dashboard-summary.html',
  styleUrl: './dashboard-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSummary {}
