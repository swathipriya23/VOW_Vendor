import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvDetailViewComponent } from './inv-detail-view.component';

describe('InvDetailViewComponent', () => {
  let component: InvDetailViewComponent;
  let fixture: ComponentFixture<InvDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
