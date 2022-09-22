import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemolistscrollComponent } from './memolistscroll.component';

describe('MemolistscrollComponent', () => {
  let component: MemolistscrollComponent;
  let fixture: ComponentFixture<MemolistscrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemolistscrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemolistscrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
