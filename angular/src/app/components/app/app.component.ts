import { Component } from "@angular/core";
import { ModalDeploymentService } from "../../services/modal-deployment.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'app';

  constructor(
    private mds: ModalDeploymentService,
    private us: UserService
  ){}
}
