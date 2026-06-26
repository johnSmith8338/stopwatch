import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuSvc } from '../../services/menu-svc';
import { filter } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  private readonly router = inject(Router);
  private readonly menuSvc = inject(MenuSvc);

  readonly collapsed = input(true);

  readonly menuItems = this.menuSvc.items;

  private readonly opened = signal(false);

  readonly menuOpened = computed(() => !this.collapsed() || this.opened());

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => close());
  }

  toggle() {
    if (this.collapsed()) this.opened.update(v => !v);
  }

  close() {
    this.opened.set(false);
  }
}
