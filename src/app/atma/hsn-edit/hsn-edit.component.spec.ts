import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnEditComponent } from './hsn-edit.component';

describe('HsnEditComponent', () => {
  let component: HsnEditComponent;
  let fixture: ComponentFixture<HsnEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
