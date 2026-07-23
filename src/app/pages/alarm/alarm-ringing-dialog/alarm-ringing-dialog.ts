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

  stop() {
    this.ringing.stop();
  }
}
