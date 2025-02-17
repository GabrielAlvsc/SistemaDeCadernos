import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  hide = true
  user = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor( 
    private authService: AuthService
  ) {}

  login() {
    this.authService.login(this.user, this.password)
  }
}