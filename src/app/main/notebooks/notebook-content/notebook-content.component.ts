import { ValidatorService } from 'src/app/services/validator.service';
import { Router } from '@angular/router';
import { Features, Items, Response_Features, Response_Items } from 'src/app/app-objects';
import { RequestService } from './../../../services/request.service';
import { Component, OnInit } from '@angular/core';
import { ParamService } from 'src/app/services/params.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-notebook-content',
  templateUrl: './notebook-content.component.html',
  styleUrls: ['./notebook-content.component.css']
})

export class NotebookContentComponent {

  constructor(
    private request: RequestService,
    private router: Router,
    private validator: ValidatorService,
    private sparams: ParamService,
    public shareService: ShareService
  ) { }

  //DataSources
  features: Features[] = []
  FeatureSourceData: any

  items: Items[] = []
  ItemSourceData: any

  featuresData: any = []
  itemsData: any = []

  responseFeatures: any = []
  responseItems: any = []

  //Tabelas
  featuresColumns: string[] = ['name', 'response', 'status', 'button'];
  itemsColumns: string[] = ['title', 'mandatory', 'status', 'button'];

  //Parametros da URL
  url: string = window.location.href
  params = this.url.split('/')
  route = this.params[4]
  idBook = this.params[5]
  idModel = this.params[7]
  idVersion = this.params[9]
  //model/:idmodel/version/:idversion
  ulrFill = 'model/' + this.idModel + '/version/' + this.idVersion

  //Labels
  title: string = ''
  model: string = ''
  segment: string = ''
  version: string = ''
  usernameExec: string = ''
  usernameResp: string = ''
  equipment: string = ''
  filterButtonName: string = ''

  //Variaveis de Controle
  revision: boolean = false
  canFinishBook!: boolean
  viewScreen = false
  filtered: boolean = false
  showFilterButton: boolean = false

  async ngOnInit() {
    let response: any

    this.revision = this.params[4] == 'myreviews'
    this.viewScreen = this.params[4] == 'notebooks'

    if(this.viewScreen) {
      this.title = 'Todos os Cadernos'
    } else {
      if (this.revision) {
        this.title = 'Minhas Revisões'
        this.filterButtonName = 'Exibir apenas "Em Revisão"'
      } else {
        this.title = 'Meus Cadernos'
        this.filterButtonName = 'Exibir apenas "Salvos" e "Aguardando Revisão"'
      }
    }

    //Necessário para ter acesso aos campos Approval e In_Review do respose features
    response = await this.request.getRequest('book', this.params[5])
    const bookContent = response.data

    this.canFinishBook = bookContent.canFinish

    this.model = bookContent.version.model.title

    this.segment = bookContent.version.model.category.name

    this.equipment = bookContent.equipament.name

    this.features = bookContent.features

    this.items = bookContent.itens
    this.version = bookContent.version.version

    for(let feature of this.features) {
      this.responseFeatures.push(feature.response_feature)
    }

    for(let item of this.items) {
      this.responseItems.push(item.response_item)
    }

    this.usernameExec = bookContent.userExecutor.name
    this.usernameResp = bookContent.userResponsible.name

    for(let i = 0; i < this.items.length; i ++) {
      this.items[i].status = this.responseItems[i].status
    }

    for (let i = 0; i < this.features.length; i ++) {
      if(this.features[i].is_variable) {
        for(let item of this.items) {
          let field = item.fields.find((field: any) => field.feature_id === this.features[i].id)
  
          if(field) {
            this.features[i].status = item.status
          }
        }
      } else {
        this.features[i].status = this.responseFeatures[i].status
      }
    }

    this.ItemSourceData = this.items
    this.FeatureSourceData = this.features

    if (this.route == 'mybooks' || this.route == 'myreviews') {
      this.showFilterButton = true
      this.filterDatasource()
    }
  }

  navigate(op: string, id: number) {
    this.router.navigate([this.params[4] + '/' + this.params[5] + '/' + op + '/' + id])
  }

  goBack() {
    this.router.navigate([this.params[4]])
  }

  async changeStatus(text: string = '') {
    this.sparams.statusLog = text
    this.validator.dialogSwithStatus("0ms", "0ms")
  }

  filterDatasource(filtered: boolean = false){
    let newItemDatasort: any
    let newFeaturesDatasort: any
    if(filtered){
      newItemDatasort = this.ItemSourceData 
      newFeaturesDatasort = this.FeatureSourceData
    } else {
      switch(this.route){
        case 'mybooks':{
          newItemDatasort = this.items.filter(item => (item.status == 'Aguardando envio para revisão' || item.status == 'Salvo'))
          newFeaturesDatasort = this.features.filter(feature => (feature.status == 'Aguardando envio para revisão' || feature.status == 'Salvo'))
          break
        }
        case 'myreviews':{
          newItemDatasort = this.items.filter(item => (item.status == 'Em Revisão'))
          newItemDatasort = this.items.filter(item => (item.status == 'Em Revisão' || item.status == 'Salvo')) //Descomentar quando forem usar alteraão de status novamente
          newFeaturesDatasort = this.features.filter(feature => (feature.status == 'Em Revisão'))
          break
        }
      }
    }
    this.items = newItemDatasort
    this.features = newFeaturesDatasort
    this.filtered = !this.filtered
  }
  
}
