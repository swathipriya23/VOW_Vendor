import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplimakerViewComponent } from './splimaker-view.component';

describe('SplimakerViewComponent', () => {
  let component: SplimakerViewComponent;
  let fixture: ComponentFixture<SplimakerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplimakerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplimakerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
