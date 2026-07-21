import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AppInitializerSvc } from './services/app-initializer-svc';
import { IndexedDbEngine } from './core/storage/indexed-db.engine';
import { StorageEngine } from './core/storage/storage-engine';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    IndexedDbEngine,
    {
      provide: StorageEngine,
      useExisting: IndexedDbEngine
    },
    provideAppInitializer(() => {
      const initializer = inject(AppInitializerSvc);
      return initializer.initialize();
    })
  ]
};
