import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyCS0H9SKamQdXdXWeZt5mUCAOczdic2N1I",
        authDomain: "join-cf69e.firebaseapp.com",
        projectId: "join-cf69e",
        storageBucket: "join-cf69e.firebasestorage.app",
        messagingSenderId: "55651645151",
        appId: "1:55651645151:web:d6baa447571573a6ae1b6a"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
