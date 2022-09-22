import { TestBed } from '@angular/core/testing';

import { Fa3Service } from './fa3.service';

describe('Fa3Service', () => {
  let service: Fa3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fa3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
