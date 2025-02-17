import { Component, Output, EventEmitter } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})

//Círculo giratório para indicar que a tela está carregando
export class SpinnerComponent {

  valueSpinner: any

  constructor(
    private requestService: RequestService
  ) {
    //Assina o observable do estado do Spinner fornecido pelo requestService
    this.requestService.getSpinnerState.subscribe((newValue) => {
      //Atualiza o valor do Spinner com o estado recebido do observable
      this.valueSpinner = newValue
    })
  }
}
