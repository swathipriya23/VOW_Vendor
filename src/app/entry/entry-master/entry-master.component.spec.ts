import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryMasterComponent } from './entry-master.component';

describe('EntryMasterComponent', () => {
  let component: EntryMasterComponent;
  let fixture: ComponentFixture<EntryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
