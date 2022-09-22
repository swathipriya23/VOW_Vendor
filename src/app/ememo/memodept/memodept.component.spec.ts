import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemodeptComponent } from './memodept.component';

describe('MemodeptComponent', () => {
  let component: MemodeptComponent;
  let fixture: ComponentFixture<MemodeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemodeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemodeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
