import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RequestService } from 'src/app/services/request.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-create-tickets-dialog',
  templateUrl: './create-tickets-dialog.component.html',
  styleUrls: ['./create-tickets-dialog.component.css']
})
export 
class CreateTicketsDialogComponent {

  constructor(
    private fb: FormBuilder,
    private validator: ValidatorService,
    private request: RequestService,
    public dialogRef: MatDialogRef<CreateTicketsDialogComponent>,
  ){}

  categories = [
    {
      "id": 0,
      "name": 'BUG'
    },
    {
      "id": 1,
      "name": 'Ajuste'
    },
    {
      "id": 2,
      "name": 'Melhoria'
    }
  ];

  users: any
  ticketsForm!: FormGroup
  filteredUsers: any

  createForm() {
    this.ticketsForm = this.fb.group({
      category: new FormControl(null, [Validators.required]),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
    });
  }

  async ngOnInit(){
    this.createForm()
    let response = await this.request.getRequest('users')
    this.users = response.data
    this.filteredUsers = this.users.filter((user: any) => user.name === localStorage.getItem('name'));
  }
  
  async createTicket(){
    let bodyJson = {
      "title": this.ticketsForm.get('title')?.value,
      "category": this.ticketsForm.get('category')?.value,
      "description": this.ticketsForm.get('description')?.value,
      "user_requester": this.filteredUsers[0].id
    }

    let response = await this.request.postRequest('tickets', bodyJson)

    if(this.request.checkStatus(response.status)){
      this.validator.openSnackBarPositive('Ticket criado com sucesso!!')
      this.dialogRef.close()
    }
  }

  closeRequest(){
    this.dialogRef.close()
  }
}
