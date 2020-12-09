import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Message } from '../_models/Message';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { AlertifyService } from '../_service/alertify.service';
import { AuthService } from '../_service/auth.service';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  message : Message[];
  pagination : Pagination;
  container = 'Unread';
  constructor(
    private route : ActivatedRoute,
    private userService : UserService,
    private authService : AuthService,
    private alertify : AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe((data:Data)=>{
      this.message = data['messages'].result;
      this.pagination = data['messages'].pagination;
    })
  }
  loadMessages(){
    this.userService.getMessages(this.authService.decodedToken.nameid,this.pagination.currentPage,this.pagination.pageSize,this.container).subscribe(
      (res:PaginationResult<Message[]>)=>{
      this.message = res.result;
      this.pagination = res.pagination;
    },error=>{
      this.alertify.error(error);
    })
    }

    pageChanged(event: any): void {
      this.pagination.currentPage = event.page;
      this.loadMessages();
    }

    deleteMessage(messageId : number){
      this.alertify.confirm("آیا از حذف این پیام اطمینان دارید ؟",()=>{
        this.userService.deleteMessage(this.authService.decodedToken.nameid,messageId).subscribe(next=>{
          this.message.splice(this.message.findIndex(i => i.id === messageId),1);
          this.alertify.success('پیام شما با موفقیت حذف شد');
        },error=>{
          this.alertify.error('مشکلی در حذف پیام پیش آمده!!!');
        })
      } )
    }
}
