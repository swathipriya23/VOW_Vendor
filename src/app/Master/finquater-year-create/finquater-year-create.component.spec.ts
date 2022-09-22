import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinquaterYearCreateComponent } from './finquater-year-create.component';

describe('FinquaterYearCreateComponent', () => {
  let component: FinquaterYearCreateComponent;
  let fixture: ComponentFixture<FinquaterYearCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinquaterYearCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinquaterYearCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
