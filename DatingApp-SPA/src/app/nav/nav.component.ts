import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { AlertifyService } from '../_service/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public service : AuthService,private alertify : AlertifyService) { }

  ngOnInit() {

  }
  login(){
    this.service.onLogin(this.model).subscribe(next=>{
      this.alertify.success('موفق شدی');
    },error => {
      this.alertify.error('ریدی')
    });
}
  Logout(){
    localStorage.removeItem('token');
    this.alertify.message("Logout")
};

  loggedIn(){
    const token = localStorage.getItem('token');
    return !!token;
  }

}
