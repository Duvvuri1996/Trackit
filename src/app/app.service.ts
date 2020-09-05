import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

 private url = 'http://localhost:3000/api/v1'


  constructor( public http : HttpClient ) { }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public getUserInfoInLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  public signUp(data) : Observable<any>  {
    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('userEmail', data.userEmail)
    .set('userPassword', data.userPassword)
    .set('mobileNumber', data.mobileNumber)
    .set('country', data.country)
    return this.http.post(`${this.url}/user/signup`, params)
  }

  public signin(data) : Observable<any> {
    const params = new HttpParams()
    .set('userEmail', data.userEmail)
    .set('userPassword', data.userPassword)
    return this.http.post(`${this.url}/user/signin`, params)
  }

  public logout() : Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/user/logout`, params)
  }

  public recoveryMail(data) : Observable<any> {
    const params = new HttpParams()
    .set('userEmail', data.userEmail)
    return this.http.post(`${this.url}/user/recoverymail`, params)
  }

  public resetPassword(data) : Observable<any> {
    const params = new HttpParams()
    .set('userPassword', data.userPassword)
    .set('recoveryToken', data.recoveryToken)
    return this.http.post(`${this.url}/user/resetpassword`, params)
  }

  public logoutSoicalUser() : Observable<any> {
    return this.http.get('/api/logout')
  }

  public allUsers(authToken) : Observable<any> {
    return this.http.get(`${this.url}/user/allusers?authToken=${authToken}`)
  }

  public singleUser(data) : Observable<any> {
    return this.http.get(`${this.url}/user/singleuser/${data.userId}?authToken=${data.authToken}`)
  }

  public socialUsers(authToken) : Observable<any> {
    return this.http.get(`${this.url}/user/allSocialUsers?authToken=${authToken}`)
  }

  public createIssue(data, authToken) : Observable<any> {
    const params = new HttpParams()
    .set('userId', data.userId)
    .set('userName', data.userName)
    .set('assigneeId', data.assigneeId)
    .set('assigneeName', data.assigneeName)
    .set('status', data.status)
    .set('issueTitle', data.issueTitle)
    .set('issueDescription', data.issueDescription)
    .set('images', data.images)
    .set('authToken', authToken)
    return this.http.post(`${this.url}/issue/create`, params)
  }

  public deleteIssue(issueId, authToken) : Observable<any> {
    const params = new HttpParams()
      .set('authToken', authToken)
      return this.http.post(`${this.url}/issue/delete/${issueId}`, params)
  }

  public editIssue(data) : Observable<any> {
    const params = new HttpParams()
    .set('assigneeId', data.assigneeId)
    .set('assigneeName', data.assigneeName)
    .set('status', data.status)
    .set('issueTitle', data.issueTitle)
    .set('issueDescription', data.issueDescription)
    .set('images', data.images)
    .set('authToken', data.authToken)
    return this.http.put(`${this.url}/issue/edit/${data.issueId}`, params)
  }

  public getAllIssues(authToken) : Observable<any> {
    return this.http.get(`${this.url}/issue/allIssues?authToken=${authToken}`)
  }

  public singleIssue(issueId, authToken) : Observable<any> {
    return this.http.get(`${this.url}/issue/${issueId}?authToken=${authToken}`)
  }

  public issueByUserId(userId, authToken) : Observable<any> {
    return this.http.get(`${this.url}/issue/userid/${userId}?authToken=${authToken}`)
  }

  public issueByAssigneeId(assigneeId, authToken) :Observable<any> {
    return this.http.get(`${this.url}/issue/assigneeid/${assigneeId}?authToken=${authToken}`)
  }

  public postWatch(data) : Observable<any> {
    const params = new HttpParams()
    .set('issueId', data.issueId)
    .set('watchId', Cookie.get('userId'))
    .set('authToken', data.authToken)
    return this.http.post(`${this.url}/issue/watch`, params)
  }

  public watchCount(issueId, authToken) : Observable<any> {
    return this.http.get(`${this.url}/issue/watchcount/${issueId}?authToken=${authToken}`)
  }

  public watchOfUser(userId, authToken) : Observable<any> {
    return this.http.get(`${this.url}/issue/watchofuser/${userId}?authToken=${authToken}`)
  }


  public numOfDays(data) : Observable<any> {
    const params = new HttpParams()
    .set('issueId', data.issueId)
    .set('authToken', data.authToken)
    return this.http.post(`${this.url}/issue/numOfDays`, params)
  }

  public searchIssue(data) : Observable<any> {
    const params = new HttpParams()
    .set('search', data.search)
    .set('authToken', data.authToken)
    return this.http.post(`${this.url}/issue/search`, params)
  }

  public createComment(data) : Observable<any> {
    const params = new HttpParams()
    .set('reporterId', data.reporterId)
    .set('reporterName', data.reporterName)
    .set('issueId', data.issueId)
    .set('comment', data.comment)
    .set('authToken', data.authToken)
    return this.http.post(`${this.url}/issue/createcomment`, params)
  }

  public editComment(data) : Observable<any> {
    const params = new HttpParams()
    .set('comment', data.comment)
    .set('authToken', data.authToken)
    return this.http.put(`${this.url}/issue/editcomment/${data.commentId}`, data)
  }

  public deleteComment(commentId, authToken) : Observable<any> {
    const params = new HttpParams()
    .set('authToken', authToken)
    return this.http.post(`${this.url}/issue/deletecomment/${commentId}`, authToken)
  }

  public getAllComments(issueId, authToken) : Observable<any> {
    return this.http.get(`${this.url}/issue/comments/${issueId}?authToken=${authToken}`)
  }

  public getAllFiles() : Observable<any> {
    return this.http.get(`${this.url}/issue/allFiles`)
  }

  public downloadFile(fileName) : Observable<any> {
    return this.http.get(`${this.url}/downloadFile/${fileName}`)
  }
}
