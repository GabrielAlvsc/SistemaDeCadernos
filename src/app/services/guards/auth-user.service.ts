import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }
  
    canActivate(){
      if (this.authService.logged()) {
        return true;
      }
      this.router.navigate(['login']);
      return false;
    }
}
