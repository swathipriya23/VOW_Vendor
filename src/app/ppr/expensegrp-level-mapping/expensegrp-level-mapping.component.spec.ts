import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensegrpLevelMappingComponent } from './expensegrp-level-mapping.component';

describe('ExpensegrpLevelMappingComponent', () => {
  let component: ExpensegrpLevelMappingComponent;
  let fixture: ComponentFixture<ExpensegrpLevelMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensegrpLevelMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensegrpLevelMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
