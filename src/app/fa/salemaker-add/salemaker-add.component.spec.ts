import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalemakerAddComponent } from './salemaker-add.component';

describe('SalemakerAddComponent', () => {
  let component: SalemakerAddComponent;
  let fixture: ComponentFixture<SalemakerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalemakerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalemakerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
