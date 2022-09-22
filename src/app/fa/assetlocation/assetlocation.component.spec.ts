import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetlocationComponent } from './assetlocation.component';

describe('AssetlocationComponent', () => {
  let component: AssetlocationComponent;
  let fixture: ComponentFixture<AssetlocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetlocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
