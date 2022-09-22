import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetclubAddComponent } from './assetclub-add.component';

describe('AssetclubAddComponent', () => {
  let component: AssetclubAddComponent;
  let fixture: ComponentFixture<AssetclubAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetclubAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetclubAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
