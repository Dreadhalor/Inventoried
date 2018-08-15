import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseConsumablesComponent } from './browse-consumables.component';

describe('BrowseConsumablesComponent', () => {
  let component: BrowseConsumablesComponent;
  let fixture: ComponentFixture<BrowseConsumablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseConsumablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseConsumablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
