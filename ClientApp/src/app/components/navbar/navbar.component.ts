import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  get title(){
    return Globals.title;
  }

}
