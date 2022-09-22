import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprLevelComponent } from './ppr-level.component';

describe('PprLevelComponent', () => {
  let component: PprLevelComponent;
  let fixture: ComponentFixture<PprLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
