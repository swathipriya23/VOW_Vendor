import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinYearCreateComponent } from './fin-year-create.component';

describe('FinYearCreateComponent', () => {
  let component: FinYearCreateComponent;
  let fixture: ComponentFixture<FinYearCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinYearCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinYearCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
