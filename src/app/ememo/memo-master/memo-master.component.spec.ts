import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoMasterComponent } from './memo-master.component';

describe('MemoMasterComponent', () => {
  let component: MemoMasterComponent;
  let fixture: ComponentFixture<MemoMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
