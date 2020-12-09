import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { AlertifyService } from '../_service/alertify.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegisteration = new EventEmitter();
  user : User;
  registerForm : FormGroup;
  constructor(
    private authService : AuthService,
    private alertify :AlertifyService,
    private formBuilder : FormBuilder,
    private router : Router) { }

  ngOnInit() {
    this.createRegisterForm();
}

  createRegisterForm(){
    this.registerForm = this.formBuilder.group({
      gender : ['male'],
      username : [null, Validators.required],
      knownAs : [null, Validators.required],
      dateOfBirth : [null],
      city : [null, Validators.required],
      country : [null, Validators.required],
      password : [null , [Validators.required , Validators.minLength(4), Validators.maxLength(8) ]],
      confirmPassword : [null, Validators.required]
    }, { validator: this.mismatch('password', 'confirmPassword') });
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.user = Object.assign({} , this.registerForm.value);
      this.authService.onRegister(this.user).subscribe(()=>{
        this.alertify.success("ثبت نام شما با موفقیت انجام شد");
      },error=>{
        this.alertify.error(error);
      },()=>{
        this.authService.onLogin(this.user).subscribe(()=>{
          this.router.navigate(['/member']);
          console.log(this.registerForm.value);
        });
      });
    }
  }

  onCancel(){
    this.cancelRegisteration.emit(false)
  };

  mismatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mismatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mismatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
}
