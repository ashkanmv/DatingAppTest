import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { error } from 'protractor';
import { AlertifyService } from '../_service/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegisteration = new EventEmitter();

  data :any ={};


  constructor(private authService : AuthService, private alertify :AlertifyService) { }

  ngOnInit() {
  }

  onSubmit(){
    this.authService.onRegister(this.data).subscribe(()=>{
      this.alertify.success("Registered :)))")
    },error=>{
      this.alertify.error(error)
    });
  }

  onCancel(){
    this.cancelRegisteration.emit(false)
  };
}
