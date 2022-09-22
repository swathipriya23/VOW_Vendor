import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourApprovalComponent } from './tour-approval.component';

describe('TourApprovalComponent', () => {
  let component: TourApprovalComponent;
  let fixture: ComponentFixture<TourApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
