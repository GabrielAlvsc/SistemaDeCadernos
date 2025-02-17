import { Component, ViewChild } from "@angular/core";
import { RequestService } from "src/app/services/request.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ShareService } from "src/app/services/share.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ValidatorService } from "src/app/services/validator.service";

export interface Logs {
  action: string;
  message: string;
  createdAt: string;
}

export interface Statistics {
  idmodel: number;
  model: number;
  version: number;
  user: string;
  finished: string;
}

@Component({
  selector: "app-log-management",
  templateUrl: "./log-management.component.html",
  styleUrls: ["./log-management.component.css"],
})

export class LogManagementComponent {
  constructor(
    private requestService: RequestService,
    public shareService: ShareService,
    private fb: FormBuilder,
    private router: Router,
    private validate: ValidatorService
  ) {this.setColorScheme();}

  @ViewChild("paginatorLogs") paginatorLogs!: MatPaginator;
  @ViewChild("paginatorStatistics") paginatorStatistics!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  //Tabela
  logsColumns: string[] = ["action", "message", "createdAt"];
  logsdataSource: MatTableDataSource<Logs> = new MatTableDataSource<Logs>([]);
  logsOriginalData: Logs[] = [];

  statisticsColumns: string[] = ["model", "version", "user", "finished"];
  statisticsdataSource: MatTableDataSource<Statistics> =
    new MatTableDataSource<Statistics>([]);
  statisticsOriginalData: Statistics[] = [];

  //Parametros da URL
  url: string = window.location.href;
  urlParameters = this.url.split("/");

  colorScheme: any;
  setColorScheme() {
  this.colorScheme = {
    domain: 
      [
      //Aprovado - Reprovado - Revogado - Suspenso - Pendente - Cancelado
      '#03C988', '#FF204E', '#FFB400', '#8644A2', '#2994B2','#474744'
      ]
    };
  }

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Categorias';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Total';
  animations: boolean = true;

  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = false;

  viewGrid: [number, number] = [1200, 500];

  chartData: any[] = []
  chartDataByCategory: any[] = []
  chartDataByBooks: any[] = []
  moveCounter: number = 1
  movelimit: number = 0
  chartDataByModelsAll: any[] = []
  chartDataByModelsSliced: any[] = []
  chartDataByExecution: any[] = []
  users: any[] = []

  user_id: number = 0
  minDate!: Date
  searchForm!: FormGroup
  user = new FormControl('', [])
  lastStatus: string = ''
  noData: boolean = false
  lastPassword = ''
  json: any

  createForm() {
    this.searchForm = this.fb.group({
    startDate: new FormControl('', []),
    endDate: new FormControl('', []),
    })
  }

  ngOnInit(){
    this.createForm()
  }

  async ngAfterViewInit() {

    let response: any = await this.requestService.getRequest("logs");
    this.logsOriginalData = response.data;
    this.logsdataSource.data = response.data;
    this.logsdataSource.paginator = this.paginatorLogs;
    this.logsdataSource.sort = this.sort;

    response = await this.requestService.getRequest("modelsStatistics");
    this.statisticsOriginalData = response.data;
    this.statisticsdataSource.data = response.data;
    this.statisticsdataSource.paginator = this.paginatorStatistics;
    this.statisticsdataSource.sort = this.sort;

    //Gráficos:
    response = await this.requestService.getRequest('charts/byCategory')
    this.chartData = response.data

    response = await this.requestService.getRequest('charts/byBookInExecution')
    this.chartDataByExecution = response.data

    response = await this.requestService.getRequest('charts/byModel')
    this.chartDataByModelsAll = response.data
    this.chartDataByModelsSliced = this.chartDataByModelsAll
    this.movelimit = Math.ceil((this.chartDataByModelsAll.length/10))

    response = await this.requestService.getRequest('charts/byBook')
    this.chartDataByBooks = response.data

    response = await this.requestService.getRequest('users')
    this.users = response.data
  }

  NavigateToCreateUser(){
    this.router.navigate(['createUser'])
  }

  async doBackup() {
    let response = await this.requestService.getRequest("dump");
    let content = response.headers.get('Content-Disposition')
    let params = content.split('filename=')
    
    this.download(response.data, params[1].replace(/"/g, ''), '.sql')
  }

  download(data: any, filename: string, type: string) {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  onSelect(event: any) {
    console.log(event);
  }

  async searchFunction(){
    let result: any
    let startDate = new Date(this.searchForm.get('startDate')!.value).getTime()
    let endDate = new Date(this.searchForm.get('endDate')!.value).getTime()

    this.chartDataByCategory = []

    if(startDate <= endDate){
      result = await this.requestService.getRequest(`charts/byCategory?start=${startDate}&end=${endDate}`)
    } else {
      result = await this.requestService.getRequest(`charts/byCategory?start=${startDate}`)
    }

    this.chartData = result.data
  }

  async MoveDataByModels(direction: string){
    switch (direction) {
      case 'left': {
        this.moveCounter -= 1
        break;
      }

      case 'right': {
        if(this.movelimit == this.moveCounter){
          break;
        }
        this.moveCounter += 1
        break;
      }

      default:
        break;
    }

    let startIndex: number
    let endIndex: number

    if(this.moveCounter <= 0){
      this.moveCounter = 1
      startIndex = 0
      endIndex = 10
    } else {
      endIndex = (10 * this.moveCounter)
      startIndex = (endIndex - 10)
    }
    
    this.chartDataByModelsSliced = this.chartDataByModelsAll.slice(startIndex, endIndex)
  }

  filterItems(event: Event){
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.chartDataByModelsSliced = this.chartDataByModelsAll.filter(obj => obj.name.toLowerCase().includes(filterValue));
  }

  async filterDatabyUser(){
    if(this.user_id != 0){
      let response = await this.requestService.getRequest(`charts/byBookInExecution?userId=${this.user_id}`)
      this.chartDataByExecution = response.data
    }
  }

  async resetUserPassword(){
    if(this.user.value != ''){
      let ret = await this.requestService.putRequest('recoveryPassword', (this.user.value!))
      if(ret.status == 201 || ret.status == 200){
        this.validate.openSnackBarPositive(ret.data.message)
        this.lastPassword = ret.data.password 
        this.copyUrl(ret.data.password)
      }
    }
  }

  copyUrl(Password: string) {
    if(Password != ''){
      navigator.clipboard.writeText(Password)
    }
  }
}
