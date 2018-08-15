import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableSelectComponent } from './consumable-select.component';

describe('ConsumableSelectComponent', () => {
  let component: ConsumableSelectComponent;
  let fixture: ComponentFixture<ConsumableSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumableSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
