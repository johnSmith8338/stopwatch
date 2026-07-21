import { DestroyRef, Directive, ElementRef, inject, input, output } from '@angular/core';
import { AlarmTimeUnit } from '../models/alarm-time-unit.type';
import { AlarmDialStep } from '../models/alarm-dial-step.interface';

@Directive({
  selector: '[alarmDialEditor]',
})
export class AlarmDialEditor {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly unit = input.required<AlarmTimeUnit>();
  readonly currentHour = input(0);

  readonly step = output<AlarmDialStep>();
  finished = output();

  private pointerId: number | null = null;

  private lastHourValue = 0;
  private turns = 0;

  constructor() {
    const element = this.host.nativeElement;

    element.style.touchAction = 'none';

    element.addEventListener('pointerdown', this.pointerDown);
    element.addEventListener('pointermove', this.pointerMove);
    element.addEventListener('pointerup', this.pointerUp);
    element.addEventListener('pointercancel', this.pointerUp);

    this.destroyRef.onDestroy(() => {
      element.removeEventListener('pointerdown', this.pointerDown);
      element.removeEventListener('pointermove', this.pointerMove);
      element.removeEventListener('pointerup', this.pointerUp);
      element.removeEventListener('pointercancel', this.pointerUp);
    })
  }

  private pointerDown = (event: PointerEvent) => {
    this.pointerId = event.pointerId;
    this.host.nativeElement.setPointerCapture(event.pointerId);

    if (this.unit() === 'hour') {
      this.turns = Math.floor(this.currentHour() / 12);
      this.lastHourValue = this.currentHour() % 12;
    }
    this.emitValue(event);
  }

  private pointerMove = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId) return;
    this.emitValue(event);
  }

  private pointerUp = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId) return;
    this.pointerId = null;
    this.host.nativeElement.releasePointerCapture(event.pointerId);
    this.finished.emit();
  }

  private emitValue(event: PointerEvent) {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle += 90;
    if (angle < 0) angle += 360;

    if (this.unit() === 'hour') {
      const value = Math.floor(angle / 30) % 12;
      const delta = value - this.lastHourValue;

      if (delta < -6) this.turns++;
      if (delta > 6) this.turns--;
      this.turns = Math.max(0, Math.min(1, this.turns));
      this.lastHourValue = value;

      this.step.emit({
        unit: 'hour',
        value: value + this.turns * 12
      })

      return;
    }

    const value = Math.floor(angle / 6) % 60;
    this.step.emit({
      unit: 'minute',
      value
    })
  }
}
