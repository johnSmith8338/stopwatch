import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Menu } from "../menu/menu";
import { ThemeSvc } from '../../services/theme-svc';
import { Toggle } from "../toggle/toggle";

@Component({
  selector: 'app-header',
  imports: [
    Menu,
    Toggle
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly themeSvc = inject(ThemeSvc);

  checked = this.themeSvc.theme() === 'dark';

  changeTheme() {
    this.themeSvc.toggle();
  }
}
