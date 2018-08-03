import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDurableComponent } from './edit-durable';

describe('AssetEditModalComponent', () => {
  let component: EditDurableComponent;
  let fixture: ComponentFixture<EditDurableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDurableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDurableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
