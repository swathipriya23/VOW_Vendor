import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfermakeraddComponent } from './transfermakeradd.component';

describe('TransfermakeraddComponent', () => {
  let component: TransfermakeraddComponent;
  let fixture: ComponentFixture<TransfermakeraddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfermakeraddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfermakeraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
