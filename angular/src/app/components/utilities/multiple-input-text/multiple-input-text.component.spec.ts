import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleInputTextComponent } from './multiple-input-text.component';

describe('MultipleInputTextComponent', () => {
  let component: MultipleInputTextComponent;
  let fixture: ComponentFixture<MultipleInputTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleInputTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
