import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommondropdowndetailMasterComponent } from './commondropdowndetail-master.component';

describe('CommondropdowndetailMasterComponent', () => {
  let component: CommondropdowndetailMasterComponent;
  let fixture: ComponentFixture<CommondropdowndetailMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommondropdowndetailMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommondropdowndetailMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
