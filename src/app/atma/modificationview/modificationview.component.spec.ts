import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModificationviewComponent } from './modificationview.component';

describe('ModificationviewComponent', () => {
  let component: ModificationviewComponent;
  let fixture: ComponentFixture<ModificationviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
