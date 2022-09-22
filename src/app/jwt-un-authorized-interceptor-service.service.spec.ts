import { TestBed } from '@angular/core/testing';

import { JwtUnAuthorizedInterceptorServiceService } from './jwt-un-authorized-interceptor-service.service';

describe('JwtUnAuthorizedInterceptorServiceService', () => {
  let service: JwtUnAuthorizedInterceptorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtUnAuthorizedInterceptorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
