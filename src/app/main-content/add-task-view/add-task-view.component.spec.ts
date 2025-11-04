import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskViewComponent } from './add-task-view.component';

describe('AddTaskViewComponent', () => {
  let component: AddTaskViewComponent;
  let fixture: ComponentFixture<AddTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
