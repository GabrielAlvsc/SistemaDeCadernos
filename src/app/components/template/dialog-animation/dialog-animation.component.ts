import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ParamService } from 'src/app/services/params.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-dialog-animation',
  templateUrl: './dialog-animation.component.html',
  styleUrls: ['./dialog-animation.component.css']
})

//Pop-up para confirmar algum tipo de exclusão
export class DialogAnimationComponent implements OnInit {

  url: string = window.location.href
  urlPaths = this.url.split('/')

  message: string = ''
  fields: any
  type = 0

  constructor(
    public dialogRef: MatDialogRef<DialogAnimationComponent>,
    private requestService: RequestService,
    private router: Router,
    private paramService: ParamService) {
  }

  ngOnInit(): void {
    //Varia a mensagem de acordo com a informação que será excluída
    switch (this.urlPaths[4]) {
      case 'models':
        if (this.urlPaths[6] == 'item') {
          this.message = 'item'
        } else if (this.urlPaths[6] == 'features'){
          this.message = 'caracteristica'
        } else {
          this.message = ''
        }
        break;

      case 'equipments':
        this.message = 'equipamento'
        break;;
    }
  }

  async deletionConfirm() {
    let ret: any
    let route: string = ''
    //Varia o path da requisição de acordo com a informação a ser excluída
    switch (this.urlPaths[4]) {
      case 'models':
        route = this.urlPaths[4] + '/' + this.urlPaths[5]

        if (this.urlPaths[6] == 'item') {
          this.fields = this.paramService.auxObj
          this.message = 'item'
          ret = await this.requestService.deleteRequest('item', this.urlPaths[8])
        } else {
          this.message = 'caracteristica'
          ret = await this.requestService.deleteRequest('features', this.urlPaths[8])
        };
        break;

      case 'equipments':
        route = this.urlPaths[4]
        this.message = 'equipamento'
        ret = await this.requestService.deleteRequest('equipments', this.urlPaths[6])
        break;;
    }

    if ((ret == 201) || (ret == 200)) {
      this.router.navigate([route]);
    }


  }
}
