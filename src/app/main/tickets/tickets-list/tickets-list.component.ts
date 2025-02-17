import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Tickets } from 'src/app/app-objects';
import { RequestService } from 'src/app/services/request.service';
import { ShareService } from 'src/app/services/share.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.css']
})

export class TicketsListComponent {

  constructor(
    private router: Router,
    private request: RequestService,
    public shareService: ShareService,
    private validator: ValidatorService,
  ){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Tickets> = new MatTableDataSource<Tickets>([]);
  users: any

  currentPage = 0
  pageSize = 0;
  
  originalData: any
  displayedColumns: string[] = [
    'title', 
    'category', 
    'description', 
    'userRequester', 
    'userResposible', 
    'startDate',
    'endDate',
    'button'
  ];

  finishedFilter: boolean = false
  selectedOption: string | undefined;

  async ngOnInit(){
    if(localStorage.getItem('profile') == 'DEV'){
      this.router.navigate([`404`])  
    }

    let response = await this.request.getRequest('tickets')


    
    this.originalData = response.data

    // this.dataSource.data = response.data
    this.dataSource.data = this.originalData.filter((data: any) => data.finished == this.finishedFilter)
    this.dataSource.paginator = this.paginator
  }

  GetUserbyId(name: string | null){
    if (name !== null){
      return name
    } else {
      return 'Não informado'
    }
  }

  setResponsible(ticketId: number, index: number){

    this.validator.dialogUpdatgeTicket('0ms','0ms', ticketId).subscribe(result => {
      if (result) {

        let newIndex = ((index - this.pageSize) + (this.pageSize * this.currentPage))
        const userResp = this.dataSource.data[newIndex].user_resp;
        userResp.name = result;

        this.dataSource._updateChangeSubscription();
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1
    this.pageSize = event.pageSize;
  }

  onRadioChange(event: MatRadioChange) {
    this.selectedOption = event.value;
    this.finishedFilter = (event.value == 2);
    this.dataSource.data = this.originalData.filter((data: any) => data.finished == this.finishedFilter)

    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator
  }
}
