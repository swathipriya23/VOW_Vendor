import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetclubmakerComponent } from './assetclubmaker.component';

describe('AssetclubmakerComponent', () => {
  let component: AssetclubmakerComponent;
  let fixture: ComponentFixture<AssetclubmakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetclubmakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetclubmakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
