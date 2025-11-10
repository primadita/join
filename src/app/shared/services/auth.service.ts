import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, User, UserCredential, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  

  currentUser = new BehaviorSubject<User | null>(null);
  userLoaded = false;

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.next(user);
      this.userLoaded = true;
    });
  }

  // UserCredential sind die gesamten infos zum angemeldeten User
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  getCurrentUser() {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser.next(user)
      }
    });
  }

  addProfileName(userName: string) {
    return updateProfile(this.auth.currentUser!, { displayName: userName })
  }

  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.userLoaded) {
        resolve(!!this.currentUser.value);
      } else {
        const unsub = onAuthStateChanged(this.auth, (user) => {
          this.currentUser.next(user);
          resolve(!!user);
          unsub();
        });
      }
    });
  };

  logOut(){
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/login')
    }).catch((error) => {
      console.error(error);
    });
  }
}
