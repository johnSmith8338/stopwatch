import { computed, Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appStepTracker]',
  exportAs: 'stepper'
})
export class StepTracker {
  readonly stepLabels = input<string[]>();
  private readonly current = signal(0);

  readonly stepIndex = this.current;

  readonly totalSteps = computed(() => this.stepLabels()?.length ?? 0);
  readonly isFirstStep = computed(() => this.stepIndex() === 0);
  readonly isLastStep = computed(() => this.stepIndex() === this.totalSteps() - 1);
  readonly currentLabel = computed(() => this.stepLabels()?.[this.stepIndex()] ?? '');

  next() {
    if (!this.isLastStep()) this.current.update(i => i + 1);
  }

  prev() {
    if (!this.isFirstStep()) this.current.update(i => i - 1);
  }

  reset() {
    this.current.set(0);
  }
}
