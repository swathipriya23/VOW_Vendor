import { TestBed } from '@angular/core/testing';

import { ApShareServiceService } from './ap-share-service.service';

describe('ApShareServiceService', () => {
  let service: ApShareServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApShareServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
