import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-n-found',
  templateUrl: './page-n-found.component.html',
  styleUrls: ['./page-n-found.component.css']
})
export class PageNFoundComponent {

  //Parametros da URL
  url: string = window.location.href
  urlParameters = this.url.split('/')
  route = this.urlParameters[4]
  ip = this.urlParameters[1]

  constructor(private router: Router){}
  
  navigateHomepage(){
    this.router.navigate(['home'])
  }

  navigatePortal(){
    this.router.navigate([`${this.ip}/home`])
  }
}
