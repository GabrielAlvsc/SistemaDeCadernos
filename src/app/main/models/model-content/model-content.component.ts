import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { Features, Items } from 'src/app/app-objects';
import { ParamService } from 'src/app/services/params.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ValidatorService } from 'src/app/services/validator.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-model-content',
  templateUrl: './model-content.component.html',
  styleUrls: ['./model-content.component.css']
})

//LabNodeSRV@lG4r backend
//Tela de conteúdo do modelo de caderno
//path: models/modelId
export class ModelContentComponent implements OnInit {
  
  //Obtém a diretiva MatSort do template para habilitar a ordenação das colunas da tabela
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private paramService: ParamService,
    private validator: ValidatorService,
    private shareService: ShareService
  ) { }

  //Labels que variam de acordo com o id do modelo 
  model = ''
  category = ''
  version = ''
  versionDesc = ''
  button = ''
  model_id = ''
  concluded: any

  url: string = window.location.href
  urlPaths = this.url.split('/')

  //fixed
  idModel = this.urlPaths[5]
  scrollPosition = 0

  //Base de dados para povoar as tabelas
  featuresData: Features[] = []
  itemsData: Items[] = []
  categories: any

  //Colunas da tabela
  featuresColumns: string[] = ['features.name', 'features.is_variable', 'button'];
  itemsColumns: string[] = ['items.title', 'items.fillable', 'button'];

  //Fonte de dados das tabelas
  itemDataSource = new MatTableDataSource<Items>([])
  featuresDataSource = new MatTableDataSource<Features>([])

  async ngOnInit() {
    let response: any
  
    response = await this.requestService.getRequest('categories')
    this.categories = response.data

    response = await this.requestService.getRequest('model/content', this.idModel)
    const modelContent = response.data

    this.model = modelContent.model.title
    this.model_id = modelContent.model.id
    this.version = modelContent.recentVersion.id
    this.versionDesc = modelContent.recentVersion.version
    this.paramService.VersionId = modelContent.recentVersion.id
    this.concluded = modelContent.recentVersion.concluded
    this.paramService.currentVersion = this.version

    localStorage.setItem('concluded', modelContent.recentVersion.concluded)

    //Verifica que a versão atual já foi concluída
    if (modelContent.recentVersion.concluded) {
      this.button = 'Criar nova versão'
    } else {
      this.button = 'Finalizar'
    }

    this.category = this.categories[modelContent.model.category_id - 1].name

    //Separa as informações das Caracteristicas
    this.featuresData = modelContent.features
    this.featuresDataSource.data = this.featuresData;
    this.featuresDataSource.sort = this.sort;

    //Separa as informações dos Items
    this.itemsData = modelContent.itemsInVersion
    this.itemDataSource.data = this.itemsData;
    this.itemDataSource.sort = this.sort;

    this.sort.active = 'fullorder'
    this.sort.direction = 'asc'

    this.paramService.modelId = this.idModel

    const reloadFlag = sessionStorage.getItem('reloadFlag');

    //Ao criar nova versão do modelo verifica se a página já recarregou
    if (reloadFlag === 'true') {
      this.validator.openSnackBarPositive("Criada nova versão!");

      sessionStorage.removeItem('reloadFlag');
    }

    const scrollValue = sessionStorage.getItem('scroll')
    const sessionModelId = sessionStorage.getItem('model')

    if(scrollValue && sessionModelId == this.idModel){
      this.scrollContainer.nativeElement.scrollTop = Number(sessionStorage.getItem('scroll'))
    } else{
      sessionStorage.clear()
    }
  }

  //Altera a ordem das linhas da tabela
  //alterar isso pra funcionar com subitens !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  async setOrder(currentIndex: number, direction: string, table: string) {
    if(table === 'feature') {
      this.featuresDataSource.data = await this.shareService.setOrder(
        currentIndex, direction, this.featuresData, table)
    } else {
      this.itemDataSource.data = await this.shareService.setItemOrder(
        currentIndex, direction, this.itemsData, table)
        window.location.reload();
    }
  }

  goBack() {
    this.router.navigate(['models'])
  }

  goToCreate(type: string = '') {
    if (type == 'items') {
      this.router.navigate([`/models/${this.idModel}/item/create`])
    } else {
      this.router.navigate([`/models/${this.idModel}/features/create`])
    }
  }

  goToCopy() {
    this.router.navigate([`models/${this.idModel}/select`])
  }

  reloadPage() {
    sessionStorage.setItem('reloadFlag', 'true');
    window.location.reload();
  }

  //Finalizar ou criar nova versão do modelo de caderno
  async goToFinish() {
    let returnRequest: any
    let empty = {}

    if (this.concluded) {
      returnRequest = await this.requestService.postRequest(`editVersion/${this.version}`, empty)
      if (returnRequest.status == 200 || returnRequest.status == 201) {
        this.reloadPage()
      }
    } else {
      this.validator.dialogFinish("0ms", "0ms")
    }
  }

  //Gerar PDF do modelo de caderno
  createPDF() {
    this.shareService.createPDF(
      null, Number(this.model_id), Number(this.version)
    )
  }
  onScroll() {
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    sessionStorage.setItem('scroll', scrollTop.toString());
    sessionStorage.setItem('model', this.idModel)
  }

  goToEditFeatures(id: number) {
    this.router.navigate([`models/${this.idModel}/features/edit/${id}`])
  }

  goToEditItens(id: number) {
    this.router.navigate([`models/${this.idModel}/item/edit/${id}`])
  }

  goToEdit() {
    this.validator.dialogUpdatgeName('0ms','0ms', this.idModel)
  }
}
