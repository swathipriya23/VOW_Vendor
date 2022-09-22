import { TestBed } from '@angular/core/testing';

import { ErrorExceptionService } from './error-exception.service';

describe('ErrorExceptionService', () => {
  let service: ErrorExceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorExceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
