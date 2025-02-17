import { ParamService } from 'src/app/services/params.service';
import { Items, Features, Fields, Response_Features, Response_Fields, Response_Items, Correction_Item } from './../../../app-objects';
import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { ShareService } from 'src/app/services/share.service';

export interface Options {
  color: string
  ajusted: boolean
}

@Component({
  selector: 'app-notebook-fill',
  templateUrl: './notebook-fill.component.html',
  styleUrls: ['./notebook-fill.component.css']
})

export class NotebookFillComponent implements OnDestroy {
  constructor(
    private requestService: RequestService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private sparams: ParamService,
    private validator: ValidatorService,
    public shareService: ShareService,
  ) { }

  //Labels
  title = ''
  modelName = ''
  resourceName = ''
  description = ''
  response = ''
  comment = ''
  idObj = ''

  //Cores dos botões da tela
  confirm_btn_color: string = 'var(--gray)'
  revision_btn_color: string = 'var(--gray)'

  approve_btn_color: string = 'var(--gray)'
  reprove_btn_color: string = 'var(--gray)'
  sendback_btn_color: string = 'var(--gray)'

  //Todos os Modelos de Tabelas
  features: Features[] = []
  items: Items[] = []
  fields: Fields[] = []
  response_Features: Response_Features[] = []
  response_Items: Response_Items[] = []
  response_Fields: Response_Fields[] = []
  corrections: Correction_Item[] = []

  TypeImageFields: any = []

  //Referente a cor e estado das correções
  displayStyle: Options[] = []

  //Parametros da página
  url: string = window.location.href
  params = this.url.split('/')
  objId = this.params[7]
  bookId = this.params[5]

  //Variaveis de controle
  Bookstatus: string = ''
  mandatory: boolean = false
  revisionMode: boolean = (this.params[4] == 'myreviews')
  viewScreen = (this.params[4] == 'notebooks')
  show_corretion: boolean = false
  disabled: boolean = false
  is_variable: boolean = false
  pending_adjustments: number = 0
  // -> Podendo ser Item ou Features
  targetObject: string = this.params[6]

  trustedDescription!: SafeHtml

  formData = new FormData()

  async ngOnInit() {
    let ret: any

    if(this.viewScreen) {
      this.title = 'Todos os Cadernos'
    } else {
      if (this.revisionMode) {
        this.title = 'Minhas Revisões'
      } else {
        this.title = 'Meus Cadernos'
      }
    }

    ret = await this.requestService.getRequest('book/' + this.bookId + '/' + this.targetObject + '/' + this.objId)

    //Colocando o Modelo no titulo
    this.modelName = ret.data.book.version.model.title

    switch (this.targetObject) {
      case 'features':
        this.features = ret.data.feature
        this.response_Features = ret.data.feature.response_feature
        await this.loadFeatures();
        break
      case 'item':
        this.items = ret.data.item
        this.response_Items = ret.data.item.response_item
        await this.loadItems();
        break
    }

    this.setCorrections()
    this.setDisabled()
    this.setBtnColors()
  }

  async loadItems() {
    let responseInRequest: any
    let index: number = 0

    responseInRequest = this.response_Items

    this.idObj = responseInRequest.id
    this.comment = responseInRequest.comment
    this.Bookstatus = responseInRequest.status
    this.corrections = responseInRequest.correction_items

    //Termina de buscar as informações referente ao Item
    responseInRequest = this.items
    this.resourceName = responseInRequest.title

    this.mandatory = responseInRequest.mandatory
    this.description = responseInRequest.description
    this.trustedDescription = this.sanitizer.bypassSecurityTrustHtml(this.description)
    this.fields = responseInRequest.fields

    for(let field of this.fields) {
      this.response_Fields.push(field.response_field)
    }

    for (let i = 0; i < this.response_Fields.length; i++) {

      switch(this.fields[i].type_field_id) {

        //Field do tipo Imagem
        case 3:
          this.TypeImageFields.push(this.fields[i])
          this.TypeImageFields[index].response_id = this.response_Fields[i].id
          this.TypeImageFields[index].images = this.response_Fields[i].images
          index += 1
          break
      }
    }
  }

