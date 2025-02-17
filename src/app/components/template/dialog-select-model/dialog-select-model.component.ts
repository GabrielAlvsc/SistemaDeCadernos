import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { parse } from 'date-fns';
import { Sort } from '@angular/material/sort';
import { RequestService } from 'src/app/services/request.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Equipment } from 'src/app/app-objects';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-dialog-select-model',
  templateUrl: './dialog-select-model.component.html',
  styleUrls: ['./dialog-select-model.component.css']
})

export class DialogSelectModelComponent {
  url: string = window.location.href
  urlPaths = this.url.split('/')

  displayedColumns: string[] = ['title', 'category', 'version'];
  dataSource = new MatTableDataSource<Equipment>([])
  originalData: Equipment[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<DialogSelectModelComponent>,
    public shareService: ShareService,
    @Inject(MAT_DIALOG_DATA) public data: any  
    ) {}

  async ngAfterViewInit() {
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
    this.originalData = this.dataSource.data.slice()
  }

  navigate(id: number) {
    let SelectedRecord: any
    SelectedRecord = this.dataSource.data.find(record => record.id == id)
    this.dialogRef.close(SelectedRecord); 
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
        case 'title':
          return this.compare(a.title, b.title, isAsc)
        case 'category':
          return this.compare(a.category, b.category, isAsc)
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
