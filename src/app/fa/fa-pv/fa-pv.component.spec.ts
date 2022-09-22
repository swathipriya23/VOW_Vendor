import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaPvComponent } from './fa-pv.component';

describe('FaPvComponent', () => {
  let component: FaPvComponent;
  let fixture: ComponentFixture<FaPvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaPvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaPvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
