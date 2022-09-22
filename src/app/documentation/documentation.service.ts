import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


const DocUrl = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  test: any;
  constructor(private http: HttpClient, private idle: Idle,) { }
  grnADDJson: any
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getpdfSG(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DocUrl + "sgserv/sg_usermanual", { headers, responseType: 'blob' as 'json' })
  }











}
