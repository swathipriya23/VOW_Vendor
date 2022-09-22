import { TestBed } from '@angular/core/testing';

import { masterService } from './master.service';

describe('masterService', () => {
  let service: masterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(masterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
