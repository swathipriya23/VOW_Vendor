import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendordocumentcreateComponent } from './vendordocumentcreate.component';

describe('VendordocumentcreateComponent', () => {
  let component: VendordocumentcreateComponent;
  let fixture: ComponentFixture<VendordocumentcreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendordocumentcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendordocumentcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
