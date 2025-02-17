import { Router } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RequestService } from 'src/app/services/request.service';
import { ParamService } from 'src/app/services/params.service';
import { ShareService } from 'src/app/services/share.service';

export interface Model {
  title: string;
  category: string;
  version: number
}

@Component({
  selector: 'app-model-selects',
  templateUrl: './model-select.component.html',
  styleUrls: ['./model-select.component.css']
})

//Tela de listagem de modelos de caderno para copiar item
//path: models/select
export class ModelSelectComponent implements AfterViewInit {

  //Fonte de dados da tabela
  displayedColumns: string[] = ['title', 'category', 'version'];
  dataSource = new MatTableDataSource<Model>([])

  response: any
  categories: any
  lastVersion: number = 0

  url: string = window.location.href
  urlPaths = this.url.split('/')
  modelID = this.urlPaths[5]

  //Obtém a diretiva MatPaginator do template para habilitar a paginação da tabela
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Obtém a diretiva MatSort do template para habilitar a ordenação das colunas da tabela
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private paramService: ParamService,
    public shareService: ShareService
  ) {}

  async ngAfterViewInit() {

    this.response = await this.requestService.getRequest('models');

    //Organiza as informações para povoar a tabela
    if (this.response.status == 200) {
      this.dataSource.data = this.response.data

      for (let i = 0; i < this.dataSource.data.length; i++) {
        this.lastVersion = 0

        this.dataSource.data[i].version = this.response.data[i].versions[this.lastVersion].version

        this.dataSource.data[i].category = this.response.data[i].category.name
      }
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  goto_create() {
    this.router.navigate(['models/create']);
  }

  navigate(id: number) {
    this.router.navigate([`models/${this.modelID}/select/${id}/copy`])
  }

  goBack() {
    this.router.navigate([`models/${this.modelID}`])
  }
}
