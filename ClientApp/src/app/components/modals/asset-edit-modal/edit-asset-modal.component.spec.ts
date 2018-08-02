import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetModalComponent } from './edit-asset-modal.component';

describe('AssetEditModalComponent', () => {
  let component: EditAssetModalComponent;
  let fixture: ComponentFixture<EditAssetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
