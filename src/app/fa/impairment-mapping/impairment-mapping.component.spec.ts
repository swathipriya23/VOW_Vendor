import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpairmentMappingComponent } from './impairment-mapping.component';

describe('ImpairmentMappingComponent', () => {
  let component: ImpairmentMappingComponent;
  let fixture: ComponentFixture<ImpairmentMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpairmentMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpairmentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
