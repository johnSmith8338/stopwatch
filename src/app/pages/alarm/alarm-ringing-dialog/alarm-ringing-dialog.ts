import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmRingingFacade } from '../../../services/alarm-ringing.facade';

@Component({
  selector: 'app-alarm-ringing-dialog',
  imports: [],
  templateUrl: './alarm-ringing-dialog.html',
  styleUrl: './alarm-ringing-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmRingingDialog {
  readonly ringing = inject(AlarmRingingFacade);

  readonly alarm = this.ringing.ringingAlarm;

  readonly snoozeValues = [1, 3, 5, 10, 15, 20, 30];

  stop() {
    this.ringing.stop();
  }

  snooze(minutes: number) {
    this.ringing.snooze(minutes);
  }
}
