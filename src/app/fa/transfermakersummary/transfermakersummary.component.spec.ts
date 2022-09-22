import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfermakersummaryComponent } from './transfermakersummary.component';

describe('TransfermakersummaryComponent', () => {
  let component: TransfermakersummaryComponent;
  let fixture: ComponentFixture<TransfermakersummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfermakersummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfermakersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
