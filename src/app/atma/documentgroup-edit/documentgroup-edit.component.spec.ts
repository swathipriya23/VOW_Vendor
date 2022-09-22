import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentgroupEditComponent } from './documentgroup-edit.component';

describe('DocumentgroupEditComponent', () => {
  let component: DocumentgroupEditComponent;
  let fixture: ComponentFixture<DocumentgroupEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentgroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentgroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
