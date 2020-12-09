import { Component, OnInit, Input } from '@angular/core';
import { error } from 'protractor';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { AuthService } from 'src/app/_service/auth.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() usercard : User;
  constructor(
    private userService : UserService,
    private alertify : AlertifyService,
    private authService : AuthService
  ) { }

  ngOnInit() {
  }

  likeUser(){
    this.userService.sendLike(this.authService.decodedToken.nameid,this.usercard.id).subscribe(next=>{
      this.alertify.success(' شما '+ this.usercard.knownAs + ' را لایک کردید ' );
    },error=>{
      this.alertify.error(error);
    })
  }

}
