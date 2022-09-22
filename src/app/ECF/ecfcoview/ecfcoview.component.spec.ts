import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfcoviewComponent } from './ecfcoview.component';

describe('EcfcoviewComponent', () => {
  let component: EcfcoviewComponent;
  let fixture: ComponentFixture<EcfcoviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfcoviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfcoviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
