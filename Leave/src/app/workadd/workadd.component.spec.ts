import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkaddComponent } from './workadd.component';

describe('WorkaddComponent', () => {
  let component: WorkaddComponent;
  let fixture: ComponentFixture<WorkaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
