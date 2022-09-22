import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsaleaddComponent } from './assetsaleadd.component';

describe('AssetsaleaddComponent', () => {
  let component: AssetsaleaddComponent;
  let fixture: ComponentFixture<AssetsaleaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsaleaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsaleaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
