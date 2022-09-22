import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalverificationAddComponent } from './physicalverification-add.component';

describe('PhysicalverificationAddComponent', () => {
  let component: PhysicalverificationAddComponent;
  let fixture: ComponentFixture<PhysicalverificationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalverificationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalverificationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
