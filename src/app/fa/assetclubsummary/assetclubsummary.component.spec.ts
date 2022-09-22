import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetclubsummaryComponent } from './assetclubsummary.component';

describe('AssetclubsummaryComponent', () => {
  let component: AssetclubsummaryComponent;
  let fixture: ComponentFixture<AssetclubsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetclubsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetclubsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
