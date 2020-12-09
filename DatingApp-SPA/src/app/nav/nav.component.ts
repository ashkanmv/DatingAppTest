import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { AlertifyService } from '../_service/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(
    public authService : AuthService,
    private alertify : AlertifyService,
    private router : Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(newPhotoUrl=>{
      this.photoUrl = newPhotoUrl;
    })
  }
  login(){
    this.authService.onLogin(this.model).subscribe(next=>{
      this.alertify.success('موفق شدی');
    },error => {
      this.alertify.error('نام کاربری یا گذرواژه اشتباه است')
    },()=>{
      this.router.navigate(['/member']);
    });
}
  Logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message("خارج شدید");
    this.router.navigate(['']);

};

  loggedIn(){
    return this.authService.loggedIn();
  }

}
