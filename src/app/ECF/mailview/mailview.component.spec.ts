import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailviewComponent } from './mailview.component';

describe('MailviewComponent', () => {
  let component: MailviewComponent;
  let fixture: ComponentFixture<MailviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
