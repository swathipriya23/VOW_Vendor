import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycEditComponent } from './kyc-edit.component';

describe('KycEditComponent', () => {
  let component: KycEditComponent;
  let fixture: ComponentFixture<KycEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
