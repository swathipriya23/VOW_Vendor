import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaFileuploadComponent } from './fa-fileupload.component';

describe('FaFileuploadComponent', () => {
  let component: FaFileuploadComponent;
  let fixture: ComponentFixture<FaFileuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaFileuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaFileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
