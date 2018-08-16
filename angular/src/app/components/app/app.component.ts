import { UserService } from './../../services/user/user.service';
import { Component } from '@angular/core';
import { ModalDeploymentService } from '../../services/modal-deployment/modal-deployment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'app';

  constructor(
    private mds: ModalDeploymentService
  ){}
}
