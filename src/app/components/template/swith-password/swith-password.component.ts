import { RequestService } from '../../../services/request.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-swith-password',
  templateUrl: './swith-password.component.html',
  styleUrls: ['./swith-password.component.css']
})
export class SwithPasswordComponent {

  constructor(
    public dialogRef: MatDialogRef<SwithPasswordComponent>,
    private validatorService: ValidatorService, 
    private requestService: RequestService,
    private auth: AuthService) {
      this.error = this.validatorService.getErrorMessage(this.confirmedNewPassword);
  }


  oldPassword = new FormControl('', [Validators.required]);
  newPassword = new FormControl('', [Validators.required]);
  confirmedNewPassword = new FormControl('', [Validators.required]);
  error = '';

  //Parametros da senha
  hasLowerCase = false
  hasUpperCase = false
  hasNumber = false
  hasSpecialChar = false
  hasMinLength = false

  hideOld = true
  hideNew = true
  hideConf = true

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.newPassword.valueChanges.subscribe(value => {
      this.checkPassword(value!);
    });
  }

  checkPassword(value: string) {
    this.hasLowerCase = /[a-z]/.test(value); // Verifica letras minúsculas
    this.hasUpperCase = /[A-Z]/.test(value); // Verifica letras maiúsculas
    this.hasNumber = /[0-9]/.test(value);    // Verifica números
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Verifica caracteres especiais
    this.hasMinLength = value.length >= 10;
  }

  async changePassword() {
    let returnedObj: any

    if (this.newPassword.value !== this.confirmedNewPassword.value) {
      this.error = 'As senhas não coincidem.';
      return
    }
    
    returnedObj = await this.requestService.putRequest('updatePassword','',
        {
          'oldPassword': this.oldPassword.value, 
          'newPassword': this.confirmedNewPassword.value
        });

    if(returnedObj.status == 200 || returnedObj.status == 201){
      this.validatorService.openSnackBar(returnedObj.data.message)
      this.dialogRef.close(); 
    }
  }

  logout(){
    this.auth.logout();
    this.dialogRef.close(); 
  }
}
