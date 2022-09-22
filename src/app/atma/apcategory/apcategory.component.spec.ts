import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApcategoryComponent } from './apcategory.component';

describe('ApcategoryComponent', () => {
  let component: ApcategoryComponent;
  let fixture: ComponentFixture<ApcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
