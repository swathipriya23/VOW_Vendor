import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsalesapproveComponent } from './assetsalesapprove.component';

describe('AssetsalesapproveComponent', () => {
  let component: AssetsalesapproveComponent;
  let fixture: ComponentFixture<AssetsalesapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsalesapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsalesapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
