import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryServiceComponent } from './entry-service.component';

describe('EntryServiceComponent', () => {
  let component: EntryServiceComponent;
  let fixture: ComponentFixture<EntryServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
