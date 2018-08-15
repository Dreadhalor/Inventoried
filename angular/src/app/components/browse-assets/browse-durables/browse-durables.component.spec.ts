import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDurablesComponent } from './browse-durables.component';

describe('BrowseDurablesComponent', () => {
  let component: BrowseDurablesComponent;
  let fixture: ComponentFixture<BrowseDurablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseDurablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseDurablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
