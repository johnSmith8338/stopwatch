import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-timer-finished-dialog',
  imports: [],
  templateUrl: './timer-finished-dialog.html',
  styleUrl: './timer-finished-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerFinishedDialog {}
