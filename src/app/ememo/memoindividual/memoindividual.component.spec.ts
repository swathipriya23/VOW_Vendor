import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoindividualComponent } from './memoindividual.component';

describe('MemoindividualComponent', () => {
  let component: MemoindividualComponent;
  let fixture: ComponentFixture<MemoindividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoindividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoindividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
