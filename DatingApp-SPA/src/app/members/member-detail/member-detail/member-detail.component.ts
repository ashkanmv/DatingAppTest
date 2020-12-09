import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_service/user.service';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_service/alertify.service';
import {  ActivatedRoute, Data } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { Photo } from 'src/app/_models/Photo';
import { TabsetComponent } from 'ngx-bootstrap/tabs';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static : true}) memberTabs : TabsetComponent;
  user : User;
  photo : Photo;
  photoUrl : string;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService : UserService,private alertify : AlertifyService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data : Data)=>{
      this.user = data['user'];
      this.photoUrl = this.user.photoUrl;
      console.log(this.photoUrl);
    });

    this.route.queryParams.subscribe(params=>{
      const selectedTab = params['Tab'];
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0 ].active = true;
    })

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent:100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];
    this.galleryImages = this.getImages();
  }

  getImages(){
    const imageUrl = [];
    for (const photo of this.user.photos) {
      imageUrl.push({
        small: photo.url,
        medium:photo.url,
        big: photo.url
      })
    }
    return imageUrl;
  };

  getUser(id){
    this.userService.getUser(+this.route.snapshot.params['id'])
  }

  selectTab(tabId : number){
    this.memberTabs.tabs[tabId].active = true;
  }
}
