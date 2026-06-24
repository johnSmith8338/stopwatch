import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClockEngine } from '../../models/clock-engine.interface';

@Component({
  selector: 'app-digital-display',
  imports: [],
  templateUrl: './digital-display.html',
  styleUrl: './digital-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalDisplay {
  readonly engine = input.required<ClockEngine>();
}
