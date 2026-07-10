import { ChangeDetectionStrategy, Component, input, Signal } from '@angular/core';

export interface DigitalDisplayEngine {
  displayTime: Signal<string>;
}

@Component({
  selector: 'app-digital-display',
  imports: [],
  templateUrl: './digital-display.html',
  styleUrl: './digital-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalDisplay {
  readonly engine = input.required<DigitalDisplayEngine>();
}
