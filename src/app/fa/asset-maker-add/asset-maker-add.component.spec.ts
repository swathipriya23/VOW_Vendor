import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMakerAddComponent } from './asset-maker-add.component';

describe('AssetMakerAddComponent', () => {
  let component: AssetMakerAddComponent;
  let fixture: ComponentFixture<AssetMakerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMakerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMakerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
