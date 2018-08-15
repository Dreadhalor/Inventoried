import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssignmentContentComponent } from './edit-assignment-content.component';

describe('EditAssignmentContentComponent', () => {
  let component: EditAssignmentContentComponent;
  let fixture: ComponentFixture<EditAssignmentContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssignmentContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssignmentContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
