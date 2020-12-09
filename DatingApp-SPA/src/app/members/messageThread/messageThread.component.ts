import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/Message';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { AuthService } from 'src/app/_service/auth.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-messageThread',
  templateUrl: './messageThread.component.html',
  styleUrls: ['./messageThread.component.scss']
})
export class MessageThreadComponent implements OnInit {
  @Input() receiverId : number;
  message : Message[];
  messageContent : any = {};
  constructor(
    private authService : AuthService,
    private userService : UserService,
    private alertify : AlertifyService
  ) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){
    const currentId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(currentId,this.receiverId).
    pipe(
      tap(message =>{
        for (let i = 0; i < message.length; i++) {
          if(message[i].isRead === false && message[i].receiverId === currentId){
            this.userService.markAsRead(currentId,message[i].id);
          }

        }
      })
    ).
    subscribe(message =>{
      this.message = message;
    },error=>{
      this.alertify.error('دریافت اطلاعات با خطا مواجه شد');
    });
  }

  sendMessage(){
    this.messageContent.receiverId = this.receiverId;
    this.messageContent.senderId = this.authService.decodedToken.nameid;
    this.userService.sendMessage(this.authService.decodedToken.nameid,this.messageContent)
    .subscribe((message:Message)=>{
      this.message.unshift(message);
      this.messageContent.content = '';
    },error=>{
      this.alertify.error(error);
    })
  }
}
