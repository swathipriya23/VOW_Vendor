import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuediligenceModificationComponent } from './duediligence-modification.component';

describe('DuediligenceModificationComponent', () => {
  let component: DuediligenceModificationComponent;
  let fixture: ComponentFixture<DuediligenceModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuediligenceModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuediligenceModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
