import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkaddDetailComponent } from './workadd-detail.component';

describe('WorkaddDetailComponent', () => {
  let component: WorkaddDetailComponent;
  let fixture: ComponentFixture<WorkaddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkaddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkaddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
