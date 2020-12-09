import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_service/auth.service';
import { AlertifyService } from '../_service/alertify.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

constructor(
    private authService : AuthService,
    private alertify : AlertifyService,
    private routes : Router){

}

    canActivate(): boolean  {
        if(this.authService.decodedToken){
            return true;
        }

        this.alertify.error("YOU SHALL NOT PASS !!!");
        this.routes.navigate([""]);
        return false;
    }


}