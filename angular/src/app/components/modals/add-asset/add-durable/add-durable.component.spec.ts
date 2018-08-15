import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDurableComponent } from './add-durable.component';

describe('AddDurableComponent', () => {
  let component: AddDurableComponent;
  let fixture: ComponentFixture<AddDurableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDurableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDurableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
