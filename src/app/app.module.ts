// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Angular Materials
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule} from '@angular/material/dialog';  

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/template/header/header.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { NavComponent } from './components/template/nav/nav.component';

// Views
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './views/login/login.component';

// Others
import { AppRoutingModule } from './app-routing.module';
import { SidenavService } from './services/sidenav.service';
import { HomepageComponent } from './views/homepage/homepage.component';
import { PageNFoundComponent } from './views/page-n-found/page-n-found.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MatCommonModule } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EquipCreateComponent } from './main/equipments/equip-create/equip-create.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EquipListComponent } from './main/equipments/equip-list/equip-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common';
import { CustomPaginator } from './main/equipments/equip-list/custom-paginator';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ModelCreateComponent } from './main/models/model-create/model-create.component';
import { ModelListComponent } from './main/models/model-list/model-list.component';
import { DialogAnimationComponent } from './components/template/dialog-animation/dialog-animation.component';
import { FeaturesComponent } from './main/features/features.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ModelContentComponent } from './main/models/model-content/model-content.component';
import { Equipment, Features, Fields, Items, Model, Notebook, Tickets, Type_fields, User } from './app-objects';
import { ItemsComponent } from './main/items/items.component';
import { EditorComponent } from './components/template/editor/editor.component';
import { NgxEditorModule } from "ngx-editor";
import { NotebookAssignComponent } from './main/notebooks/notebook-assign/notebook-assign.component';
import { NotebookListComponent } from './main/notebooks/notebook-list/notebook-list.component';
import { FinishDialogComponent } from './components/template/finish-dialog/finish-dialog.component';
import { NotebookFillComponent } from './main/notebooks/notebook-fill/notebook-fill.component';
import { NotebookContentComponent } from './main/notebooks/notebook-content/notebook-content.component';
import { ModelSelectComponent } from './main/models/model-select/model-select.component';
import { ItemsCopyComponent } from './main/items/items-copy/items-copy.component';
import { NotebookRevokeComponent } from './main/notebooks/notebook-revoke/notebook-revoke.component';
import { NotebookRevokeAssignmentComponent } from './main/notebooks/notebook-revoke-assignment/notebook-revoke-assignment.component';
import { SpinnerComponent } from './components/template/spinner/spinner.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { PopupComponent } from './components/template/popup/popup.component';
import { MatStepperModule } from '@angular/material/stepper';
import { EquipBookListComponent } from './main/equipments/equip-book-list/equip-book-list.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogAlertComponent } from './components/template/dialog-alert/dialog-alert.component';
import { DialogSelectEquipmentComponent } from './components/template/dialog-select-equipment/dialog-select-equipment.component';
import { DialogSelectModelComponent } from './components/template/dialog-select-model/dialog-select-model.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LogManagementComponent } from './main/log-management/log-management.component';
import { CreateUserComponent } from './main/create-user/create-user.component';
import { SwithPasswordComponent } from './components/template/swith-password/swith-password.component';
import { StatusSwithDialogComponent } from './components/template/change-status-dialog/change-status-dialog.component';
import { CreateTicketsDialogComponent } from './components/template/create-tickets-dialog/create-tickets-dialog.component';
import { TicketsListComponent } from './main/tickets/tickets-list/tickets-list.component';
import { UpdateTicketsDialogComponent } from './components/template/update-tickets-dialog/update-tickets-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import { UpdateNotebookNameComponent } from './components/template/update-notebook-name/update-notebook-name.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    HomepageComponent,
    PageNFoundComponent,
    EquipCreateComponent,
    EquipListComponent,
    ModelCreateComponent,
    ModelListComponent,
    DialogAnimationComponent,
    FeaturesComponent,
    ModelContentComponent,
    ItemsComponent,
    EditorComponent,
    NotebookAssignComponent,
    NotebookListComponent,
    FinishDialogComponent,
    NotebookFillComponent,
    NotebookContentComponent,
    ModelSelectComponent,
    ItemsCopyComponent,
    NotebookRevokeComponent,
    NotebookRevokeAssignmentComponent,
    SpinnerComponent,
    StatusSwithDialogComponent,
    SwithPasswordComponent,
    PopupComponent,
    EquipBookListComponent,
    DialogAlertComponent,
    DialogSelectEquipmentComponent,
    DialogSelectModelComponent,
    LogManagementComponent,
    CreateUserComponent,
    CreateTicketsDialogComponent,
    TicketsListComponent,
    UpdateTicketsDialogComponent,
    UpdateNotebookNameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    RouterModule,
    MatCommonModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    NgxEditorModule,
    FullCalendarModule,
    MatExpansionModule,
    MatStepperModule,
    NgxChartsModule,
    AsyncPipe,
    MatAutocompleteModule,
    DragDropModule,
    MatRadioModule,
  ],
  providers: [
    SidenavService, 
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    DatePipe, 
    Equipment, 
    Model, 
    Features, 
    Type_fields, 
    Fields, 
    Items, 
    Notebook,
    User,
    Tickets,
    {provide: MatPaginatorIntl, useValue: CustomPaginator()}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
