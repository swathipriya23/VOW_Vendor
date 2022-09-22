import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdatechangeMakerSummaryComponent } from './cpdatechange-maker-summary.component';

describe('CpdatechangeMakerSummaryComponent', () => {
  let component: CpdatechangeMakerSummaryComponent;
  let fixture: ComponentFixture<CpdatechangeMakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpdatechangeMakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdatechangeMakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
