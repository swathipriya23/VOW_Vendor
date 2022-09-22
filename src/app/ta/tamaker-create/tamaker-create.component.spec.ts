import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamakerCreateComponent } from './tamaker-create.component';

describe('TamakerCreateComponent', () => {
  let component: TamakerCreateComponent;
  let fixture: ComponentFixture<TamakerCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamakerCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamakerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
