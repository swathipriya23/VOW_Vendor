import { TestBed } from '@angular/core/testing';

import { Ap1Service } from './ap1.service';

describe('Ap1Service', () => {
  let service: Ap1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ap1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
