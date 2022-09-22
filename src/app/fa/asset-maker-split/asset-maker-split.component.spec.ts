import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMakerSplitComponent } from './asset-maker-split.component';

describe('AssetMakerSplitComponent', () => {
  let component: AssetMakerSplitComponent;
  let fixture: ComponentFixture<AssetMakerSplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMakerSplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMakerSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
