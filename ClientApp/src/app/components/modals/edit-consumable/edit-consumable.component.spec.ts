import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsumableComponent } from './edit-consumable.component';

describe('EditConsumableComponent', () => {
  let component: EditConsumableComponent;
  let fixture: ComponentFixture<EditConsumableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConsumableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsumableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
