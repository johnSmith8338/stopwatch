import { Directive, ElementRef, EventEmitter, HostListener, inject, output, Output } from '@angular/core';

export interface DialChange {
  previous: number;
  current: number;
}

@Directive({
  selector: '[timerDialEditor]',
})
export class TimerDialEditor {
  private host = inject(ElementRef<HTMLElement>);

  readonly valueChange = output<DialChange>();

  private dragging = false;
  private previousValue = 0;

  @HostListener('pointerdown', ['$event']) pointerDown(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.dragging = true;

    this.host.nativeElement.setPointerCapture(event.pointerId);

    const value = this.calculateValue(event);
    this.previousValue = 0;

    this.valueChange.emit({
      previous: value,
      current: value
    })
  }

  @HostListener('pointermove', ['$event']) pointerMove(event: PointerEvent) {
    if (!this.dragging) return;
    event.preventDefault();
    const current = this.calculateValue(event);

    this.valueChange.emit({
      previous: this.previousValue,
      current,
    });

    this.previousValue = current;
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
