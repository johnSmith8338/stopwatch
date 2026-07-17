import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DefaultTimerSettings } from '../timer/timer-workspace/timer-settings/timer-settings';
import { Toggle } from "../../components/toggle/toggle";
import { ThemeSvc } from '../../services/theme-svc';

@Component({
  selector: 'app-settings',
  imports: [DefaultTimerSettings, Toggle],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  readonly themeSvc = inject(ThemeSvc);

  checked = this.themeSvc.theme() === 'dark';

  changeTheme() {
    this.themeSvc.toggle();
  }
}
