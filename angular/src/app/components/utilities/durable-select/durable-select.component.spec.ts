import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DurableSelectComponent } from './durable-select.component';

describe('DurableSelectComponent', () => {
  let component: DurableSelectComponent;
  let fixture: ComponentFixture<DurableSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DurableSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
