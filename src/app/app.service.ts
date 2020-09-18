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

 public url = '/api/v1'


  constructor( public http : HttpClient ) { }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public getUserInfoInLocalStorage = () => {
    return (JSON.parse(localStorage.getItem('userInfo')))
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

  public allUsers() : Observable<any> {
    return this.http.get(`${this.url}/user/allusers`)
  }

  public singleUser(data) : Observable<any> {
    return this.http.get(`${this.url}/user/singleuser/${data.userId}`)
  }

  public socialUsers() : Observable<any> {
    return this.http.get(`${this.url}/user/allSocialUsers`)
  }

  public createIssue(data) : Observable<any> {
    const params = new HttpParams()
    .set('userId', data.userId)
    .set('userName', data.userName)
    .set('assigneeId', data.assigneeId)
    .set('assigneeName', data.assigneeName)
    .set('status', data.status)
    .set('issueTitle', data.issueTitle)
    .set('issueDescription', data.issueDescription)
    .set('images', data.images)
    return this.http.post(`${this.url}/issue/create`, params)
  }

  public deleteIssue(issueId) : Observable<any> {
    let data = {}
      return this.http.post(`${this.url}/issue/delete/${issueId}`, data)
  }

  public editIssue(data) : Observable<any> {
    const params = new HttpParams()
    .set('assigneeId', data.assigneeId)
    .set('assigneeName', data.assigneeName)
    .set('status', data.status)
    .set('issueTitle', data.issueTitle)
    .set('issueDescription', data.issueDescription)
    .set('images', data.images)
    return this.http.put(`${this.url}/issue/edit/${data.issueId}`, params)
  }

  public getAllIssues() : Observable<any> {
    return this.http.get(`${this.url}/issue/allIssues`)
  }

  public getAllIssuesCount() : Observable<any> {
    return this.http.get(`${this.url}/issue/getallissuescount`)
  }

  public singleIssue(issueId) : Observable<any> {
    return this.http.get(`${this.url}/issue/singleissue/${issueId}`)
  }

  public issueByUserId(userId) : Observable<any> {
    return this.http.get(`${this.url}/issue/userid/${userId}`)
  }

  public issueByAssigneeId(assigneeId) :Observable<any> {
    return this.http.get(`${this.url}/issue/assigneeid/${assigneeId}`)
  }

  public removeAllWatcher(issueId) : Observable<any> {
    let data = {}
    return this.http.post(`${this.url}/issue/removeWatchersOnIssue/${issueId}`, data)
  }

  public postWatch(issueId) : Observable<any> {
    const params = new HttpParams()
    .set('issueId', issueId)
    .set('watchId', Cookie.get('receiverId'))
    return this.http.post(`${this.url}/issue/watch`, params)
  }

  public watchCount(issueId) : Observable<any> {
    return this.http.get(`${this.url}/issue/watchcount/${issueId}`)
  }

  public watchOfUser(userId) : Observable<any> {
    return this.http.get(`${this.url}/issue/watchofuser/${userId}`)
  }


  public numOfDays(issueId) : Observable<any> {
    const params = new HttpParams()
    .set('issueId', issueId)
    return this.http.post(`${this.url}/issue/numOfDays`, params)
  }

  public searchIssue(data) : Observable<any> {
    const params = new HttpParams()
    .set('search', data.search)
    return this.http.post(`${this.url}/issue/search`, params)
  }

  public createComment(data) : Observable<any> {
    const params = new HttpParams()
    .set('reporterId', data.reporterId)
    .set('reporterName', data.reporterName)
    .set('issueId', data.issueId)
    .set('comment', data.comment)
    return this.http.post(`${this.url}/issue/createcomment`, params)
  }

  public editComment(data) : Observable<any> {
    const params = new HttpParams()
    .set('comment', data.comment)
    return this.http.put(`${this.url}/issue/editcomment/${data.commentId}`, data)
  }

  public deleteComment(commentId) : Observable<any> {
    let data = {}
    return this.http.post(`${this.url}/issue/deletecomment/${commentId}`, data)
  }

  public getAllComments(issueId) : Observable<any> {
    return this.http.get(`${this.url}/issue/comments/${issueId}`)
  }

  public getAllFiles() : Observable<any> {
    return this.http.get(`${this.url}/issue/allfiles`)
  }

  public downloadFile(filename) : Observable<any> {
    return this.http.get(`${this.url}/issue/downloadFile/${filename}`)
  }

  public deleteFile(id) : Observable<any> {
    let data = {}
    return this.http.post(`${this.url}/issue/deleteFile/${id}`, data)
  }

  public getAllNotifications() : Observable<any> {
    return this.http.get(`${this.url}/issue/notification/${Cookie.get('receiverId')}`)
  }

  public notificationCount(userId) : Observable<any> {
    const params = new HttpParams()
    .set('userId', userId)
    return this.http.post(`${this.url}/issue/notifycount`, params)
  }

  public deleteWatch(data) : Observable<any> {
    const params = new HttpParams()
    .set('issueId', data.issueId)
    .set('watchId', data.watchId)
    return this.http.post(`${this.url}/issue/deleteWatch`, params)
  }
}
