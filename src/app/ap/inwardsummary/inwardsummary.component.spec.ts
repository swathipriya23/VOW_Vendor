import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardsummaryComponent } from './inwardsummary.component';

describe('InwardsummaryComponent', () => {
  let component: InwardsummaryComponent;
  let fixture: ComponentFixture<InwardsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
