import { RequestService } from './../../../services/request.service';
import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Equipment } from 'src/app/app-objects';
import { ShareService } from 'src/app/services/share.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-equip-list',
  templateUrl: './equip-list.component.html',
  styleUrls: ['./equip-list.component.css']
})

export class EquipListComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private requestService: RequestService,
    public equipment: Equipment,
    public shareService: ShareService,
    private validator: ValidatorService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('input') inputElement!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  //Tabela
  displayedColumns: string[] = ['name', 'vendor', 'sap', 'price', 'endofsales', 'button'];
  dataSource: MatTableDataSource<Equipment> = new MatTableDataSource<Equipment>([]);

  //Utilizado no Sort
  originalData: Equipment[] = []

  url: string = window.location.href
  params = this.url.split('/')
  route = this.params[4]

  async ngAfterViewInit() {
    let response: any;

    response = await this.requestService.getRequest('equipments');
    this.dataSource.data = response.data
    this.originalData = this.dataSource.data.slice()
    this.dataSource.paginator = this.paginator

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
    this.router.navigate(['equipments/create']);
  }

  navigateToDeviceBooks(id: string){
    this.router.navigate([`equipments/books/${id}`]) 
  }

  navigateToEdit(id: string){
    this.router.navigate([`equipments/edit/${id}`]) 
  }

  copyUrl(SAPcode: string) {
    if(SAPcode != ''){
      navigator.clipboard.writeText(SAPcode)
      this.validator.openSnackBarPositive('Código copiado para a área de trânsferencia.')
    }
  }
}
