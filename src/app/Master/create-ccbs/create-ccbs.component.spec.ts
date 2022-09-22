import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCCBSComponent } from './create-ccbs.component';

describe('CreateCCBSComponent', () => {
  let component: CreateCCBSComponent;
  let fixture: ComponentFixture<CreateCCBSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCCBSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCCBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
