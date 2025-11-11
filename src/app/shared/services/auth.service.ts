import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, User, UserCredential, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * AuthService
 *
 * Thin wrapper around Firebase Auth to centralize authentication logic
 * and expose a BehaviorSubject `currentUser` for the app to reactively
 * observe the signed-in user. Provides helpers for login, signup,
 * profile updates, and sign-out.
 *
 * Public properties:
 * - currentUser: BehaviorSubject<User | null> - observable current user
 * - userLoaded: boolean - indicates whether initial auth state has been loaded
 *
 * Public methods:
 * - login(email, password): signs in a user with email and password
 * - createUserWithEmailAndPassword(email, password): creates a new user
 * - getCurrentUser(): attaches an onAuthStateChanged listener to update currentUser
 * - addProfileName(userName): updates the displayName of the current user
 * - isLoggedIn(): Promise<boolean> - resolves to true if a user is signed in
 * - logOut(): signs out the current user and navigates to the login route
 */
export class AuthService {
  // #region ATTRIBUTES
  /**
   * Observable BehaviorSubject that emits the current Firebase `User` or null.
   * Components and services should subscribe to this to react to auth changes.
   */
  currentUser = new BehaviorSubject<User | null>(null);

  /**
   * Flag that indicates the initial auth state has been loaded at least once.
   * Used to avoid waiting on onAuthStateChanged repeatedly.
   */
  userLoaded = false;
  // #endregion

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.next(user);
      this.userLoaded = true;
    });
  }

  // #region METHODS
  /**
   * Sign in a user with email and password using Firebase Auth.
   *
   * @param {string} email - user's email address
   * @param {string} password - user's password
   * @returns {Promise<UserCredential>} resolves with the firebase user credential on success
   */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Create a new user account with email and password.
   *
   * @param {string} email - new user's email
   * @param {string} password - new user's password
   * @returns {Promise<UserCredential>} resolves with the created user credential
   */
  createUserWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Attach a one-time onAuthStateChanged listener that updates `currentUser`.
   * The returned function can be used to unsubscribe the listener.
   *
   * @returns {() => void} unsubscribe function
   */
  getCurrentUser(): () => void {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser.next(user);
      }
    });
  }

  /**
   * Update the currently signed-in user's displayName.
   *
   * @param {string} userName - displayName to set on the Firebase user profile
   * @returns {Promise<void>} resolves when the profile update completes
   */
  addProfileName(userName: string): Promise<void> {
    return updateProfile(this.auth.currentUser!, { displayName: userName });
  }

  /**
   * Resolve whether a user is currently authenticated. If auth state has not
   * been loaded yet the method waits for onAuthStateChanged once.
   *
   * @returns {Promise<boolean>} resolves true when a user is signed in
   */
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

  /**
   * Sign out the current user and navigate to the login route.
   *
   * @returns {Promise<void>} resolves when sign out completes
   */
  logOut(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
  // #endregion
}
