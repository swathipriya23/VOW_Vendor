import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentEditComponent } from './document-edit.component';

describe('DocumentEditComponent', () => {
  let component: DocumentEditComponent;
  let fixture: ComponentFixture<DocumentEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
