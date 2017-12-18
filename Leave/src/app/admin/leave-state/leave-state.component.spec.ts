import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveStateComponent } from './leave-state.component';

describe('LeaveStateComponent', () => {
  let component: LeaveStateComponent;
  let fixture: ComponentFixture<LeaveStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
