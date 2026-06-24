import { Component, signal } from '@angular/core';
import { Stopwatch } from "./components/stopwatch/stopwatch";
import { Timer } from './components/timer/timer';

export enum ClockMode {
  Stopwatch = 'stopwatch',
  Timer = 'timer',
}

@Component({
  selector: 'app-root',
  imports: [Stopwatch, Timer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stopwatch');

  readonly ClockMode = ClockMode;
  readonly mode = signal(ClockMode.Stopwatch);
}
