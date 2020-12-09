import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_service/user.service';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_service/alertify.service';
import { catchError } from 'rxjs/operators';

@Injectable()

export class MemberListResolver implements Resolve<User[]>{
    constructor(
        private userService : UserService,
        private router : Router,
        private alertify : AlertifyService){}

    resolve(route : ActivatedRouteSnapshot ) : Observable<User[]>{
        let pageNumber = 1;
        let pageSize = 5;

        return this.userService.getUsers(pageNumber,pageSize).pipe(
            catchError(error=>{
                this.alertify.error(error);
                this.router.navigate(['']);
                return of(null);
            })
        )
    }
}