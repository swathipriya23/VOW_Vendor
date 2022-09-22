import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadGroupsComponent } from './head-groups.component';

describe('HeadGroupsComponent', () => {
  let component: HeadGroupsComponent;
  let fixture: ComponentFixture<HeadGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