  async onFileSelected(event: any, responseFieldId: number, index: number) {
    const files = event.target.files

    let formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i])
    }

    await this.requestService.postRequest('uploadResponseField/' + responseFieldId, formData)
  }

  async loadFeatures() {
    let responseInRequest: any
    responseInRequest = this.response_Features

    this.idObj = String(responseInRequest.id)
    this.is_variable = responseInRequest.is_variable

    this.response = responseInRequest.response
    this.Bookstatus = responseInRequest.status
    this.corrections = responseInRequest.correction_features

    responseInRequest = this.features
    this.resourceName = responseInRequest.name
  }

  setCorrections() {
    //Verifica se existe alguma correção pra exibir na tela
    if (this.corrections.length != 0) {
      this.show_corretion = true
      this.pending_adjustments = this.corrections.length

      //Varre as correções -> monta um objeto com elas, definindo a cor e status do ajuste
      //onde caso o status seja "ajusted"(true) essa correção não será exibida(myBooks)
      for (let index = 0; index < this.corrections.length; index++) {
        if (this.corrections[index].ajusted) {
          this.pending_adjustments = this.pending_adjustments - 1
        }

        this.displayStyle.push({ color: 'var(--gray)', ajusted: this.corrections[index].ajusted })
      }
    }
  }

  //Define a variável que desabilita ou reabilita os campos de acordo com os valores de in_review e approval
  setDisabled() {

    if (this.is_variable) {
      this.comment = 'Característica preenchivel durante os testes.'
    }

    let disabled: boolean

    if(this.viewScreen) {
      disabled = true
    } else {
      if (this.Bookstatus == 'Aguardando envio para revisão' || this.Bookstatus == 'Salvo') {
        disabled = false
      } else {

        disabled = true
      }
      
      if(this.revisionMode) {
        // Casos em que o caderno está aprovado ou reprovado
        if(this.Bookstatus == 'Reprovado' || this.Bookstatus == 'Aprovado') {
          disabled = true
        } else {
          disabled = !disabled
        }
      }
    }

    this.disabled = disabled
    this.sparams.setDisable(this.disabled) 
  }

  async patchSelector(status: string) {
    let ret: any
    let json: any

    switch (this.targetObject) {
      case 'features':
        json = { 'response': this.response, 'status': status }

        ret = await this.requestService.patchRequest('responseFeature', String(this.idObj), json)
        if (ret.status == 200 || ret.status == 201) {
          this.goBack()
        }
        break;
      case 'item':
        for (let index = 0; index < this.response_Fields.length; index++) {
          json = { 'response': this.response_Fields[index].response }
          ret = await this.requestService.patchRequest('responseField', String(this.response_Fields[index].id), json)
        }

        json = { 'comment': this.comment, 'status': status }
        ret = await this.requestService.patchRequest('revisionResponseItem', this.idObj, json)

        if (ret.status == 200 || ret.status == 201) {
          this.goBack()
        }
        break;
    }
  }

  openDialog() {
    this.sparams.idObj = this.idObj
    this.validator.dialogFinish("0ms", "0ms")
  }

  AjustedChange(index: number, value: boolean) {
    this.corrections[index].ajusted = value
  }

  setBtnColors() {
    if (!this.disabled) {
      this.confirm_btn_color = "var(--green)"
      this.revision_btn_color = "var(--blue)"
      this.sendback_btn_color = "var(--blue)"

      if (this.pending_adjustments == 0) {
        this.approve_btn_color = "var(--green)"
        this.reprove_btn_color = "var(--red)"
      }
    }
  }

  async correctionPatch(id: number, index: number) {
    let ret: any

    switch (this.targetObject) {
      case 'features':
        ret = await this.requestService.patchRequest('correctionFeatures', String(id), { 'ajusted': true })
        break;
      case 'item':
        ret = await this.requestService.patchRequest('correctionItem', String(id), { 'ajusted': true })
        break;
    }

    if (ret.status == 200 || ret.status == 201) {
      this.displayStyle[index].ajusted = true
      this.pending_adjustments = this.pending_adjustments - 1
      this.displayStyle[index].color = this.confirm_btn_color
      this.setBtnColors()
    }
  }

  openAlert(dataSource: any) {
    this.validator.dialogAlert("0ms", "0ms", dataSource)
  }

  ngOnDestroy(): void {
    this.sparams.concluded = false
  }

  fieldChange(index: number, value: string) {
    this.response_Fields[index].response = value
  }

  goBack() {
    this.router.navigate([this.params[4] + '/' + this.bookId])
  }
}
