import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  title: string;
  link: string;
  icon?: string;
  order?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuSvc {
  private readonly router = inject(Router);

  readonly items = computed<MenuItem[]>(() =>
    this.router.config
      .filter(route => route.data?.['showInMenu'])
      .map(route => ({
        title: route.data?.['title'] ?? route.path!,
        link: '/' + route.path,
        icon: route.data?.['icon'],
        order: route.data?.['order'] ?? Number.MAX_SAFE_INTEGER,
      }))
      .sort((a, b) => a.order - b.order)
  );
}
