import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssestclubaprsummaryComponent } from './assestclubaprsummary.component';

describe('AssestclubaprsummaryComponent', () => {
  let component: AssestclubaprsummaryComponent;
  let fixture: ComponentFixture<AssestclubaprsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssestclubaprsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssestclubaprsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
