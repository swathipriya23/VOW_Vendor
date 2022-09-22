import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusinesssegmentComponent } from './create-businesssegment.component';

describe('CreateBusinesssegmentComponent', () => {
  let component: CreateBusinesssegmentComponent;
  let fixture: ComponentFixture<CreateBusinesssegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusinesssegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusinesssegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
