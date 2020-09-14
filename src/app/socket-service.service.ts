import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {

  private url = 'http://localhost:3000';
  private socket

  constructor(public http : HttpClient) { 
    this.socket = io(this.url);
  }
  
  public verifyUserOnConnection = () => {
    return new Observable((observer) => {
      this.socket.on('verify-user', (data) => {
        observer.next(data)
      })
    })
  }

  public setUser = () => {
    return new Observable((observer) => {
      this.socket.emit('set-user', )
    })
  }


}
