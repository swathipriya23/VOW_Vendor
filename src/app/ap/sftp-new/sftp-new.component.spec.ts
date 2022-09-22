import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SFTPNewComponent } from './sftp-new.component';

describe('SFTPNewComponent', () => {
  let component: SFTPNewComponent;
  let fixture: ComponentFixture<SFTPNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SFTPNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SFTPNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
