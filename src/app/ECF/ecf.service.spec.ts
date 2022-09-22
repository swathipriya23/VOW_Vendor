import { TestBed } from '@angular/core/testing';

import { EcfService } from './ecf.service';

describe('EcfService', () => {
  let service: EcfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
