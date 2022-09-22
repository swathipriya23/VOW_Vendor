import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdatechangeAddComponent } from './cpdatechange-add.component';

describe('CpdatechangeAddComponent', () => {
  let component: CpdatechangeAddComponent;
  let fixture: ComponentFixture<CpdatechangeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpdatechangeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdatechangeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
