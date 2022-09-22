import { TestBed } from '@angular/core/testing';

import { UsercreationService } from './usercreation.service';

describe('UsercreationService', () => {
  let service: UsercreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsercreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
