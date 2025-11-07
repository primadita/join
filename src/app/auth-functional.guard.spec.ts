import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authFunctionalGuard } from './auth-functional.guard';

describe('authFunctionalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authFunctionalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
