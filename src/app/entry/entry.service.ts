import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';

const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  idleState = 'Not started.';
  timedOut = false;
  ComingFrom = '';
  permissionJson: any;

  constructor(private idle: Idle, private http: HttpClient) { }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getTransactionList(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "entryserv/displayname", { 'headers': headers, params })
  }
  
  // public getEntryServ(pageNumber, pageSize): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //  // console.log(params);
  //  // console.log(headers);
  //   return this.http.get<any>(url + "entryserv/displayname?page=" + pageNumber, { 'headers': headers, params })
  // }

  public getEntryServDebit(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "entryserv/displayallname?trans_id=" + id, { 'headers': headers, params })
  }

  public getEntryList(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "ecfserv/get_ecftype", { 'headers': headers, params })
  }

  public getEntryMaster(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "entryserv/getentrytype", { 'headers': headers, params })
  }

  public getEntryServCredit(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "entryserv/displayallnamecr?trans_id=" + id, { 'headers': headers, params })
  }

  public getcatsearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/Apcategory_search?query=' + query + '&page='+page, { 'headers': headers })
  }

  public getsubcatsearch(query:any,catid,page): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/Apsubcategory_search?&query=' + query +'&category_id='+catid + '&page='+page, { 'headers': headers })
  }
  public getsubcatsearch1(query:any,page): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/Apsubcategory_search?&query=' + query + '&page='+page, { 'headers': headers })
  }

  public getEntryDropdownCondition(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "entryserv/conditionsname", { 'headers': headers, params })
  }
  
  public getEntrySave(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "entryserv/displayname", data, { 'headers': headers, params })
  }

  public getEntryListData(page,code,name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "entryserv/paramnamelist?&page="+page+"&code="+code+"&name="+name, { 'headers': headers })
  }

  public getEntryIdList(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "entryserv/updateparametername?param_id=" + id, { 'headers': headers })
  }

  public EntryIdListDelete(id): Observable<any> {
    let i = {'param_id':id}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "entryserv/updateparametername",i, { 'headers': headers })
  }

  public getEntryUpdate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "entryserv/entrytemplateupdate", data, { 'headers': headers, params })
  }

  public getCreditDropDown(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "mstserv/paymode_search", { 'headers': headers, params })
  }
}
