import { TestBed } from '@angular/core/testing';

import { DssService } from './dss.service';

describe('DssService', () => {
  let service: DssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
