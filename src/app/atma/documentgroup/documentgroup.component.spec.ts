import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentgroupComponent } from './documentgroup.component';

describe('DocumentgroupComponent', () => {
  let component: DocumentgroupComponent;
  let fixture: ComponentFixture<DocumentgroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
