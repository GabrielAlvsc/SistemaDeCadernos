import { RequestService } from './../../../services/request.service';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ShareService } from 'src/app/services/share.service';
import { MatRadioChange } from '@angular/material/radio';

export interface DeviceBook{
  name: string
  vendor: string 
  price: number
  endofsales: string
  model_id: number
  version_id: number
  book_id: number
}

@Component({
  selector: 'app-equip-book-list',
  templateUrl: './equip-book-list.component.html',
  styleUrls: ['./equip-book-list.component.css']
})

export class EquipBookListComponent {
  constructor(
    private router: Router,
    private requestService: RequestService,
    public shareService: ShareService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef;

  //Tabela
  displayedColumns: string[] = ['category', 'model', 'version', 'status', 'date', 'button'];
  dataSource: MatTableDataSource<DeviceBook> = new MatTableDataSource<DeviceBook>([]);

  //Referente ao Sort
  originalData: DeviceBook[] = []

  //Parametros da URL
  url: string = window.location.href
  urlParameters = this.url.split('/')
  equipamentID = this.urlParameters[6]
  route = this.urlParameters[4]
  ip = this.urlParameters[1]

  //Labels
  equipmentTitle: string = ''
  equipmentSap: string = ''
  equipmentVendor: string = ''

  //Referente as Imagens
  imagePath: string = ''

  async ngAfterViewInit() {
    let response: any;

    response = await this.requestService.getRequest(`deviceBooks/${this.equipamentID}`);
    this.dataSource.data = response.data.books
    this.dataSource.paginator = this.paginator;
    //Inserir nome do equipamento no Titulo da página
    this.equipmentTitle = response.data.name

    this.equipmentSap = response.data.sap
    this.equipmentVendor = response.data.vendor

    //Pegando o caminho da Imagem do equipamento
    this.imagePath = response.data.image

    //Colocando os Registros dentro de uma lista(usado para o sort)
    this.originalData = this.dataSource.data.slice()
  }

  goto_create() {
    this.router.navigate(['equipments/create']);
  }

  goBack(){
    this.router.navigate([`equipments`])  
  }

  navigateToComparative(bookId: number){
    window.open(`${this.ip}/comparative/${bookId}`)
  }

  onRadioChange(event: MatRadioChange) {
    if(event.value == 2) {
      this.dataSource.data = this.getLatestVersion()
    }
    else {
      this.dataSource.data = this.getAllVersions()
    }
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator
     }

     getLatestVersion() {
      const grouped = this.originalData.reduce((acc, book) => {
        if (!acc[book.model_id] || acc[book.model_id].version < book.version_id) {
          acc[book.model_id] = book; // Atualiza com o caderno de maior versão
        }
        return acc;
      }, {} as Record<number, any>);
      
      return Object.values(grouped); // Retorna os cadernos agrupados
    }
  
    // Retorna todos os cadernos (sem filtro)
    getAllVersions() {
      return this.originalData;
    }
}
