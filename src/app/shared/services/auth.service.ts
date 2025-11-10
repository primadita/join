import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, User, UserCredential, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) { }

  currentUser = new BehaviorSubject<User | null>(null);

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

  isLoggedIn() {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {

        return true;
      } else {
        return false;
      }
    })
  };
}
