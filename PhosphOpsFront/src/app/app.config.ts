import { ApplicationConfig, LOCALE_ID, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

import {
  LucideAngularModule,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
     provideHttpClient(withInterceptors([authInterceptor])),
     { provide: LOCALE_ID, useValue: 'fr' },

     importProvidersFrom(
       LucideAngularModule.pick({
         Plus,
         Eye,
         Pencil,
         Trash2,
         X
       })
     ),
  ],
};