import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaMasterComponent } from './fa-master.component';

describe('FaMasterComponent', () => {
  let component: FaMasterComponent;
  let fixture: ComponentFixture<FaMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
