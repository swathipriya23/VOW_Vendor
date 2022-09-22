import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcatComponent } from './assetcat.component';

describe('AssetcatComponent', () => {
  let component: AssetcatComponent;
  let fixture: ComponentFixture<AssetcatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetcatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
