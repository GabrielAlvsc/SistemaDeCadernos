import { Router } from '@angular/router';
import { RequestService } from './../../../services/request.service';
import { Component, OnInit } from '@angular/core';
import { ParamService } from 'src/app/services/params.service';
import { ValidatorService } from 'src/app/services/validator.service';

export interface Version {
  comment: string
}

export interface Correction {
  revision: string
  adjusted: boolean
}

@Component({
  selector: 'app-finish-dialog',
  templateUrl: './finish-dialog.component.html',
  styleUrls: ['./finish-dialog.component.css']
})

//Pop-up de confirmação e inserção de comentário
export class FinishDialogComponent implements OnInit {

  constructor(
    private requestService: RequestService,
    private router: Router,
    private params: ParamService,
    private validator: ValidatorService
  ) { }

  url: string = window.location.href
  urlPaths = this.url.split('/')

  title = ''
  content = ''
  comment = ''
  status = this.params.statusLog

  correction: Correction = {
    revision: '',
    adjusted: false
  }

  modelVersion: any

  async ngOnInit() {
    //Altera as informações do pop-up de acordo com a tela 
    switch (this.urlPaths[4]) {
      case 'models':
        this.title = 'Finalizar Modelo'
        this.content = 'Deseja finalizar o modelo?'
        //Insere o comentário automático com menção às alterações que foram feitas
        this.modelVersion = this.params.currentVersion
        const response = await this.requestService.getRequest('generateComment', this.modelVersion)
        this.comment = response.data.comment
        break
      case 'myreviews':
        this.title = 'Devolver Caderno para Correção'
        this.content = 'Deseja devolver o caderno?'
        break
    }
  }

  async finishConfirm() {
    let response: any
    //Faz a requisição de acordo com a tela em que o pop-up é acionado
    switch (this.urlPaths[4]) {
      case 'models':
        let version: Version = {
          comment: this.comment
        }
        //Finaliza a versão de um modelo de caderno
        response = await this.requestService.postRequest(`closeVersion/${this.modelVersion}`, version)
        if (response.status == 200 || response.status == 201) {
          this.goBack('/models')
          this.validator.openSnackBarPositive("Versão finalizada!")
        }
        break
      case 'myreviews':
        this.correction.revision = this.comment
        let requestBody: any
        let path: any

        //Salva a correção a ser feita com uma observação

        switch (this.urlPaths[6]) {
          case 'features':
            response = await this.requestService.postRequest(`correctionFeatures/${this.params.idObj}`, this.correction)
            path = 'responseFeature'
            break

          case 'item':
            response = await this.requestService.postRequest(`correctionItem/${this.params.idObj}`, this.correction)
            path = 'revisionResponseItem' 
            break 
        }

        if (response.status == 200 || response.status == 201) {
          requestBody = { status: 'Aguardando envio para revisão' }
          response = await this.requestService.patchRequest(path, this.params.idObj, requestBody)

          if (response.status == 200 || response.status == 201) {
            //Retorna à página anterior
            history.back()
          }
        }
        
        break
    }
  }

  goBack(path: string) {
    this.router.navigate([path])
  }
}
