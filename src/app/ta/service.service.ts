import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { MEMOLIST } from "../model/memointerface";
import { map, retry } from "rxjs/operators";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { User } from '../user'
import { environment } from 'src/environments/environment';

const url = environment.apiURL
const taURL = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient, private idle: Idle,) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  // idleState = 'Not started.';
  // timedOut = false;
  
 
  // reset() {
  //   // this.idle.watch();
  //   this.idleState = 'Started.';
  //   this.timedOut = false;
  // }

  // constructor(private idle: Idle, private http: HttpClient) { }

  public login(user: User): Observable<any> {
    this.reset();
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(user);
    // // console.log(body)
    // console.log(memoUrl);
    return this.http.post(taURL + 'usrserv/auth_token' + '', body, { 'headers': headers })
    // .subscribe(data => {
    //   if(data){
    //     this.Loginname=data.name;
    //   }
    // })
  }

public createtourmaker(CreateList: any): Observable<any> {
  this.reset();
  const getToken: any = sessionStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(CreateList)
  const headers = { 'Authorization': 'Token ' + token }
  console.log("Body", body)
  return this.http.post<any>(taURL + "taserv/tour", body, { 'headers': headers })
  }
  public TourmakerEditForm( tourJson): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
    // "id": id
    }
    let jsonValue = Object.assign({}, idValue, tourJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "", jsonValue, { 'headers': headers })
    }
    public getadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      console.log(params);
      return this.http.get<any>(taURL + ""+ pageNumber ,{ 'headers': headers })
    }
    public getViewadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      console.log(params);
      return this.http.get<any>(taURL + ""+ pageNumber ,{ 'headers': headers })
    }
    public getTourApprovesummary(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      console.log(params);
      return this.http.get<any>(taURL + "taserv/tourapprove/tour" ,{ 'headers': headers })
    }
    public getTourmakerSummary(): Observable<any> {
      this.reset();
      const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // let params: any = new HttpParams();
      // params = params.append('page', pageNumber.toString());
      // params = params.append('pageSize', pageSize.toString());
      //console.log(params);
    //  let s="http://143.110.244.51/tademo/taserv/tourdata"
      return this.http.get<any>(taURL +'taserv/tourdata',{ 'headers': headers })
      // return this.http.get<any>(s,{ 'headers': headers })
    
    // public getTourmakerSummary(): Observable<any> {
    //   this.reset();
    //   const getToken = sessionStorage.getItem("sessionData")
    //   let tokenValue = JSON.parse(getToken);
    //   // let token = tokenValue.token
    //   let token= tokenValue.token
    //   const headers = { 'Authorization': 'Token ' + token }
    //   let s="http://143.110.244.51/tademo/taserv/tourdata"
    //   return this.http.get<any>(s, { 'headers': headers })
    // }
}
}
// http://143.110.244.51/tademo/taserv/tourdata