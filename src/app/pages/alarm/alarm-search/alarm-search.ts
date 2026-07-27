import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmListFacade } from '../../../services/alarm-list.facade';

@Component({
  selector: 'app-alarm-search',
  imports: [],
  templateUrl: './alarm-search.html',
  styleUrl: './alarm-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmSearch {
  readonly facade = inject(AlarmListFacade);

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.facade.setSearch(value);
  }
}
