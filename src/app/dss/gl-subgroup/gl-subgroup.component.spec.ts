import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlSubgroupComponent } from './gl-subgroup.component';

describe('GlSubgroupComponent', () => {
  let component: GlSubgroupComponent;
  let fixture: ComponentFixture<GlSubgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlSubgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlSubgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
