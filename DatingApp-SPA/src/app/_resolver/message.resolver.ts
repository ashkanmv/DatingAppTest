import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { AlertifyService } from '../_service/alertify.service';
import { AuthService } from '../_service/auth.service';
import { UserService } from '../_service/user.service';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pageSize = 5;
    pageNumber = 1;
    container = 'Unread';
    constructor(private userService : UserService,
        private authService:AuthService,
        private alertify : AlertifyService,
        private router: Router){}

    resolve(route:ActivatedRouteSnapshot):Observable<Message[]>{
        return this.userService.getMessages(this.authService.decodedToken.nameid,this.pageNumber,this.pageSize,this.container).pipe(
            catchError(error=>{
                this.alertify.error(error);
                this.router.navigate(['']);
                return of(null);
            })
        );
    }
}
