import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseAssetsComponent } from './browse-assets.component';

describe('BrowseAssetsComponent', () => {
  let component: BrowseAssetsComponent;
  let fixture: ComponentFixture<BrowseAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
