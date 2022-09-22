import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncedetailComponent } from './bouncedetail.component';

describe('BouncedetailComponent', () => {
  let component: BouncedetailComponent;
  let fixture: ComponentFixture<BouncedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BouncedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouncedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
