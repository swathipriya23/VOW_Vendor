import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCheckerViewComponent } from './asset-checker-view.component';

describe('AssetCheckerViewComponent', () => {
  let component: AssetCheckerViewComponent;
  let fixture: ComponentFixture<AssetCheckerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetCheckerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCheckerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
