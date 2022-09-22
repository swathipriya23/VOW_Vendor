import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApHeaderComponent } from './ap-header.component';

describe('ApHeaderComponent', () => {
  let component: ApHeaderComponent;
  let fixture: ComponentFixture<ApHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
