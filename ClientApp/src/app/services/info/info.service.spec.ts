import { TestBed, inject } from '@angular/core/testing';

import { InfoService } from './info.service';

describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoService]
    });
  });

  it('should be created', inject([InfoService], (service: InfoService) => {
    expect(service).toBeTruthy();
  }));
});
