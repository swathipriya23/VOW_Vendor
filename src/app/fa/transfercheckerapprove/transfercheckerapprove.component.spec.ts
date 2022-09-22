import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfercheckerapproveComponent } from './transfercheckerapprove.component';

describe('TransfercheckerapproveComponent', () => {
  let component: TransfercheckerapproveComponent;
  let fixture: ComponentFixture<TransfercheckerapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfercheckerapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfercheckerapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
