import { Router } from '@angular/router';
import { RequestService } from '../../../services/request.service';
import { Component, OnInit } from '@angular/core';
import { ParamService } from 'src/app/services/params.service';

export interface Version {
  comment: string
}

export interface Correction {
  revision: string
  adjusted: boolean
}

@Component({
  selector: 'app-change-status-dialog',
  templateUrl: './change-status-dialog.component.html',
  styleUrls: ['./change-status-dialog.component.css']
})

// Pop-up para realizar a alteração do status de um caderno com comentário
export class StatusSwithDialogComponent {

  constructor(
    private requestService: RequestService,
    private router: Router,
    private paramService: ParamService
  ) {

  }

  url: string = window.location.href
  //fixed 
  urlPaths = this.url.split('/')

  title = ''
  content = ''
  comment = ''
  status = this.paramService.statusLog

  version: Version = {
    comment: this.comment
  }

  correction: Correction = {
    revision: '',
    adjusted: false
  }

  modelVersion: any

  ngOnInit(): void {
    //Altera o status de acordo com a ação desejada para o caderno
    let status: string
    status = ''
    switch (this.status) {
      case 'Aprovado':
        status = 'Aprovar'
        break
      case 'Reprovado':
        status = 'Reprovar'
        break
      case 'Cancelado':
        status = 'Cancelar'
        break
        case 'Pendente':
        status = 'Editar'
        break
      }
      //commented to update the validated features

    this.title = `${status} Caderno`
    this.content = `Deseja ${status} o caderno?`
  }

  async finishConfirm() {
    let ret: any
    let path = this.router.url.split('/')
    
    let record = {
      'status': this.status,
      'comment': this.comment
    }

    ret = await this.requestService.postRequest(('statusBook/' + this.urlPaths[5]), record)
    //Altera o status do caderno //Descomentar quando forem testar alteração de status novamente
    if (this.status === 'Pendente') {
      ret = await this.requestService.putRequest(`/books/${this.urlPaths[5]}/status`,'')
      if (ret.status == 200 || ret.status == 201) {
        ret = await this.requestService.postRequest(('statusBook/' + this.urlPaths[5]), record)
      }
    } else {
      ret = await this.requestService.postRequest(('statusBook/' + this.urlPaths[5]), record)
    }
    
    if (ret.status == 200 || ret.status == 201) {
        this.goBack(path[1])
    }
  }

  goBack(path: string) {
    this.router.navigate([path])
  }
}