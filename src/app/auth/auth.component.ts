import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLogInMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor( 
    private authService: AuthService,
    private router: Router
    ){};

  onSwitchMode(){
    this.isLogInMode = !this.isLogInMode;
  }

  onSubmit(form: NgForm){
    const {email, password } = form.value;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if(this.isLogInMode){
      authObs = this.authService.login(email,password);
    } else {
      authObs =this.authService.signUp(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['./recepies']);
      },
      errorMsg=> {
        console.log(errorMsg);
        this.error = errorMsg;
        this.isLoading = false;
      }
    )

    form.reset();
  }
}
