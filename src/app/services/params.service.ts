import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Classe para compartilhar dados entre os componentes
export class ParamService {

  VersionId: number = 2
  auxObj: any
  concluded: boolean = false
  currentVersion: any
  modelId: any
  idObj: any
  statusLog: string = ''

  constructor() { }

  SERVER_URL: string = '/api/'

  //Declara o Subject que gerencia o estado do disable
  private disableSubject = new BehaviorSubject<boolean>(false);

  //Obtem o estado atual do disable para outros componentes assinarem e serem notificados quando o estado mudar
  disable$ = this.disableSubject.asObservable();

  //Atualiza o valor do disable
  setDisable(value: boolean) {
    this.disableSubject.next(value);
  }

  //Altera a quantidade de campos no menu lateral de acordo com o usuário logado
  loadMenu(){
    let ret = []
    if (localStorage.getItem('profile') == 'cdt' || localStorage.getItem('profile') == 'dev'){
      ret = [
        {"icone":"home","titulo": "Início","rota":"/home"},
        {"icone":"smartphone","titulo": "Equipamentos","rota":"/equipments"},
        {"icone":"note","titulo": "Modelos de Caderno","rota":"/models"},
        {"icone":"menu_book","titulo": "Agendar Caderno","rota":"/books-in-execution"},
        {"icone":"collections_bookmark","titulo": "Meus Cadernos","rota":"/mybooks"},
        {"icone":"done_all","titulo": "Minhas Revisões","rota":"/myreviews"},
        {"icone":"change_history","titulo": "Revogar/Suspender","rota":"/revokebooks"},
        {"icone":"library_books","titulo": "Todos os Cadernos","rota":"/notebooks"},
        {"icone":"dvr","titulo": "Administração","rota":"/management"}
      ]
    } else {
      ret = [
        {"icone":"home","titulo": "Inicio","rota":"/home"},
        {"icone":"library_books","titulo": "Meus Cadernos","rota":"/mybooks"}
      ]
    }
    return ret
  }

  //Define as cores do calendário de homologação
 colors =  
  [
    { "picked": false, "hex": "#d50000" },
    { "picked": false, "hex": "#e67c73" },
    { "picked": false, "hex": "#f4511e" },
    { "picked": false, "hex": "#f6bf26" },
    { "picked": false, "hex": "#33b679" },
    { "picked": false, "hex": "#0b8043" },
    { "picked": false, "hex": "#039be5" },
    { "picked": false, "hex": "#3f51b5" },
    { "picked": false, "hex": "#7986cb" },
    { "picked": false, "hex": "#616161" },
  ]

}
