import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingExpenceComponent } from './packing-expence.component';

describe('PackingExpenceComponent', () => {
  let component: PackingExpenceComponent;
  let fixture: ComponentFixture<PackingExpenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingExpenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
