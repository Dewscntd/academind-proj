import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { User } from './user.model';


export interface AuthResponseData {
        idToken: string
        email: string	
        refreshToken: string
        expiresIn: string	
        localId: string,
        registered?: boolean	
}

@Injectable({providedIn: 'root'})
export class AuthService {
    readonly API_KEY = 'AIzaSyBIgjnKBrI6yUI6h7vu_MNouspicpKXbtc';
    readonly SIGN_UP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
    readonly LOGIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

    user = new Subject<User>()

    constructor(private http: HttpClient){}


    signUp(email: string, password: string){
       return this.http.post<AuthResponseData>(
           `${this.SIGN_UP_URL}${this.API_KEY}`,{
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleEror),
            tap( responseData => {
                this.handleAuth(
                    responseData.email, 
                    responseData.localId, 
                    responseData.idToken, 
                    +responseData.expiresIn
                )
            } )
        )
    }

    login(email: string, password: string){
         return this.http.post<AuthResponseData>(
             `${this.LOGIN_URL}${this.API_KEY}`,{
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleEror),
            tap( responseData => {
                this.handleAuth(
                    responseData.email, 
                    responseData.localId, 
                    responseData.idToken, 
                    +responseData.expiresIn
                )
            } )
        )
    }

    private handleAuth( email: string, id: string, token: string, expiresIn: number) {
        const expireDate = new Date( new Date().getTime() + +expiresIn*1000);
        const user = new User(
            email, 
            id, 
            token, 
            expireDate
        );
        this.user.next(user);
    }

    private handleEror( errorRes: HttpErrorResponse) {
        let errorMsg="Ooopss.. something wrong"
        if( !errorRes.error || !errorRes.error.error){
            return throwError(errorMsg)
        }
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
            errorMsg = 'The email address is already in use by another account'
            case 'INVALID_PASSWORD':
            errorMsg  ='The password is invalid or the user does not have a password.'
        }
        return throwError(errorMsg);
    }
}