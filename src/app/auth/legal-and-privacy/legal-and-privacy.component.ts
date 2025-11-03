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
  ],
  templateUrl: './legal-and-privacy.component.html',
  styleUrl: './legal-and-privacy.component.scss',
})
export class LegalAndPrivacyComponent implements OnInit {
  @Output() selectedActiveComponent = new EventEmitter<string>();

  activeComponent: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      if (view === 'privacy-policy' || view === 'legal-notice') {
        this.activeComponent = view;
      }
    });
  }

  navigateToComponent(event: Event, targetComponent: string) {
    event.preventDefault();
    this.activeComponent = targetComponent;
    this.selectedActiveComponent.emit(targetComponent);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: targetComponent },
      queryParamsHandling: 'merge',
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
