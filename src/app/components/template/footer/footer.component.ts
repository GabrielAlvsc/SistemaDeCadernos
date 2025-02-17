import { Component } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private request: RequestService){}

  version: string | null = ''
  async ngOnInit(){
     
    this.version = localStorage.getItem('version')
    if (this.version == undefined || this.version == '') {
      let ret = await this.request.getRequest('systemVersion')
      localStorage.setItem('version',`F${ret.data.frontend} | B${ret.data.backend}`) 
      this.version = localStorage.getItem('version')
    }

  }
}
