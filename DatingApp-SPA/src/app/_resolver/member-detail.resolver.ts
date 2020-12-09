import { Injectable } from "@angular/core";
import { Resolve, Route, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class MemberDetailResolver implements Resolve<User>{
    constructor(
        private userService : UserService,
        private route : Router,
        private alertify : AlertifyService){}
        resolve(router : ActivatedRouteSnapshot) : Observable<User>{
            return this.userService.getUser(+router.params['id']).pipe(
                catchError(error=>{
                    this.alertify.error("errrrrror in retriving data");
                    this.route.navigate(['/member']);
                    return of(null);
                }))
        }
}