import { Directive, ElementRef, EventEmitter, HostListener, inject, input, output, Output } from '@angular/core';

export type DialUnit = 'seconds' | 'minutes';

export interface DialStep {
  unit: DialUnit;
  value: number;
  turns: -1 | 0 | 1;
}

@Directive({
  selector: '[timerDialEditor]',
})
export class TimerDialEditor {
  private host = inject(ElementRef<HTMLElement>);

  readonly unit = input.required<DialUnit>();
  readonly step = output<DialStep>();

  private dragging = false;
  private previousValue = 0;

  @HostListener('pointerdown', ['$event']) pointerDown(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.dragging = true;

    this.host.nativeElement.setPointerCapture(event.pointerId);

    const value = this.calculateValue(event);
    this.previousValue = value;

    this.emitStep(value);
  }

  @HostListener('pointermove', ['$event']) pointerMove(event: PointerEvent) {
    if (!this.dragging) return;
    event.preventDefault();
    const value = this.calculateValue(event);

    this.emitStep(value);
  }

  @HostListener('pointerup', ['$event']) pointerUp(event: PointerEvent) {
    this.finish(event);
  }

  @HostListener('pointercancel', ['$event']) pointerCancel(event: PointerEvent) {
    this.finish(event);
  }

  private finish(event: PointerEvent) {
    if (!this.dragging) return;
    this.dragging = false;
    this.host.nativeElement.releasePointerCapture(event.pointerId);
  }

  private emitStep(current: number) {
    const delta = current - this.previousValue;
    let turns: -1 | 0 | 1 = 0;
    if (delta < -30) {
      turns = 1;
    } else if (delta > 30) {
      turns = -1;
    }

    this.step.emit({
      unit: this.unit(),
      value: current,
      turns
    })

    this.previousValue = current;
  }

  private calculateValue(event: PointerEvent): number {
    const rect = this.host.nativeElement.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = event.clientX - cx;
    const dy = event.clientY - cy;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    angle = (angle + 450) % 360;

    return Math.round(angle / 6) % 60;
  }
}
