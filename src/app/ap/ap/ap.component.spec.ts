import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApComponent } from './ap.component';

describe('ApComponent', () => {
  let component: ApComponent;
  let fixture: ComponentFixture<ApComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
