import { ParamService } from './../../../services/params.service';
import { DateAdapter } from '@angular/material/core';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RequestService } from 'src/app/services/request.service';
import { Router } from '@angular/router';
import { parse } from 'date-fns';
import { ShareService } from 'src/app/services/share.service';

export interface RevokeNotebook {
  id: number
  category: string
  model: string
  modelId: number
  equipment: string
  version: number
  versionId: number
  status: string
  alterDate: string
}

@Component({
  selector: 'app-notebook-revoke',
  templateUrl: './notebook-revoke.component.html',
  styleUrls: ['./notebook-revoke.component.css']
})

export class NotebookRevokeComponent {
  @ViewChild('paginatorApproval') paginatorApproval!: MatPaginator;
  @ViewChild('paginatorRevoke') paginatorRevoke!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private paramService: ParamService,
    public shareService: ShareService,
  ){}

  //Tabelas
  revokedDataSource = new MatTableDataSource<RevokeNotebook>([])
  approvedDataSource = new MatTableDataSource<RevokeNotebook>([])
  displayedColumns = ['category','model', 'equipment', 'version', 'status', 'alterDate', 'button']
  approvedColumns = ['category','model', 'equipment', 'version', 'alterDate', 'button']
  
  //Variavies Utilizadas para formatar o Json do banco
  id: number = 0
  version: number = 0
  versionId: number = 0
  equipment: string = ''
  model: string = ''
  modelId: number = 0

  //DataSources
  originalApprovedData: RevokeNotebook[] = []
  originalRevokedData: RevokeNotebook[] = []
  dataBooks: any

  async ngOnInit(){
    let ret: any

    ret = await this.requestService.getRequest('booksReviseds');
    this.dataBooks = ret.data

    this.loadData(this.dataBooks['Aprovados'],'Approved')
    this.loadData(this.dataBooks['Suspensos ou revogados'],'')
  }

  loadData(datasource: any, table: string){
    let aux: any
    let data: RevokeNotebook[] = []
    let date: string = ''
    let record: any

    for (let index = 0; index < datasource.length; index++) {
      const element = datasource[index]

      this.version = element.version.version
      this.versionId = element.version.id
      this.model = element.version.model.title
      this.modelId = element.version.model.id
      this.equipment = element.equipament.name

      date = element.end_date
      date = date.substring(0, 10)

      aux = date.split('-')
      date = aux[2] + '/' + aux[1] + '/' + aux[0]

      record = {
        "id": element.id,
        "category": element.version.model.category.name,
        "model": this.model,
        "modelId": this.modelId,
        "equipment": this.equipment,
        "version": this.version,
        "versionId": this.versionId,
        "status": element.status,
        "alterDate": date
      }
      data.push(record)
    }

    if(table == 'Approved'){
      this.approvedDataSource.paginator = this.paginatorApproval;
      this.approvedDataSource.data = data;
      this.originalApprovedData = this.approvedDataSource.data.slice()
    } else {

      this.revokedDataSource.paginator = this.paginatorRevoke;
      this.revokedDataSource.data = data;
      this.originalRevokedData = this.revokedDataSource.data.slice()
    }

  }

  navigate(id: number) {
    this.router.navigate(['revokebooks/' + String(id)]);
  }
}
