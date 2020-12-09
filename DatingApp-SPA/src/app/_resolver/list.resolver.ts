import { ActivatedRouteSnapshot, Data, Resolve, Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/User';
import { AlertifyService } from '../_service/alertify.service';
import { AuthService } from '../_service/auth.service';
import { UserService } from '../_service/user.service';

    export class ListResolver implements Resolve<User[]> {
    currentPage : number = 1;
    pageSize : number = 5;
    liked = 'liker' ;

    constructor(private userService : UserService,
                private authService : AuthService,
                private alertify : AlertifyService,
                private router : Router) {}

    resolve(route : ActivatedRouteSnapshot) :Observable<User[]> {
        return this.userService.getUsers(this.currentPage,this.pageSize,null,
            this.liked).pipe(
                catchError(error=>{
                this.alertify.error(error);
                this.router.navigate(['/home']);
                return of(null);
            }))
    }
}
