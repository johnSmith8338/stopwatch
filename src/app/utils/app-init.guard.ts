import { inject } from "@angular/core";
import { CanActivateFn, CanMatchFn, Router } from "@angular/router";
import { SettingsSvc } from "../services/settings-svc";

export const appInitGuard: CanMatchFn = async (route) => {
    const settings = inject(SettingsSvc);
    const router = inject(Router);

    await settings.load();
    const completed = settings.settings().firstRunCompleted;

    if (route.path === '') {
        return completed ? router.createUrlTree(['/timer']) : true;
    }

    return completed ? true : router.createUrlTree(['/']);
}