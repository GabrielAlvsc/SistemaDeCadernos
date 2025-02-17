import { RequestService } from './../../../services/request.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ParamService } from 'src/app/services/params.service';
import { parse } from 'date-fns';
import { ShareService } from 'src/app/services/share.service';

export interface Notebook {
  id: number
  id_model: number
  model: string
  equipment: string
  respUser: string
  execUser: string
  startDate: string
  endDate: string
  status: string
}

@Component({
  selector: 'app-notebook-list',
  templateUrl: './notebook-list.component.html',
  styleUrls: ['./notebook-list.component.css']
})

export class NotebookListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') inputElement!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  displayedColumns: string[] = []
  dataSource = new MatTableDataSource<Notebook>([])
  clickedRows = new Set<Notebook>();

  url: string = window.location.href
  params = this.url.split('/')
  route = this.params[4]

  dataUser: any
  dataEquipments: any
  dataModel: any
  dataBooksFiltered: any
  dataBooks: any
  dataVersion: any

  filtered: boolean = false
  filterButtonName: string = ''

  teste = false

  data: Notebook[] = []
  json = []

  title = ''

  iconButton = "edit"

  originalData: Notebook[] = []

  constructor(
    private requestService: RequestService,
    private router: Router,
    private paramService: ParamService,
    public shareService: ShareService
  ) {
  }

  async ngAfterViewInit() {
    let ret: any
    let equipment: string
    let obj: any

    if (this.params[4] == 'notebooks') {
      ret = await this.requestService.getRequest('books');
      this.title = 'Todos os Cadernos'
      this.displayedColumns = ['category', 'model', 'equipment', 'respUser', 'execUser', 'startDate', 'endDate', 'status', 'button'];
    } else {
      
      this.displayedColumns = ['model', 'equipment', 'startDate', 'endDate', 'status', 'button'];
      if (this.params[4] == 'mybooks') {
        ret = await this.requestService.getRequest(this.params[4]);
        this.title = 'Meus Cadernos'
      } 
      else if(this.params[4] == 'books-in-execution'){
        ret = await this.requestService.getRequest('booksInExecution');
        this.title = 'Cadernos Agendados'
        this.displayedColumns = ['category', 'model', 'equipment', 'respUser', 'execUser', 'startDate', 'endDate', 'status', 'button'];
      }
      else {
        ret = await this.requestService.getRequest(this.params[4]);
        this.title = 'Minhas Revisões'
      }
    }
    this.dataBooks = ret.data

    if (this.dataBooks.length != 0) {
      for (let index = 0; index < this.dataBooks.length; index++) {

        if (this.dataBooks[index].equipament.name == undefined) {
          equipment = 'Equipamento não encontrado'
        } else {
          equipment = this.dataBooks[index].equipament.name
        }

        obj = {
          "id": this.dataBooks[index].id,
          "id_model": this.dataBooks[index].version.model_id,
          "id_version": this.dataBooks[index].version_id,
          "version": this.dataBooks[index],
          "model": this.dataBooks[index].version.model.title,
          "category": this.dataBooks[index].version.model.category.name,
          "equipment": equipment,
          "respUser": this.dataBooks[index].user_responsible.name,
          "execUser": this.dataBooks[index].user_executor.name,
          "startDate": this.dataBooks[index].start_date,
          "endDate": this.dataBooks[index].end_date,
          "status": this.dataBooks[index].status
        }
        this.data.push(obj)
      }

      this.dataSource.data = this.data
      this.dataSource.paginator = this.paginator;
      this.originalData = this.dataSource.data.slice()
    }

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

  onScroll() {
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    sessionStorage.setItem('scroll', scrollTop.toString());
  }

  goto_create() {
    this.router.navigate([`${this.params[4]}/assign`]);
  }

  navigate(id: number) {
    switch(this.params[4]) {

      case 'books-in-execution':
        this.router.navigate([`${this.params[4]}/edit/${String(id)}`]);
        break

      case 'notebooks':
        this.router.navigate([`notebooks/${String(id)}`]);
        break

      default:
        this.router.navigate([`${this.params[4]}/${id}`])
    }
  }

  async createPDF(bookId: number, versionId: number, modelId: number) {
    let returnedObj: any
    returnedObj = await this.requestService.postRequest(
      "createPDF",
      {
        book_id: bookId,
        version_id: versionId,
        model_id: modelId
      }
    )
    window.open(`${this.paramService.SERVER_URL}pdf/${returnedObj.data.id}`)
  }

  sortData(sort: Sort) {
    const isAsc = sort.direction === 'asc'
    let dateA: Date | null = null
    let dateB: Date | null = null
    let auxiliaryData = this.originalData.slice()
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = auxiliaryData
      return
    }
    this.dataSource.data = auxiliaryData.sort((a: any, b: any) => {
      
      switch (sort.active) {
        case 'model':
          return this.compare(a.model, b.model, isAsc)
        case 'version':
          return this.compare(a.version, b.version, isAsc)
        case 'equipment':
          return this.compare(a.equipment, b.equipment, isAsc)
        case 'respUser':
          return this.compare(a.respUser, b.respUser, isAsc)
        case 'execUser':
          return this.compare(a.execUser, b.execUser, isAsc)
        case 'startDate':
          dateA = this.stringToDate(a.startDate) 
          dateB = this.stringToDate(b.startDate)
          return this.compare(dateA.getTime(), dateB.getTime(), isAsc)
        case 'endDate':
          dateA = this.stringToDate(a.endDate)
          dateB = this.stringToDate(b.endDate)
          return this.compare(dateA.getTime(), dateB.getTime(), isAsc)
        case 'status':
          return this.compare(a.status, b.status, isAsc)
        default: 
          return 0
      }
    })
  }

  stringToDate(dateString: string): Date {
    const format = 'dd/MM/yyyy'
    let formattedDate = parse(dateString, format, new Date())
    return formattedDate

  }

  compare(a: any, b: any, isAsc: boolean) {
    let result = 1
    if(a == b) {
      result = 0
    } else if(a < b) {
      result = -1
    }
    return result * (isAsc ? 1 : -1)
  }
}
