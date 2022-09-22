import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorEditComponent } from './sector-edit.component';

describe('SectorEditComponent', () => {
  let component: SectorEditComponent;
  let fixture: ComponentFixture<SectorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
