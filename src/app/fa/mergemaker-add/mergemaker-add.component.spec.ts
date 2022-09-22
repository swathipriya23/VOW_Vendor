import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergemakerAddComponent } from './mergemaker-add.component';

describe('MergemakerAddComponent', () => {
  let component: MergemakerAddComponent;
  let fixture: ComponentFixture<MergemakerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergemakerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergemakerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
