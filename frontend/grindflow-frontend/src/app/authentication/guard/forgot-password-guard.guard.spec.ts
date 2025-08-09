import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { forgotPasswordGuardGuard } from './forgot-password-guard.guard';

describe('forgotPasswordGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => forgotPasswordGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
