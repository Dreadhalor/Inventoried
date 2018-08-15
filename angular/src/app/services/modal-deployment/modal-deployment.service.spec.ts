import { TestBed, inject } from '@angular/core/testing';

import { ModalDeploymentService } from './modal-deployment.service';

describe('ModalDeploymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalDeploymentService]
    });
  });

  it('should be created', inject([ModalDeploymentService], (service: ModalDeploymentService) => {
    expect(service).toBeTruthy();
  }));
});
