import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberDetailComponent } from './members/member-detail/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolver/list.resolver';
import { MessageResolver } from './_resolver/message.resolver';

export const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'',
  runGuardsAndResolvers:'always',
  canActivate:[AuthGuard],
  children: [
    {path:'messages',component:MessagesComponent,resolve:{messages : MessageResolver}},
    {path:'member',component:MemberListComponent, resolve :{users : MemberListResolver}},
    {path:'member/edit',component:MemberEditComponent ,
      resolve : {editMember : MemberEditResolver},
      canDeactivate : [PreventUnsavedChanges] },
    {path:'member/:id',component:MemberDetailComponent,resolve : {user : MemberDetailResolver}},
    {path:'lists',component:ListsComponent, resolve : {users : ListResolver}},
  ] },
  {path: '**' , redirectTo : '', pathMatch : 'full'}
];

