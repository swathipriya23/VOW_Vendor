import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfermakerAddComponent } from './transfermaker-add.component';

describe('TransfermakerAddComponent', () => {
  let component: TransfermakerAddComponent;
  let fixture: ComponentFixture<TransfermakerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfermakerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfermakerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
