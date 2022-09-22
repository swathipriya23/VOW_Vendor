import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class ReportService {
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

  public getModuleList(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "reportserv/module", { 'headers': headers, params })
  }

  public getModuleNameList(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "reportserv/modulename/"+id, { 'headers': headers, params })
  }

  public getDisplayName(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "reportserv/fetch_displayname?trans_id="+id, { 'headers': headers })
  }

  public parameterSave(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/parametersave",data, { 'headers': headers })
  }
  
  public getParameterList(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/parameterlist",data, { 'headers': headers })
  }

  public generateExcel(data): Observable<any> {
    this.reset();
    let obj = {"report_id":data}
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/reportdownload",obj, { 'headers': headers,responseType: 'blob' as 'json' })
  }

  public getDownloadList(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "reportserv/downloadlist", { 'headers': headers })
  }

  public getDownloadReport(id):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "reportserv/downloadreport/"+id, {'headers': headers,responseType: 'blob' as 'json'})
  }

  public getvensearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'venserv/search_suppliername_dropdown?query=' + query + '&page='+page, { 'headers': headers })
  }

  public getVendorDetails(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/fetch_supplierdetails",data, { 'headers': headers, params })
  }

  public getVendorDetailsName(d): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/fetch_supplierdetails?Type=Name",d, { 'headers': headers, params })
  }

  public getVendorDownloadReport(id):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "reportserv/download_vendorstatement?supplier_id="+id, {'headers': headers,responseType: 'blob' as 'json'})
  }

  public getVendorManualRun(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/vendorstatement_eod",data, { 'headers': headers, params })
  }

  public manualRunTB(data): Observable<any> {
    this.reset();
    let obj = {"report_id":data}
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/fetch_manualrun",obj, { 'headers': headers })
  }

  public getRole():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "reportserv/fetch_role_report", {'headers': headers})
  }
  public getschemalist(data): Observable<any> {
    this.reset();
    let obj = {"report_id":data}
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "reportserv/database_get?name="+data, { 'headers': headers })
  }
  public gettablelist(data,table): Observable<any> {
    this.reset();
    let obj = {"report_id":data}
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "reportserv/db_table_get/"+data+'?name='+table, { 'headers': headers })
  }
  public getcolumnList(schema,table,column): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "reportserv/db_column_get/"+schema+'/'+table+'?name='+column, { 'headers': headers })
  }
  public getquerydata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "reportserv/db_table_execute",data, { 'headers': headers })
  }
  public schedule_trigger(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  return this.http.post<any>(url + "reportserv/jv_scheduler_trigger", { 'headers': headers })
}
}