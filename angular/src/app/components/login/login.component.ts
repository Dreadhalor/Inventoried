import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: string = '';
  pass: string = '';

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  loginButtonClicked(){
    this.auth.logIn(this.user, this.pass).then(
      authenticated => console.log(authenticated)
    ).catch(exception => console.log(exception));
  }

}
