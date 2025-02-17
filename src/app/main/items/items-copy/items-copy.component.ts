import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RequestService } from 'src/app/services/request.service';
import { Router } from '@angular/router';
import { ValidatorService } from 'src/app/services/validator.service';

export interface ItemCopy {
  id?: number
  title?: string
  description?: string
  fillable?: boolean
  mandatory?: boolean
  version_id?: number
  is_subitem?: boolean
  father_id?: number
}

export interface fieldCopy {
  title_field?: string
  standard_value?: string
  item_id?: number
  type_field_id?: number
  feature_id?: number
  order_field?: number
}

@Component({
  selector: 'app-items-copy',
  templateUrl: './items-copy.component.html',
  styleUrls: ['./items-copy.component.css']
})

//Tela de lista de itens para copiar
//paths: models/select/modelId/copy
export class ItemsCopyComponent implements AfterViewInit {

  //Fonte de dados da tabela
  displayedColumns: string[] = ['select', 'title', 'id', 'father_id'];
  itemDataSource = new MatTableDataSource<ItemCopy>([])

  //objeto que permite selecionar linhas da tabela e salvar os objetos em uma array
  selection = new SelectionModel<ItemCopy>(true, []);

  url: string = window.location.href
  urlPaths = this.url.split('/')
  modelDestID = this.urlPaths[5]
  modelID = this.urlPaths[7]
  itemsIDs: Number[] = []

  constructor(
    private requestService: RequestService,
    private router: Router,
    private validator: ValidatorService
  ) {

  }

  async ngAfterViewInit() {
    let ret: any
    ret = await this.requestService.getRequest('model/content', this.modelID)
    this.itemDataSource.data = ret.data.itemsInVersion
  }

  async request() {
    let ret: any
    let itemsList = this.selection.selected

    //É feito um laço para criar uma cópia de cada item selecionado, e dentro de cada item copiar cada campo correspondente
    for (let i = 0; i < itemsList.length; i++) {
      this.itemsIDs.push(itemsList[i].id!)
    }

    let copyData = {
      'modelDest': Number(this.modelDestID),
      'items': this.itemsIDs
    }

    ret = await this.requestService.postRequest('copyItem', copyData)
    //console.log(ret.data.itens)

    if (ret.status == 200 || ret.status == 201) {
      this.goBack()
    }
    if (ret.status == 206) {
      this.validator.openSnackBar(ret.message);
      this.goBack()
      
    }
  }

  goBack() {
    this.router.navigate([`models/${this.modelDestID}`])
  }

  //Retorna se o número de elementos selecionados corresponde ao total de linhas da tabela
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.itemDataSource.data.length;
    return numSelected === numRows;
  }

  //Seleciona todas as linhas se não foram todas selecionadas; senão limpa a seleção
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.itemDataSource.data);
  }
}
