import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotAuthUserService implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }
  
    canActivate(){
      if (this.authService.logged()) {
        this.router.navigate(['home']);
        return false
      }
      return true;
    }
}
