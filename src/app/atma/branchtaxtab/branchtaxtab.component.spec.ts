import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchtaxtabComponent } from './branchtaxtab.component';

describe('BranchtaxtabComponent', () => {
  let component: BranchtaxtabComponent;
  let fixture: ComponentFixture<BranchtaxtabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchtaxtabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchtaxtabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
