import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssMasterComponent } from './dss-master.component';

describe('DssMasterComponent', () => {
  let component: DssMasterComponent;
  let fixture: ComponentFixture<DssMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
