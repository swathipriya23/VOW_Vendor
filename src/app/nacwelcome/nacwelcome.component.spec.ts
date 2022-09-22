import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NacwelcomeComponent } from './nacwelcome.component';

describe('NacwelcomeComponent', () => {
  let component: NacwelcomeComponent;
  let fixture: ComponentFixture<NacwelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NacwelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NacwelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
