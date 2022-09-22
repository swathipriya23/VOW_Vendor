import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorreportComponent } from './vendorreport.component';

describe('VendorreportComponent', () => {
  let component: VendorreportComponent;
  let fixture: ComponentFixture<VendorreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
