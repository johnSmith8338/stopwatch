import { inject, Injectable } from '@angular/core';
import { SettingsSvc } from './settings-svc';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerSvc {
  private readonly settings = inject(SettingsSvc);

  async initialize(): Promise<void> {
    await this.settings.load();
  }
}
