import { TestBed } from '@angular/core/testing';

import { Fa2Service } from './fa2.service';

describe('Fa2Service', () => {
  let service: Fa2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fa2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
