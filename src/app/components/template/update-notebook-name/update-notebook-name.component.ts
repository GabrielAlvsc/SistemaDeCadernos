import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from 'src/app/services/request.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-update-notebook-name',
  templateUrl: './update-notebook-name.component.html',
  styleUrls: ['./update-notebook-name.component.css']
})
export class UpdateNotebookNameComponent {
    
    constructor(
        private fb: FormBuilder,
        private validator: ValidatorService,
        private request: RequestService,
        public dialogRef: MatDialogRef<UpdateNotebookNameComponent>,
        @Inject(MAT_DIALOG_DATA) public modelId: any  
      ){}
    
    ticketsForm!: FormGroup

  createForm() {
    this.ticketsForm = this.fb.group({
      title: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit(){
    this.createForm()
  }

  async updateName(){
    let bodyJson = {
      "id": this.modelId,
      "title": this.ticketsForm.get('title')?.value
    }

    let response: any 
    response = await this.request.putRequest(`models/${this.modelId}`,'edit',bodyJson)
    if(response.status == 200) {
      this.closeRequest()
      window.location.reload();
    }
  }

  closeRequest(){
    this.dialogRef.close()
  }
}