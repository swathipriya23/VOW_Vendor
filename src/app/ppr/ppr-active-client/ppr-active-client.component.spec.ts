import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprActiveClientComponent } from './ppr-active-client.component';

describe('PprActiveClientComponent', () => {
  let component: PprActiveClientComponent;
  let fixture: ComponentFixture<PprActiveClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprActiveClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprActiveClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
