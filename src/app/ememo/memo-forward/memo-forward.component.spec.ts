import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoForwardComponent } from './memo-forward.component';

describe('MemoForwardComponent', () => {
  let component: MemoForwardComponent;
  let fixture: ComponentFixture<MemoForwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoForwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
