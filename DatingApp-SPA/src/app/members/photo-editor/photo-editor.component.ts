import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/Photo';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { AuthService } from 'src/app/_service/auth.service';
import { UserService } from 'src/app/_service/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos : Photo[];
  baseUrl = environment.apiUrl;
  currentMainPhoto : Photo;

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;

  constructor(private authService : AuthService,
    private userService : UserService,
    private alertify : AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader (){
    this.uploader = new FileUploader({
      url : this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos' ,
      authToken : 'bearer ' + localStorage.getItem('token'),
      isHTML5 : true,
      allowedFileType : ['image'],
      removeAfterUpload : true,
      autoUpload: false,
      maxFileSize : 10*1024*1024
    })
    this.uploader.onAfterAddingFile =(file) => {file.withCredentials = false; };

    this.uploader.onSuccessItem = (item,response,status,headers) => {
      if(response){
        const res : Photo= JSON.parse(response);
        const photo = {
          id : res.id,
          url : res.url,
          dateAdded : res.dateAdded,
          description : res.description,
          isMain : res.isMain
        };
        this.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo : Photo){
    this.userService.setMainPhoto(
      this.authService.decodedToken.nameid,photo.id).subscribe(next=>{
      this.currentMainPhoto = this.photos.filter(p=>p.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      this.authService.updateCurrentUrl(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    },error=>{
      this.alertify.error('مشکلی پیش آمد')
    })
  }

  deletePhoto(id : number) {
    this.alertify.confirm('آیا از حذف این عکس مطمئن هستید؟',()=>{
      this.userService.deletePhoto(this.authService.decodedToken.nameid,id).subscribe(()=>{
        this.photos.splice(this.photos.findIndex(p=>p.id),1);
        this.alertify.success('عکس مورد نظر با موفقیت حذف شد');
      },error => {
        this.alertify.error('حذف عکس با خطا مواجه شد');
      });
    })
  }

}
