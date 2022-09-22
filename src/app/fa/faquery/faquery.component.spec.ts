import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqueryComponent } from './faquery.component';

describe('FaqueryComponent', () => {
  let component: FaqueryComponent;
  let fixture: ComponentFixture<FaqueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
