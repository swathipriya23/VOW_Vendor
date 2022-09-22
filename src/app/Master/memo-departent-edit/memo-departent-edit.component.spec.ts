import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoDepartentEditComponent } from './memo-departent-edit.component';

describe('MemoDepartentEditComponent', () => {
  let component: MemoDepartentEditComponent;
  let fixture: ComponentFixture<MemoDepartentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoDepartentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoDepartentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
