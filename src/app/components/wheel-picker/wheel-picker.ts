import { afterNextRender, ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { WHEEL_HEIGHT, WHEEL_ITEM_HEIGHT, WHEEL_OFFSET } from '../../constants/wheel-picker.constants';

@Component({
  selector: 'app-wheel-picker',
  imports: [],
  templateUrl: './wheel-picker.html',
  styleUrl: './wheel-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--item-height.px]': 'itemHeight',
    '[style.--wheel-height.px]': 'wheelHeight',
  }
})
export class WheelPicker {
  readonly items = input.required<number[]>();
  readonly value = input.required<number>();
  readonly valueChange = output<number>();
  readonly name = input<string>('');

  readonly wheelRef = viewChild<ElementRef<HTMLDivElement>>('wheel');

  readonly wheelHeight = WHEEL_HEIGHT;
  readonly itemHeight = WHEEL_ITEM_HEIGHT;
  readonly centerOffset = WHEEL_OFFSET;
  private scrollTimer?: number;

  constructor() {
    afterNextRender(() => {
      this.setWheelStartPosition();
    });

    effect(() => {
      this.setWheelStartPosition();
    })
  }

  private setWheelStartPosition() {
    const wheel = this.wheelRef()?.nativeElement;
    if (!wheel) return;

    const index = this.items().indexOf(this.value());
    wheel.scrollTop = index * this.itemHeight;
  }

  onScroll() {
    window.clearTimeout(this.scrollTimer);
    this.scrollTimer = window.setTimeout(() => {
      this.snapToNearest()
    }, 100)
  }

  private snapToNearest() {
    const wheel = this.wheelRef()?.nativeElement;
    if (!wheel) return;

    const index = Math.round(wheel.scrollTop / this.itemHeight);
    wheel.scrollTop = index * this.itemHeight;

    const value = this.items()[index];
    if (value !== undefined) this.valueChange.emit(value);
  }
}
