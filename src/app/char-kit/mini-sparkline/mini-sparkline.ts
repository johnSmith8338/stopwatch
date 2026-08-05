import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mini-sparkline',
  imports: [],
  templateUrl: './mini-sparkline.html',
  styleUrl: './mini-sparkline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniSparkline {}
