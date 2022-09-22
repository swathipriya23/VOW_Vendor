import { TestBed } from '@angular/core/testing';

import { MemoerrorHandlingService } from './memoerror-handling.service';

describe('MemoerrorHandlingService', () => {
  let service: MemoerrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoerrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
