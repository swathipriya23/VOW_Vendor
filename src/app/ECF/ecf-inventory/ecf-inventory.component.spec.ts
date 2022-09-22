import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfInventoryComponent } from './ecf-inventory.component';

describe('EcfInventoryComponent', () => {
  let component: EcfInventoryComponent;
  let fixture: ComponentFixture<EcfInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
