import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycmodificationComponent } from './kycmodification.component';

describe('KycmodificationComponent', () => {
  let component: KycmodificationComponent;
  let fixture: ComponentFixture<KycmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
