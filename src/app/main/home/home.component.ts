import { ValidatorService } from 'src/app/services/validator.service';
import { ParamService } from './../../services/params.service';
import { RequestService } from './../../services/request.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ShareService } from 'src/app/services/share.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tickets } from 'src/app/app-objects';
import { Router } from '@angular/router';

export interface BookInExecution {
  name: string
  series: TestStatus[]
}

export interface TestStatus {
  name: string
  value: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

//Tela inicial 
//path: home/
export class HomeComponent {

  booksInExecution: BookInExecution[] = []

  view: [number, number] = [1000, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Total dos Testes (%)';
  colorScheme: any;

  isDevUser = (localStorage.getItem('profile') == 'dev')

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Tickets> = new MatTableDataSource<Tickets>([]);
  users: any
  filteredUser: any
  userResposibleFor: any
  
  originalData: any
  displayedColumns: string[] = [
    'title', 
    'category', 
    'description', 
    'userRequester', 
    // 'userResposible', 
    'startDate',
    // 'endDate',
    'button'
  ];

  constructor(
    private requestService: RequestService,
    private paramService: ParamService,
    private validatorService: ValidatorService,
    public shareService: ShareService,
    private router: Router
  ) {
    this.setColorScheme()
  }

  setColorScheme() {
    this.colorScheme = {
      domain:
        [
          '#8644A2', '#FFB400', '#FF204E', '#03C988'
        ]
    };
  }

  colors = this.paramService.colors
  events = [{}]
  currentDate = new Date();
  startDate = new Date(this.currentDate.getTime() - (185 * 24 * 60 * 60 * 1000));
  endDate = new Date(this.currentDate.getTime() + (185 * 24 * 60 * 60 * 1000));
  books: any
  showChart: boolean = true

  async openDialog(info: any) {
    let ret = this.books[info.event._def.publicId]
    let start = new Date(ret.start_date)
    let formatedStart = this.shareService.dateToString(start)
    let end = new Date(ret.end_date)
    let formatedEnd = this.shareService.dateToString(end)

    let eventInfo = {
      "title": ret.version.model.title,
      "vendor": ret.equipament.vendor,
      "equipment": ret.equipament.name,
      "startDate": formatedStart,
      "endDate": formatedEnd,
      "userExecutor": ret.user_executor.name,
      "userResponsible": ret.user_responsible.name,
      "color": info.event._def.ui.backgroundColor,
    }

    this.validatorService.dialogPopUp('0ms', '0ms', eventInfo)
  }

  monthView: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    locale: 'pt-br',
    events: [],

    eventClick: this.openDialog.bind(this),

    headerToolbar: {
      start: '',
      center: 'title',
      end: 'today prev next'
    },

    buttonText: {
      today: 'Hoje',
    },
  };

  async ngOnInit() {
    let result: any
    let formatedStartDate = this.shareService.dateToString(this.startDate)
    let formatedEndDate = this.shareService.dateToString(this.endDate)
    let vendor: string = ''
    let equipment: string = ''
    let model: string = ''

    result = await this.requestService.getRequest('home');
    if(localStorage.getItem('cpass') == 'true'){
      this.validatorService.dialogChangePass("0ms", "0ms")
    }

    result = await this.requestService.getRequest('booksByDate/' + formatedStartDate + '/to/' + formatedEndDate);
    this.books = result.data

    for (let index = 0; index < this.books.length; index++) {
      const element = result.data[index];
      vendor = element.equipament.vendor;
      equipment = element.equipament.name;
      model = element.version.model.title;

      this.events.push({
        title: 'Caderno ' + model + ' ' + vendor + ' ' + equipment,
        id: index,
        color: this.defineColors(index),
        start: element.start_date.split('T')[0],
        end: element.calendar_end_date.split('T')[0] //Soma 1 dia pra ficar certo no Calendário
      })
    }

    this.monthView.events = this.events
    this.loadChartData()

    result = await this.requestService.getRequest('usersTickets')
    this.users = result.data
    this.filteredUser = this.users.filter((user: any) => user.name == localStorage.getItem('name'))
    this.userResposibleFor = this.filteredUser[0].resposibleFor

    this.dataSource.data = this.userResposibleFor
    this.originalData = this.dataSource.data.slice()
    this.dataSource.paginator = this.paginator
  }

  defineColors(index: number) {
    if (index >= 10) {
      index = index % 10
    }
    return this.colors[index].hex
  }

  onSelect(event: any) {
    console.log(event);
  }

  async loadChartData() {
    let response = await this.requestService.getRequest('charts/byBookInExecution')

    this.booksInExecution = response.data
    this.showChart = (this.booksInExecution.length > 0)
  }

  GetUserbyId(name: string | null){
    if (name !== null){
      return name
    } else {
      return 'Não informado'
    }
  }

  async setAsFinished(ticketId: number, index: number){
    let response = await this.requestService.patchRequest('tickets',String(ticketId), {"finished": true})

    if (this.requestService.checkStatus(response.status)){
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
      this.validatorService.openSnackBarPositive(response.data.message);
    }
  }

  navigateToTickets(){
    this.router.navigate(['tickets'])
  }
}
