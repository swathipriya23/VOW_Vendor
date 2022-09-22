import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuechangecheckerapproveComponent } from './valuechangecheckerapprove.component';

describe('ValuechangecheckerapproveComponent', () => {
  let component: ValuechangecheckerapproveComponent;
  let fixture: ComponentFixture<ValuechangecheckerapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuechangecheckerapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuechangecheckerapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
