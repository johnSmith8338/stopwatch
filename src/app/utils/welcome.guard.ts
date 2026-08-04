import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SettingsSvc } from '../services/settings-svc';

export const welcomeGuard: CanMatchFn = async () => {
    const settings = inject(SettingsSvc);
    const router = inject(Router);

    await settings.load();

    return settings.settings().firstRunCompleted
        ? router.createUrlTree(['/'])
        : true;
};