import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonTightComponent } from './button-tight.component';

describe('ButtonTightComponent', () => {
  let component: ButtonTightComponent;
  let fixture: ComponentFixture<ButtonTightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonTightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonTightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
