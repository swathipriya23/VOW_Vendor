import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnComponent } from './hsn.component';

describe('HsnComponent', () => {
  let component: HsnComponent;
  let fixture: ComponentFixture<HsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
