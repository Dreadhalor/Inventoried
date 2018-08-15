import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsumableComponent } from './add-consumable.component';

describe('AddConsumableComponent', () => {
  let component: AddConsumableComponent;
  let fixture: ComponentFixture<AddConsumableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConsumableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsumableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
