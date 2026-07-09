import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ClockEngine } from '../../models/clock-engine.interface';
import { PreviewTimerEngine } from '../../services/timer-preview.engine';
import { TimerInstanceStore } from '../../services/timer-instance.store';

@Component({
  selector: 'app-digital-display',
  imports: [],
  templateUrl: './digital-display.html',
  styleUrl: './digital-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalDisplay {
  private readonly preview = inject(PreviewTimerEngine);
  private readonly store = inject(TimerInstanceStore);

  readonly display = computed(() => {
    return this.store.active()?.engine.displayTime()
      ?? this.preview.displayTime();
  });
}
