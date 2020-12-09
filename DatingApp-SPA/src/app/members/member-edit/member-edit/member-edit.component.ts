import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute, Data } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_service/user.service';
import { AuthService } from 'src/app/_service/auth.service';
import { AlertifyService } from 'src/app/_service/alertify.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user : User;
  photoUrl: string;

  @ViewChild('form' ,{static : true}) editForm : NgForm;

  constructor(private route : ActivatedRoute,
    private userService : UserService,
    private authService : AuthService,
    private alertify : AlertifyService) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(newPhotoUrl=>{
      this.photoUrl = newPhotoUrl;
    });

    this.route.data.subscribe((data: Data)=>{
      this.user = data['editMember'];
    });
  }

  updateUser(){
    this.userService.updateUser(this.authService.decodedToken.nameid , this.user).subscribe(next=>{
      this.alertify.success("با موفقیت انجام شد");
      this.editForm.reset(this.user);
    },error=>{
      this.alertify.error(error);
    });
  }
}
