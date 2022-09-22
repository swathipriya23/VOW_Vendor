import { TestBed } from '@angular/core/testing';

import { TaService } from './ta.service';

describe('TaService', () => {
  let service: TaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
