import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakersummaryComponent } from './makersummary.component';

describe('MakersummaryComponent', () => {
  let component: MakersummaryComponent;
  let fixture: ComponentFixture<MakersummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakersummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
