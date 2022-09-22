import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorCreateComponent } from './sector-create.component';

describe('SectorCreateComponent', () => {
  let component: SectorCreateComponent;
  let fixture: ComponentFixture<SectorCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
