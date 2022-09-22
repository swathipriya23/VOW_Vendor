import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryscreenComponent } from './queryscreen.component';

describe('QueryscreenComponent', () => {
  let component: QueryscreenComponent;
  let fixture: ComponentFixture<QueryscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
