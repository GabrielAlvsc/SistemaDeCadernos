import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParamService } from 'src/app/services/params.service';
import { RequestService } from 'src/app/services/request.service';
import { ValidatorService } from 'src/app/services/validator.service';

export interface StatusLog {
  id: number
  idBook: number
  comment: string
  status: string
  createdAt: string
  updatedAt: string
  user: any
}

export interface cardInfo {
  color: string
  statusAndDate: string
  userLog: string
  comment: string
}

@Component({
  selector: 'app-notebook-revoke-assignment',
  templateUrl: './notebook-revoke-assignment.component.html',
  styleUrls: ['./notebook-revoke-assignment.component.css']
})

export class NotebookRevokeAssignmentComponent {

  constructor(
    private router: Router,
    private requestService: RequestService,
    private paramService: ParamService,
    private validator: ValidatorService,
    private datePipe: DatePipe
    ){}

  card: cardInfo[] = []

  approve_btn: string = 'var(--green)'
  suspend_btn: string = 'var(--orange)'
  revoke_btn: string = 'var(--red)'
  canceled_btn: string = 'var(--dark-gray)'
  edit_btn: string = 'var(--purple)' //Descomentar quando forem testar alteração de status

  url: string = window.location.href
  params = this.url.split('/')

  logs: StatusLog[] = []

  equipment: string = ''
  book: any
  model: string = ''
  status: string = ''
  version: string = ''
  usernameExec: string = ''
  usernameResp: string = ''
  currentStatus: string = ''

  async ngAfterViewInit() {
    let ret: any
    let statusAndDate: string = ''
    let userLog: string = ''
    let comment: string = ''
    let color: string = ''
    let date: any

    ret = await this.requestService.getRequest('book',this.params[5])
    this.book = ret.data
    
    this.version = this.book.version.version

    this.usernameExec = this.book.userExecutor.username

    this.usernameResp = this.book.userResponsible.username
    
    this.model = this.book.version.model.title

    this.equipment = this.book.equipament.name

    ret = await this.requestService.getRequest('statusBook',this.params[5])
    this.logs = ret.data

    this.currentStatus = this.logs[0].status

    for (let index = 0; index < this.logs.length; index++) {
      const element = this.logs[index];

      if(element.status == 'Aprovado'){
        color = this.approve_btn
      } else if (element.status == 'Revogado') {
        color = this.revoke_btn
      } else if (element.status == 'Suspenso'){
        color = this.suspend_btn
      } else if (element.status == 'Pendente'){
          color = this.edit_btn
      } else {
        color = this.canceled_btn
      }
      
      

      date = new Date(element.updatedAt)
      let formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm')
      let statusTitle = element.status

      if (statusTitle == 'Pendente'){
        statusTitle = 'Movido para Edição'
      }

      statusAndDate = `${element.status} - ${formattedDate}`
      statusAndDate = `${statusTitle} - ${formattedDate}`

      comment = element.comment

      userLog = element.user.name

      ret = {
        'statusAndDate': statusAndDate, 
        'color': color,
        'comment': comment,
        'userLog': userLog
      }

      this.card.push(ret)
    }
    this.status = this.logs[0].status
  }

  async openDialog(status: string){
    this.paramService.statusLog = status
    this.validator.dialogSwithStatus("0ms", "0ms")
  }

  goBack(){
    this.router.navigate(['revokebooks']);
  }
}
