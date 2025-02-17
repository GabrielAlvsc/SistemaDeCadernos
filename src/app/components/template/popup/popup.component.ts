import { RequestService } from './../../../services/request.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

//Pop-up para visualizar os detalhes do caderno agendado no calendário
export class PopupComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<PopupComponent>
  ) { }

  inputData: any

  title: string = ''
  vendor: string = ''
  equipment: string = ''
  startDate: string = ''
  endDate: string = ''
  userExecutor: string = ''
  userResponsible: string = ''
  color: string = ''

  ngOnInit() {
    this.inputData = this.data

    this.title = this.inputData.title
    this.vendor = this.inputData.vendor
    this.equipment = this.inputData.equipment
    this.startDate = this.inputData.startDate
    this.endDate = this.inputData.endDate
    this.userExecutor = this.inputData.userExecutor
    this.userResponsible = this.inputData.userResponsible
    this.color = this.inputData.color
  }

  closePopup() {
    this.ref.close();
  }
}
