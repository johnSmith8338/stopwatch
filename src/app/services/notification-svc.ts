import { Injectable } from '@angular/core';

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  silent?: boolean;
  requireInteraction?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationSvc {
  permission() {
    return Notification.permission;
  }

  async requestPermission() {
    if (!('Notification' in window)) return 'denied';
    return Notification.requestPermission();
  }

  show(options: NotificationOptions) {
    if (Notification.permission !== 'granted') return null;

    return new Notification(options.title, {
      body: options.body,
      icon: options.icon,
      tag: options.tag,
      silent: options.silent,
      requireInteraction: options.requireInteraction
    })
  }
}
