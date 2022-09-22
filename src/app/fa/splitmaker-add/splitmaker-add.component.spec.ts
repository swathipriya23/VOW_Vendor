import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitmakerAddComponent } from './splitmaker-add.component';

describe('SplitmakerAddComponent', () => {
  let component: SplitmakerAddComponent;
  let fixture: ComponentFixture<SplitmakerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitmakerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitmakerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
