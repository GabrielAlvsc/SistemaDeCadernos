import { AuthUserService } from './services/guards/auth-user.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component'
import { LoginComponent } from './views/login/login.component';
import { HomepageComponent } from './views/homepage/homepage.component';
import { PageNFoundComponent } from './views/page-n-found/page-n-found.component';
import { NotAuthUserService } from './services/guards/not-auth-user.service';
import { EquipCreateComponent } from './main/equipments/equip-create/equip-create.component';
import { EquipListComponent } from './main/equipments/equip-list/equip-list.component';
import { ModelCreateComponent } from './main/models/model-create/model-create.component';
import { ModelListComponent } from './main/models/model-list/model-list.component';
import { FeaturesComponent } from './main/features/features.component';
import { ModelContentComponent } from './main/models/model-content/model-content.component';
import { ItemsComponent } from './main/items/items.component';
import { NotebookAssignComponent } from './main/notebooks/notebook-assign/notebook-assign.component';
import { NotebookListComponent } from './main/notebooks/notebook-list/notebook-list.component';
import { NotebookFillComponent } from './main/notebooks/notebook-fill/notebook-fill.component';
import { NotebookContentComponent } from './main/notebooks/notebook-content/notebook-content.component';
import { ModelSelectComponent } from './main/models/model-select/model-select.component';
import { ItemsCopyComponent } from './main/items/items-copy/items-copy.component';
import { NotebookRevokeComponent } from './main/notebooks/notebook-revoke/notebook-revoke.component';
import { NotebookRevokeAssignmentComponent } from './main/notebooks/notebook-revoke-assignment/notebook-revoke-assignment.component';
import { SwithPasswordComponent } from './components/template/swith-password/swith-password.component';
import { EquipBookListComponent } from './main/equipments/equip-book-list/equip-book-list.component';
import { LogManagementComponent } from './main/log-management/log-management.component';
import { CreateUserComponent } from './main/create-user/create-user.component';
import { TicketsListComponent } from './main/tickets/tickets-list/tickets-list.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "login", pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent, canActivate: [NotAuthUserService],
  },
  {
    path: "home",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: HomeComponent }
    ],
  },
  {
    path: "equipments",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: EquipListComponent },
      { path: 'create', component: EquipCreateComponent },
      { path: 'edit/:id', component: EquipCreateComponent },
      { path: 'books/:id', component: EquipBookListComponent }
    ],
  },
  {
    path: "models",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: 'create', component: ModelCreateComponent },
      { path: '', component: ModelListComponent },
      { path: ':id/select', component: ModelSelectComponent },
      { path: ':id/select/:id/copy', component: ItemsCopyComponent },
      { path: ':id', component: ModelContentComponent },
      { path: ':id/features/create', component: FeaturesComponent },
      { path: ':id/features/edit/:id', component: FeaturesComponent },
      { path: ':id/item/create', component: ItemsComponent },
      { path: ':id/item/edit/:id', component: ItemsComponent }
    ],
  }, 
  {
    path: "notebooks",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: NotebookListComponent },
      { path: ':id', component: NotebookContentComponent },
      { path: ':id/item/:id', component: NotebookFillComponent },
      { path: ':id/features/:id', component: NotebookFillComponent}
    ],
  },
  {
    path: "books-in-execution",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: NotebookListComponent },
      { path: 'assign', component: NotebookAssignComponent },
      { path: 'edit/:id', component: NotebookAssignComponent }
    ],
  },
  {
    path: "mybooks",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: NotebookListComponent },
      { path: ':id', component: NotebookContentComponent },
      { path: ':id/item/:id', component: NotebookFillComponent },
      { path: ':id/features/:id', component: NotebookFillComponent}
    ],
  },
  {
    path: "myreviews",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: NotebookListComponent },
      { path: ':id', component: NotebookContentComponent },
      { path: ':id/item/:id', component: NotebookFillComponent },
      { path: ':id/features/:id', component: NotebookFillComponent}
    ],
  },
  {
    path: "revokebooks",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: NotebookRevokeComponent },
      { path: ':id', component: NotebookRevokeAssignmentComponent }
    ],
  },
  {
    path: "tickets",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: TicketsListComponent }
    ],
  },
  {
    path: "createUser",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: CreateUserComponent }
    ],
  },
  {
    path: "management",
    component: HomepageComponent, canActivate: [AuthUserService],
    children: [
      { path: '', component: LogManagementComponent }
    ],
  },
  {
    path: "404",
    component: PageNFoundComponent
  },
  {
    path: '**', 
    redirectTo: '404'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
