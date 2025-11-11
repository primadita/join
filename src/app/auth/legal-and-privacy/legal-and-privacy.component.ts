import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PrivacyPolicyComponent } from '../../shared/components/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from '../../shared/components/legal-notice/legal-notice.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-and-privacy',
  imports: [
    CommonModule,
    HeaderComponent,
    PrivacyPolicyComponent,
    LegalNoticeComponent,
    NavBarComponent
  ],
  templateUrl: './legal-and-privacy.component.html',
  styleUrl: './legal-and-privacy.component.scss',
})
export class LegalAndPrivacyComponent implements OnInit {
  // #region ATTRIBUTES
  /**
   * Currently active view name shown inside this component.
   * Typical values: 'privacy-policy' | 'legal-notice' | ''.
   */
  activeComponent: string = '';

  /**
   * Tracks where the user came from so we can navigate back correctly.
   * Possible values set from query params: 'login' | 'register'. Defaults to 'loginPage'.
   */
  private componentHistory: string = 'loginPage';

  /**
   * Emits the currently selected active component/view to parent components.
   * Emitted value is the view name (e.g. 'privacy-policy').
   */
  @Output() selectedActiveComponent = new EventEmitter<string>();
  // #endregion

  /**
   * Create the component.
   * @param route ActivatedRoute used to read query parameters that control which view to show.
   * @param router Router used for navigation to other app routes (login/register).
   */
  constructor(private route: ActivatedRoute, private router: Router) {}

  // #region METHODS
  /**
   * Subscribe to query param changes and initialize local state.
   * Reads 'view' and 'from' query parameters and updates `activeComponent` and
   * `componentHistory` accordingly.
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      const from = params.get('from');
      if (view === 'privacy-policy' || view === 'legal-notice') {
        this.activeComponent = view;
      }
      if (from === 'login' || from === 'register' ){
        this.componentHistory = from;
      }
    });
  }

  /**
   * Activate a view inside this component and update the URL query params.
   * Also emits the selected view to parent components.
   * @param view The view to activate (e.g. 'privacy-policy' | 'legal-notice').
   */
  navigateTo(view: string) {
    this.activeComponent = view;
    this.selectedActiveComponent.emit(view);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view, from: this.componentHistory },
    });
  }

  /**
   * Navigate directly to the login page.
   */
  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  /**
   * Navigate back to either the login or register page depending on
   * where the user came from. Falls back to '/login' if unknown.
   */
  backToLoginOrSignup(){
    if (this.componentHistory === 'login') {
      this.router.navigateByUrl('/login');
    } else if (this.componentHistory === 'register') {
      this.router.navigateByUrl('/register');
    } else {
      this.router.navigateByUrl('/login'); // default fallback
    }
  }

  /**
   * Handle navigation events coming from the navbar component.
   * Delegates to `navigateTo` for known views or `backToLoginOrSignup` when
   * the navbar requests to return to the login/register flow.
   * @param view The navigation target coming from the navbar.
   */
  handleNavbarNavigation(view: string) {
    if (view === 'privacy-policy' || view === 'legal-notice') {
      this.navigateTo(view);
    } else if (view === 'loginPage') {
      this.backToLoginOrSignup();
    }
  }
  // #endregion
}
