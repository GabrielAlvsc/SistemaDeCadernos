import { ParamService } from './../../../services/params.service';
import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../../../services/sidenav.service';
import { startWith } from 'rxjs/operators';
import { RequestService } from 'src/app/services/request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  sidenavState: boolean = false;

  valueSpinner: any
  
  constructor(
    private sidenavService: SidenavService, 
    private params: ParamService,
    private request: RequestService) {
      this.request.getSpinnerState.subscribe((newValue) => {
        this.valueSpinner = newValue
      });
      // this.getScreenSize();
    }

  // screenWidth: number = 0;
  // screenHeight: number = 0;


  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: Event) {
  //   this.screenWidth = window.innerWidth;
  //   this.screenHeight = window.innerHeight;
  //   console.log('Largura da tela: ', this.screenWidth);
  //   console.log('Altura da tela: ', this.screenHeight);
  // }

  menu: any

  ngOnInit() {
    //Assina o Observable do estado do sidenav fornecido pelo sidenavService
    this.sidenavService
      .getSidenavState()
      .pipe(startWith(false)) // Inicia a assinatura com o valor false 
      .subscribe(state => {
        //Atualiza a propriedade com o estado recebido do Observable
        this.sidenavState = state;
      });
      this.menu = this.params.loadMenu()
  }

}
