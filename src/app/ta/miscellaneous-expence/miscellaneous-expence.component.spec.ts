import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousExpenceComponent } from './miscellaneous-expence.component';

describe('MiscellaneousExpenceComponent', () => {
  let component: MiscellaneousExpenceComponent;
  let fixture: ComponentFixture<MiscellaneousExpenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscellaneousExpenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
