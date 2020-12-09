import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient ,HttpHeaders, HttpParams} from '@angular/common/http';
import { User } from '../_models/User';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { PaginationResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  baseUrl = environment.apiUrl;
  user : User;
  mainPhoto = new Subject<string>();
  newProfilePhoto : string;

constructor(private http: HttpClient) { }

  ngOnInit(){}

  getUsers(page? , itemsPerPage?, userParams?,likesParam?) : Observable<PaginationResult<User[]>> {
    let pagination : PaginationResult<User[]> = new PaginationResult<User[]>();

    let params = new HttpParams;

    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber',page);
      params = params.append('pageSize' , itemsPerPage);
    }

    if(userParams != null){
      params = params.append('gender',userParams.gender);
      params = params.append('orderBy',userParams.orderBy);
    }

    if(likesParam === 'liker'){
      params = params.append('liker' , 'true');
    }

    if(likesParam === 'likes'){
      params = params.append('likes', ' true');
    }

    return this.http.get<User[]>(this.baseUrl + 'users',{ observe : 'response' , params})
      .pipe(
        map(response=>{
          pagination.result = response.body;
          if(response.headers.get('Pagination') != null){
            pagination.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return pagination;
        })
      )
  };

  getUser(id : number) : Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id )
  };

  updateUser(id : number , user:User){
    return this.http.put(this.baseUrl + "users/" + id, user);
  }

  setMainPhoto(userId : number, id : number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/Photos/' + id + '/setMain' , {});
  }

  deletePhoto(userId : number, id : number){
    return this.http.delete(this.baseUrl + 'users/' + userId + '/Photos/'+ id);
  }

  sendLike(userId: number , likee : number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/likes/' + likee,{});
  }

  getMessages(userId:number,pageNumber?,pageSize?,messageContent?){
    const paginationResult : PaginationResult<Message[]> = new PaginationResult<Message[]>();
    let params = new HttpParams;

    params = params.append('messageContent' , messageContent);

    if(pageNumber != null && pageSize != null){
      params = params.append('pageSize' , pageSize);
      params = params.append('pageNumber',pageNumber);
    }

    return this.http.get<Message[]>(this.baseUrl +'users/'+ userId + '/message',{observe : 'response',params}).pipe(
      map(response=>{
        paginationResult.result = response.body;
        if(response.headers.get('Pagination') != null){
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination'))
        }
        return paginationResult;
      })
    )
  }

  getMessageThread(userId : number , receiverId : number){
    return this.http.get<Message[]>(this.baseUrl + 'users/' + userId + '/message/thread/' + receiverId);
  }

  sendMessage(userId:number , message : Message){
    return this.http.post(this.baseUrl + 'users/' + userId + '/message',message);
  }

  deleteMessage(userId : number , messageId : number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/message/' + messageId,{});
  }

  markAsRead(userId:number, messageId:number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/message/' + messageId + '/read' , {} ).subscribe();
  }
}
