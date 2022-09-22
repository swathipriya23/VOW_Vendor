import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMakerSummaryComponent } from './asset-maker-summary.component';

describe('AssetMakerSummaryComponent', () => {
  let component: AssetMakerSummaryComponent;
  let fixture: ComponentFixture<AssetMakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
