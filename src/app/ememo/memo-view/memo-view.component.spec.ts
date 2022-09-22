import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoViewComponent } from './memo-view.component';

describe('MemoViewComponent', () => {
  let component: MemoViewComponent;
  let fixture: ComponentFixture<MemoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
