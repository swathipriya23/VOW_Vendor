import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpbranchCreateComponent } from './empbranch-create.component';

describe('EmpbranchCreateComponent', () => {
  let component: EmpbranchCreateComponent;
  let fixture: ComponentFixture<EmpbranchCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpbranchCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpbranchCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
