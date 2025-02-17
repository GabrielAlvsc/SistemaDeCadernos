import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RequestService } from 'src/app/services/request.service';
import { ParamService } from 'src/app/services/params.service';
import { ShareService } from 'src/app/services/share.service';

export interface bookModel {
  title: string
  category: string
  version: number
  id: number
  status: string
  version_id: number
  model_id: number
}

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})

//Tela de listagem de modelos de caderno
//path: models
export class ModelListComponent implements AfterViewInit {

  //Fonte de dados da tabela
  displayedColumns: string[] = ['title', 'category', 'version', 'status', 'button'];
  dataSource = new MatTableDataSource<bookModel>([])

  response: any
  categories: any
  lastVersion: number = 0

  url: string = window.location.href
  params = this.url.split('/')
  route = this.params[4]

  //Obtém a diretiva MatPaginator do template para habilitar a paginação da tabela
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Obtém a diretiva MatSort do template para habilitar a ordenação das colunas da tabela
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private requestService: RequestService,
    private router: Router,
    public shareService: ShareService
  ) {
  }

  async ngAfterViewInit() {
    this.response = await this.requestService.getRequest('models');

    //Organiza as informações para povoar a tabela
    if (this.response.status == 200) {
      this.dataSource.data = this.response.data

      for (let i = 0; i < this.dataSource.data.length; i++) {
        this.lastVersion = 0

        this.dataSource.data[i].version = this.response.data[i].versions[this.lastVersion].version

        if (this.response.data[i].versions[this.lastVersion].concluded) {
            this.dataSource.data[i].status = "Finalizado"
        } else {
            this.dataSource.data[i].status = "Em edição"
        }

        this.dataSource.data[i].version_id = this.response.data[i].versions[this.lastVersion].id
        this.dataSource.data[i].model_id = this.response.data[i].versions[this.lastVersion].model_id
        this.dataSource.data[i].category = this.response.data[i].category.name
      }

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      const filterValue = sessionStorage.getItem('filter');
      const filterRoute = sessionStorage.getItem('route');
      const scrollValue = sessionStorage.getItem('scroll');
  
      const storedPageIndex = sessionStorage.getItem('pageIndex');
      const storedPageSize = sessionStorage.getItem('pageSize');
  
      const pageIndex = storedPageIndex ? parseInt(storedPageIndex, 10) : 0;
      const pageSize = storedPageSize ? parseInt(storedPageSize, 10) : 5;
  
      if(this.route == filterRoute){
        if (filterValue) {
          this.inputElement.nativeElement.value = filterValue;
          this.shareService.applyFilterbyString(filterValue, this.dataSource);
        }
  
        if(scrollValue != null){
          this.scrollContainer.nativeElement.scrollTop = Number(scrollValue)
        }
  
        if(pageIndex != null && pageSize != null){
          this.dataSource.paginator.pageIndex = Number(pageIndex)
          this.dataSource.paginator.pageSize = Number(pageSize)
        }
  
        this.paginator._changePageSize(pageSize);
      } else {
        sessionStorage.clear()
      }
  
      this.paginator.page.subscribe(event => {
        sessionStorage.setItem('pageIndex', event.pageIndex.toString());
        sessionStorage.setItem('pageSize', event.pageSize.toString());
      });
    }
  }

  onScroll() {
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    sessionStorage.setItem('scroll', scrollTop.toString());
  }

  goto_create() {
    this.router.navigate(['models/create']);
  }

  navigate(id: number) {
    this.router.navigate([`models/${id}`])
  }

  //Gera o PDF do modelo de caderno
  async createPDF(model_id: number, version_id: number) {
    this.shareService.createPDF(
      null, model_id, version_id
    )
  }
}
