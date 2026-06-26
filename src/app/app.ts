import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);

  protected readonly title = signal('stopwatch');
  readonly hasHeader = signal(true);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.updHasHeader();
    });
  }

  updHasHeader() {
    const url = this.currentPath();
    this.hasHeader.set(
      url !== '/'
    )
  }

  private currentPath(): string {
    return this.router.url.split('?')[0]?.split('#')[0] ?? this.router.url;
  }
}
