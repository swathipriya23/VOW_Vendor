import { TestBed } from '@angular/core/testing';

import {faservice } from './fa.service';

describe('faservice', () => {
  let service: faservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(faservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
