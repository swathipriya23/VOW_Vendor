import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesssegmentEditComponent } from './businesssegment-edit.component';

describe('BusinesssegmentEditComponent', () => {
  let component: BusinesssegmentEditComponent;
  let fixture: ComponentFixture<BusinesssegmentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinesssegmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinesssegmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
