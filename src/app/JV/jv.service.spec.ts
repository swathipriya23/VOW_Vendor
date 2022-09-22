import { TestBed } from '@angular/core/testing';

import { JvService } from './jv.service';

describe('JvService', () => {
  let service: JvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
