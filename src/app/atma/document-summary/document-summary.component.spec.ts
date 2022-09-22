import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentSummaryComponent } from './document-summary.component';

describe('DocumentSummaryComponent', () => {
  let component: DocumentSummaryComponent;
  let fixture: ComponentFixture<DocumentSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
