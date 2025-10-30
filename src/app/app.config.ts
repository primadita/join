import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideFirebaseApp(() => initializeApp({ projectId: "join-31985", appId: "1:997540181895:web:7591281d620c285b234522", storageBucket: "join-31985.firebasestorage.app", apiKey: "AIzaSyCIwGpsfD-CQdm2g9n-Mod2yyzuGWZO9Z8", authDomain: "join-31985.firebaseapp.com", messagingSenderId: "997540181895" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
