import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteoffmakerAddComponent } from './writeoffmaker-add.component';

describe('WriteoffmakerAddComponent', () => {
  let component: WriteoffmakerAddComponent;
  let fixture: ComponentFixture<WriteoffmakerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteoffmakerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteoffmakerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
