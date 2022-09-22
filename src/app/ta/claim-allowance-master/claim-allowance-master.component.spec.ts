import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAllowanceMasterComponent } from './claim-allowance-master.component';

describe('ClaimAllowanceMasterComponent', () => {
  let component: ClaimAllowanceMasterComponent;
  let fixture: ComponentFixture<ClaimAllowanceMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimAllowanceMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAllowanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
