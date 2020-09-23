import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false ;

  constructor() { }

  ngOnInit() {
  }

  onRegister(){
    this.registerMode = true;
  }

  cancellRegistretion(cancell : boolean){
    this.registerMode = cancell;
  }
}
