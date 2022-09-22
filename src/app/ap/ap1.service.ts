import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { data } from 'jquery';
import { Idle } from '@ng-idle/core';

const apiurl = environment.apiURL
// const apiurl = "http://bala-pc-nvysfin.at.remote.it:33001/"
@Injectable({
  providedIn: 'root'
})
export class Ap1Service {
  
  public invdate=new BehaviorSubject<any>('');
  public inhed=new BehaviorSubject<any>('');
  public dat=new BehaviorSubject<any>('');
  public typid=new BehaviorSubject<any>('');
  constructor(private http:HttpClient, private idle: Idle) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
  apicallservice(data: any,page): Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    return this.http.post(apiurl+'apserv/get_apinvoiceheader?page='+page,data, { 'headers': header })
  }
    audicservie(id:any) :Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apiurl+'apserv/get_apauditchecklist/'+id, { 'headers': header })
    }
    audiokservie(array: any) :Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      return this.http.post(apiurl+'apserv/auditchecklist_map', array, { 'headers': header })
    }
    bounce(data: any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
       return this.http.post(apiurl+'apserv/apstatus_update', data, { 'headers': header })
    }
    branchget(d:any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      console.log(getToken)
      const header = { 'Authorization': 'Token ' + token }
      return this.http.get(apiurl+'usrserv/search_employeebranch?page=1&query='+d, { 'headers': header })
    }
    public getInwDedupeChk(id,type): Observable<any> {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(apiurl+'apserv/dedupe_check/'+ id + '?type=' + type , { 'headers': headers })
    }
    prepayi(data: any,page): Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      return this.http.post(apiurl+'apserv/get_preparepayment?page='+page,data, { 'headers': header })
    }
    bouncedet(data: any,page): Observable<any>
    {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      return this.http.post(apiurl+'apserv/bounce_get?page='+page,data, { 'headers': header })
    }
     paymentsubmit(data: any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
       return this.http.post(apiurl+'apserv/preparepayment', data, { 'headers': header })
    }
    rejectsumry(data: any,page):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'apserv/bounce_get?type=reject', data, { 'headers': header })
    }
    bounceauditchecklist(id: any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apiurl+'apserv/get_bounceauditchecklist/'+id , { 'headers': header })
    }
    paymentfile(data:any,page:any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'apserv/get_paymentfile?page='+page,data, { 'headers': header })
    }
    crtdbt(data:any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'entryserv/entrydetails',data, { 'headers': header })
    }
    entrydet(data:any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apiurl+'entryserv/fetch_commonentrydetails/'+data ,{ 'headers': header })
    }
    acnodet(d:any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apiurl+'mstserv/bankdetails',  { 'headers': header })
    }
    downaled(id,data:any):Observable<any>
    {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'apserv/paymentdtlsdownload/'+id,data,  { 'headers': header, responseType: 'blob' as 'json' })
    }
    upload(fileToUpload: File):Observable<any>
    {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'apserv/payment_upload',  { 'headers': header, responseType: 'blob' as 'json' })
    }

    commonMasterAPChangeList():Observable<any>
    {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apiurl+'apserv/get_dropdown_list',  { 'headers': header })
    }

    commonMasterECFChangeList():Observable<any>
    {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apiurl+'ecfserv/get_status_ddl',  { 'headers': header })
    }
   
    commonMasterChange(data:any):Observable<any>
    {
      console.log('value',data)
      // let val = {'status':data}
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'apserv/ap_common_summary',data,  { 'headers': header })
    }


    commonMasterSearch(data:any,page):Observable<any>
    {
      // console.log('value',data)
      // let val = {'status':data}
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'apserv/ap_common_summary?page='+page,data,  { 'headers': header })
    }


    commonMasterChangeType(search,data:any,page):Observable<any>
    {
      console.log('value',data)
      let val = {'status':data}
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.post(apiurl+'apserv/get_apinvoiceheader',val+'?page='+page,  { 'headers': header })
    }


    //BRANCH SCROLL
  public getbranchscroll(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
    }
    let urlvalue = apiurl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  //SUPPLIER SCROLL
  public getsupplierscroll(parentkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (parentkeyvalue === null) {
      parentkeyvalue = "";
    }
    let urlvalue = apiurl + 'venserv/landlordbranch_list?query=' + parentkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  //ECF Summary

  public getecfcoSummaryDetails(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(apiurl + "ecfserv/ecfco", { 'headers': headers, params })

  }

  //ECF Type

  public getecftype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apiurl + "ecfserv/get_ecftype", { 'headers': headers, params })
    
  }

  //Supplier Type

  public getsuppliertype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apiurl + "ecfserv/get_suppliertype", { 'headers': headers })
  }

  //ECF Status
  public getecfstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apiurl + "ecfserv/get_status_ddl", { 'headers': headers, params })
  }

  //AP Status

  public getapstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apiurl + "apserv/get_apstatus", { 'headers': headers, params })
  }

  public getpaymentstatus(no:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apiurl + "apserv/get_crnoo/"+no, { 'headers': headers, params })
  }

  //BRANCH DROPDOWN
  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";

    }
    let urlvalue = apiurl + 'usrserv/search_branch?query=' + branchkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  //SUPPLIER DROPDOWN
  public getsupplier(parentkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (parentkeyvalue === null) {
      parentkeyvalue = "";
    }
    let urlvalue = apiurl + 'venserv/landlordbranch_list?query=' + parentkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getcoview(no:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apiurl + "ecfserv/get_ecfnoo/"+no, { 'headers': headers, params })
  }

  //ECF CO Summary Search
  ecfcosummarySearch(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(apiurl + "ecfserv/searchempquery", CreateList, { 'headers': headers })
  }

  public ecfcodownload(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apiurl + 'ecfserv/ecfcodownload', { 'headers': headers, responseType: 'blob' as 'json' })
  }

  //ECF Summary
  public getecfStatusSummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10, status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('status', status);
    return this.http.get<any>(apiurl + "ecfserv/fetch_ecf_common_summary", { 'headers': headers, params })

  }

  viewtracation(id:number):Observable<any>
    {
        
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apiurl+'apserv/apstatus_history/'+id,  { 'headers': header })
    }
  
    public payement(data):Observable<any>
    {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      return this.http.post(apiurl+'entryserv/commonquerydata', data, { 'headers': header })
    }
    public getInvCredit(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.get<any>(apiurl + 'apserv/apcredit/' +id,{ 'headers': headers })
    } 
    public oracal(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.post<any>(apiurl + 'entryserv/entry_oracle_comman_api',data,{ 'headers': headers })
    }  
    public failtrnget(data,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.post<any>(apiurl + 'apserv/ap_common_summary?page='+page,data,{ 'headers': headers })
    }  
    public repush(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.post<any>(apiurl + 'apserv/apstatus_update',data,{ 'headers': headers })
    }  
    public approvervalidation(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.get<any>(apiurl + 'apserv/approverview_validation/'+id,{ 'headers': headers })
    } 
    public payementvalidation(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.get<any>(apiurl + 'apserv/approverview_validation/'+id+'?preparepayment=true',{ 'headers': headers })
    } 
    public paid(data,file): Observable<any> {
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let formData = new FormData();
      formData.append('data', JSON.stringify(data));
      console.log("file",file)
      if (file !== null && file!==undefined) {
        for (var i = 0; i < file.length; i++) {
          formData.append("file", file[i]);
        }
      }
      // formData.append('file', file);
     
      return this.http.post<any>(apiurl + 'apserv/payment_upload?manual=true',formData,{ 'headers': headers })
    }  
    public catget(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.get<any>(apiurl +'mstserv/fetch_subcat_gl_list?query='+data,{ 'headers': headers })
    } 
    public aptofa(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.post<any>(apiurl +'faserv/clearingheader',data,{ 'headers': headers })
    } 
    public uploadpaymentfile(file): Observable<any> {
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(apiurl + 'apserv/payment_upload',file,{ 'headers': headers })
    }
    public gldesget(gl): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.get<any>(apiurl +'usrserv/gl_no/'+gl,{ 'headers': headers })
    }  
    public payementstatusupdate(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.post<any>(apiurl +'apserv/preparepayment?status_update=true ',data,{ 'headers': headers })
    }  
    public entryinactive(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.post<any>(apiurl +'entryserv/inactiveentry',data,{ 'headers': headers })
    }  
    public downaledfile(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.get<any>(apiurl +'apserv/apfiledownload/'+data,{ 'headers': headers,responseType: 'blob' as 'json'})
    }  
    public nacpayementtobank(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Basic ' + token }
     
      return this.http.post<any>('https://byzanqa.northernarc.com/api/ExecutePaymentTranCall',data,{ 'headers': headers})
    } 

    multiplestatus(data: any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
       return this.http.post(apiurl+'apserv/apstatus_update?multiple=true', data, { 'headers': header })
    }
    public bulkentryinactive(data): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      console.log(getToken)
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
     
      return this.http.post<any>(apiurl +'entryserv/bulkinactiveentry',data,{ 'headers': headers })
    }  
  }