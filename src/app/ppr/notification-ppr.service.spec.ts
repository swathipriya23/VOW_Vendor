import { TestBed } from '@angular/core/testing';

import { NotificationPprService } from './notification-ppr.service';

describe('NotificationPprService', () => {
  let service: NotificationPprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationPprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
