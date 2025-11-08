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
  @Output() selectedActiveComponent = new EventEmitter<string>();
  activeComponent: string = '';
  private componentHistory: string = 'loginPage';
  // #endregion

  constructor(private route: ActivatedRoute, private router: Router) {}

  // #region METHODS
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

  navigateTo(view: string) {
    this.activeComponent = view;
    this.selectedActiveComponent.emit(view);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view, from: this.componentHistory },
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  backToLoginOrSignup(){
    if (this.componentHistory === 'login') {
      this.router.navigateByUrl('/login');
    } else if (this.componentHistory === 'register') {
      this.router.navigateByUrl('/register');
    } else {
      this.router.navigateByUrl('/login'); // default fallback
    }
  }

  handleNavbarNavigation(view: string) {
  if (view === 'privacy-policy' || view === 'legal-notice') {
    this.navigateTo(view);
  } else if (view === 'loginPage') {
    this.backToLoginOrSignup();
  }
}
  // #endregion
}
