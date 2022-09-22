import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourapprovalViewComponent } from './tourapproval-view.component';

describe('TourapprovalViewComponent', () => {
  let component: TourapprovalViewComponent;
  let fixture: ComponentFixture<TourapprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourapprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourapprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
