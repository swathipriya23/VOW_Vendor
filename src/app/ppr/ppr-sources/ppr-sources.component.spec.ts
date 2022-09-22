import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprSourcesComponent } from './ppr-sources.component';

describe('PprSourcesComponent', () => {
  let component: PprSourcesComponent;
  let fixture: ComponentFixture<PprSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
