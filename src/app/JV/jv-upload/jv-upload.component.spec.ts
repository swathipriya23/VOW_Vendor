import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvUploadComponent } from './jv-upload.component';

describe('JvUploadComponent', () => {
  let component: JvUploadComponent;
  let fixture: ComponentFixture<JvUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
