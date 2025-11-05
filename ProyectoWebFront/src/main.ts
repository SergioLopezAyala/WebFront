// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app/app';
import { appConfig } from './app/app.config';

// Mezcla appConfig existente + HttpClient
const config = {
  ...appConfig,
  providers: [
    ...(appConfig?.providers ?? []),
    provideHttpClient(),
  ],
};

bootstrapApplication(App, config).catch(err => console.error(err));
