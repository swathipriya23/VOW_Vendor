import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsalesummaryComponent } from './assetsalesummary.component';

describe('AssetsalesummaryComponent', () => {
  let component: AssetsalesummaryComponent;
  let fixture: ComponentFixture<AssetsalesummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsalesummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsalesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
