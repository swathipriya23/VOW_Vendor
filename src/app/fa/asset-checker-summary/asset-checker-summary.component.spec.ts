import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCheckerSummaryComponent } from './asset-checker-summary.component';

describe('AssetCheckerSummaryComponent', () => {
  let component: AssetCheckerSummaryComponent;
  let fixture: ComponentFixture<AssetCheckerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetCheckerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCheckerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
