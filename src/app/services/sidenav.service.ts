import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

//Serviço para gerenciar a aparição do menu lateral do nav
export class SidenavService {

  //Declara o Subject que gerencia o estado do sidenav
  private sidenavOpenedSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  //Alterna o estado do sidenav entre true e false
  toggleSidenav() {
    this.sidenavOpenedSubject.next(!this.sidenavOpenedSubject.value);
  }

  //Obtem o estado atual do sidenav como um Observable para outros componentes assinarem e serem notificados quando 0 estado mudar
  getSidenavState(): Observable<boolean> {
    return this.sidenavOpenedSubject.asObservable();
  }
}
