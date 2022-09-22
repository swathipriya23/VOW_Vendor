import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoredraftComponent } from './memoredraft.component';

describe('MemoredraftComponent', () => {
  let component: MemoredraftComponent;
  let fixture: ComponentFixture<MemoredraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoredraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoredraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
