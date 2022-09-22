import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamakerEditComponent } from './tamaker-edit.component';

describe('TamakerEditComponent', () => {
  let component: TamakerEditComponent;
  let fixture: ComponentFixture<TamakerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamakerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamakerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
