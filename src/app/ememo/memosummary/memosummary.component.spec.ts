import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemosummaryComponent } from './memosummary.component';

describe('MemosummaryComponent', () => {
  let component: MemosummaryComponent;
  let fixture: ComponentFixture<MemosummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemosummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemosummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
