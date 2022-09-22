import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardDetailsComponent } from './inward-details.component';

describe('InwardDetailsComponent', () => {
  let component: InwardDetailsComponent;
  let fixture: ComponentFixture<InwardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
