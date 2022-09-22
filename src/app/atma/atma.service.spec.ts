import { TestBed } from '@angular/core/testing';

import { AtmaService } from './atma.service';

describe('AtmaService', () => {
  let service: AtmaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtmaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
