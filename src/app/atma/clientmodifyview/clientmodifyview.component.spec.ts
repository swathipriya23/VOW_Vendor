import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientmodifyviewComponent } from './clientmodifyview.component';

describe('ClientmodifyviewComponent', () => {
  let component: ClientmodifyviewComponent;
  let fixture: ComponentFixture<ClientmodifyviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientmodifyviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientmodifyviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
