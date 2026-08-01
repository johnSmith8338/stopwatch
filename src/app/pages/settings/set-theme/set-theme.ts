import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toggle } from "../../../components/toggle/toggle";
import { ThemeSvc } from '../../../services/theme-svc';

@Component({
  selector: 'app-set-theme',
  imports: [Toggle],
  templateUrl: './set-theme.html',
  styleUrl: './set-theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTheme {
  readonly themeSvc = inject(ThemeSvc);

  checked = this.themeSvc.theme() === 'dark';

  changeTheme() {
    this.themeSvc.toggle();
  }
}
