import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from 'src/app/services/request.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-update-tickets-dialog',
  templateUrl: './update-tickets-dialog.component.html',
  styleUrls: ['./update-tickets-dialog.component.css']
})
export class UpdateTicketsDialogComponent {

  constructor(
    private fb: FormBuilder,
    private validator: ValidatorService,
    private request: RequestService,
    public dialogRef: MatDialogRef<UpdateTicketsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public ticketId: any  
  ){}

  users: any
  ticketsForm!: FormGroup
  filteredUsers: any

  createForm() {
    this.ticketsForm = this.fb.group({
      responsible: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit(){
    this.createForm()
    let response = await this.request.getRequest('users')
    this.users = response.data
  }
  
  async UpdateTicket(){
    // console.log('Ticket',this.ticketId)
    // console.log('User',this.ticketsForm.get('responsible')?.value)
    let bodyJson = {
      "user_responsible": this.ticketsForm.get('responsible')?.value
    }

    let filteredUser = this.users.filter((user: any) => user.id == this.ticketsForm.get('responsible')?.value)

    let response = await this.request.patchRequest('tickets', String(this.ticketId), bodyJson)
    if(this.request.checkStatus(response.status)){
      this.dialogRef.close(filteredUser[0].name)
      this.validator.openSnackBarPositive('Usuário Responsável vinculado ao Ticket com sucesso!!')
    }
  }

  closeRequest(){
    this.dialogRef.close()
  }
}
