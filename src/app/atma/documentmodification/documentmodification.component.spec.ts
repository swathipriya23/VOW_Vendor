import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentmodificationComponent } from './documentmodification.component';

describe('DocumentmodificationComponent', () => {
  let component: DocumentmodificationComponent;
  let fixture: ComponentFixture<DocumentmodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
