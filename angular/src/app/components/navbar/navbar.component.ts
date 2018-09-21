import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  get title(){
    return Globals.title;
  }

  logOutButtonClicked(){
    this.auth.logOut();
  }

}
