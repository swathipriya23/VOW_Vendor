import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMakerComponent } from './asset-maker.component';

describe('AssetMakerComponent', () => {
  let component: AssetMakerComponent;
  let fixture: ComponentFixture<AssetMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
