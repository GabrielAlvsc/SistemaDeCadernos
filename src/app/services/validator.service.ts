import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DialogAnimationComponent } from '../components/template/dialog-animation/dialog-animation.component';
import { MatDialog } from '@angular/material/dialog';
import { FinishDialogComponent } from '../components/template/finish-dialog/finish-dialog.component';
import { StatusSwithDialogComponent } from '../components/template/change-status-dialog/change-status-dialog.component';
import { PopupComponent } from '../components/template/popup/popup.component';
import { DialogAlertComponent } from '../components/template/dialog-alert/dialog-alert.component';
import { DialogSelectEquipmentComponent } from '../components/template/dialog-select-equipment/dialog-select-equipment.component';
import { Observable } from 'rxjs';
import { DialogSelectModelComponent } from '../components/template/dialog-select-model/dialog-select-model.component';
import { SwithPasswordComponent } from '../components/template/swith-password/swith-password.component';
import { CreateTicketsDialogComponent } from '../components/template/create-tickets-dialog/create-tickets-dialog.component';
import { UpdateTicketsDialogComponent } from '../components/template/update-tickets-dialog/update-tickets-dialog.component';
import { UpdateNotebookNameComponent } from '../components/template/update-notebook-name/update-notebook-name.component';
StatusSwithDialogComponent

@Injectable({
  providedIn: 'root'
})

//Serviço que controla a chamada dos classes Dialog
export class ValidatorService {

  constructor(
    private snackBar: MatSnackBar, 
    public dialog: MatDialog
  ) { }

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  getErrorMessage(x: FormControl<string | null>): string {
    if (x.hasError('required')) {
      return '';
    } else {
      return '';
    }
  }

  // Abre um pop-up no canto superior direito com mensagem personalizada de erro
  openSnackBar(message: string) {
    this.snackBar.open(message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 6000
    })
  }

  openSnackBarPositive(message: string) {
    this.snackBar.open(message, '✅', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 6000,
      panelClass: ['mat-primary']
    })
  }

  // Abre o pop-up de confirmação de exclusão
  dialogDelete(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(DialogAnimationComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  // Abre o pop-up de confirmação e inserção de comentário
  dialogFinish(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(FinishDialogComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  //Abre o pop-up para alterar o status de um caderno com comentário
  dialogSwithStatus(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(StatusSwithDialogComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  //Abre o pop-up para visualizar os detalhes do caderno agendado no calendário
  dialogPopUp(enterAnimationDuration: string, exitAnimationDuration: string, eventInfo: {}) {
    this.dialog.open(PopupComponent, {
      width: '30%',
      data: eventInfo,
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  dialogAlert(enterAnimationDuration: string, exitAnimationDuration: string, data: any) {
    this.dialog.open(DialogAlertComponent, {
      width: '800px',
      data: data,
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  dialogSelectEquipment(enterAnimationDuration: string, exitAnimationDuration: string, data: any): Observable<any> {
    const dialogRef = this.dialog.open(DialogSelectEquipmentComponent, {
      width: '800px',
      data: data,
      enterAnimationDuration,
      exitAnimationDuration
    });

    return dialogRef.afterClosed();
  }

  dialogSelectModel(enterAnimationDuration: string, exitAnimationDuration: string, data: any): Observable<any> {
    const dialogRef = this.dialog.open(DialogSelectModelComponent, {
      width: '800px',
      data: data,
      enterAnimationDuration,
      exitAnimationDuration
    });

    return dialogRef.afterClosed();
  }

  //Abre o popUp de trocar a senha
  dialogChangePass(enterAnimationDuration: string, exitAnimationDuration: string){
    this.dialog.open(SwithPasswordComponent, {
      width: '400px',
      height: '520px',
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  dialogCreateTicket(enterAnimationDuration: string, exitAnimationDuration: string){
    this.dialog.open(CreateTicketsDialogComponent, {
      width: '600px',
      height: '500px',
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  dialogUpdatgeTicket(enterAnimationDuration: string, exitAnimationDuration: string, ticketId: number): Observable<any>{
    const dialogRef = this.dialog.open(UpdateTicketsDialogComponent, {
      width: '600px',
      height: '250px',
      data: ticketId,
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration
    });

    return dialogRef.afterClosed();
  }

  dialogUpdatgeName(enterAnimationDuration: string, exitAnimationDuration: string,modelId: string): Observable<any>{
    const dialogRef = this.dialog.open(UpdateNotebookNameComponent, {
      width: '600px',
      height: '250px',
      data: modelId,
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration
    });

    return dialogRef.afterClosed();
  }
}
