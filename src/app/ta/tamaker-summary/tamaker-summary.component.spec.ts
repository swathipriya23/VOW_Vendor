import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamakerSummaryComponent } from './tamaker-summary.component';

describe('TamakerSummaryComponent', () => {
  let component: TamakerSummaryComponent;
  let fixture: ComponentFixture<TamakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
