import { TestBed } from '@angular/core/testing';

import { SharePprService } from './share-ppr.service';

describe('SharePprService', () => {
  let service: SharePprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharePprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
