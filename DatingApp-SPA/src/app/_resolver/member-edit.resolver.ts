import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { Observable, of } from 'rxjs';
import { UserService } from '../_service/user.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_service/auth.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_service/alertify.service';

@Injectable()

export class MemberEditResolver implements Resolve<User> {
    constructor(private alertify : AlertifyService,
        private http : HttpClient,
        private route : Router,
        private authService : AuthService,
        private userService: UserService){}
    resolve(router : ActivatedRouteSnapshot): Observable<User>{
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error=>{
                this.alertify.error('خطا در بارگذاری اطلاعات ویرایش');
                this.route.navigate(['/member']);
                return of(null);
            })
        )
    }
}
