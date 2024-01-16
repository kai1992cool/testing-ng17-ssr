import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

export const SCBWEB_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBZxKiBF4DS1LiY374C9qalPB7THogx_D4',
  authDomain: 'testing-ng17-ssr.firebaseapp.com',
  projectId: 'testing-ng17-ssr',
  storageBucket: 'testing-ng17-ssr.appspot.com',
  messagingSenderId: '343552454821',
  appId: '1:343552454821:web:dcea8aa484d807601cdd4c',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      {
        path: 'test-1',
        loadComponent: () => import('./test1.component'),
      },
      {
        path: 'test-2',
        loadComponent: () => import('./test2.component'),
      },
      {
        path: 'test-3',
        loadComponent: () => import('./test3.component'),
      },
      {
        path: 'test-4',
        loadComponent: () => import('./test4.component'),
      },
    ]),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(SCBWEB_FIREBASE_CONFIG))
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
