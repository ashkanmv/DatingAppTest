import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User'
import { UserService } from 'src/app/_service/user.service';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/_models/Pagination';


@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  user : User = JSON.parse(localStorage.getItem('user'));
  genderList =[{value : 'male' , display : 'آقایان'},{value : 'female' , display : 'خانوم ها'}];
  userParams : any = {};
  pagination : Pagination;
  constructor(private alertify : AlertifyService,private userService : UserService,private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data : Data) => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    })

    this.userParams.orderBy = 'lastActive';
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  resetFilter(){
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage,this.pagination.pageSize,this.userParams).subscribe(
        (res :PaginationResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
    },error => {
      this.alertify.error("problemmmm")
    });
  }
}
