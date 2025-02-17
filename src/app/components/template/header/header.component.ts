import { Router } from '@angular/router';
import { startWith } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

//Cabeçalho fixo
export class HeaderComponent implements OnInit{

  user: string | null = ''

  constructor(
    private sidenavService: SidenavService, 
    private authService: AuthService,
    private router: Router,
    private validator: ValidatorService
  ) {}

  ngOnInit() {
    this.user = localStorage.getItem('name')
  }

  // Alterna o valor no Subject para abrir ou fechar o menu lateral
  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  logout(){
    this.authService.logout();
  }

  changePassword(){
    this.router.navigate(['changePassword'])
  }

  createTicket(){
    this.validator.dialogCreateTicket("0ms", "0ms")
  }
}
