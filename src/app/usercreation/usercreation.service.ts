import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';


const userUrl = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class UsercreationService {
  idleState = 'Not started.';
  timedOut = false;

  constructor(private http: HttpClient, private idle: Idle, ) { }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getUserSummary(pageno,portal_code): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(userUrl + "usrserv/vow_user_summary?code="+ portal_code + '&page=' + pageno, { 'headers': headers })
}


public userCreationForm(usercreation): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  console.log("usercreation", JSON.stringify(usercreation))
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(userUrl + "usrserv/portal_user", usercreation, { 'headers': headers })
}

public portaluserActiveInactive(code, status): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(userUrl + "usrserv/user_disable?code="+code+"&status="+status, { 'headers': headers })
}
}
