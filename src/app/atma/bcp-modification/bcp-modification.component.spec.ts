import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpModificationComponent } from './bcp-modification.component';

describe('BcpModificationComponent', () => {
  let component: BcpModificationComponent;
  let fixture: ComponentFixture<BcpModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BcpModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
