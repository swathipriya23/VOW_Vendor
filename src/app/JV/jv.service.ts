import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { ShareService } from '../ECF/share.service'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment'
import { createLogicalNot } from 'typescript';

const jvmodelurl = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class JvService {

  constructor(private http: HttpClient, private ecfshareservice: ShareService, private idle: Idle) { }

  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  public getcat(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }

  public getcategoryscroll(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    let urlvalue = jvmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public getsubcat(id, subcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = 0;
    }
    if (subcatkeyvalue === null) {
      subcatkeyvalue = "";

    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue, { 'headers': headers })
  }

  public getsubcategoryscroll(id, subcatkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = 0
    }
    if (subcatkeyvalue === null) {
      subcatkeyvalue = "";

    }

    let urlvalue = jvmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public getbs(bskeyvalue) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'mstserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })

  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    let urlvalue = jvmodelurl + 'mstserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public getcc(bsid, cckeyvalue) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bsid === undefined) {
      bsid = 0;
    }
    if (cckeyvalue === null) {
      cckeyvalue = "";

    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'mstserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue, { 'headers': headers })
  }

  public getccscroll(bsid, cckeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (cckeyvalue === null) {
      cckeyvalue = "";

    }
    if (bsid === undefined) {
      bsid = 0
    }
    let urlvalue = jvmodelurl + 'mstserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";

    }
    let urlvalue = jvmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getbranchscroll(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
    }
    let urlvalue = jvmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  //JV CREATE

  public createjv(CreateList: any,images): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let formData = new FormData();
    let obj = Object.assign({},CreateList)
    formData.append('data', JSON.stringify(obj));
    
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jvmodelurl + "jvserv/create_jventry", formData, { 'headers': headers })
  }

  
  //Journal Type

  public getjournaltype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jvmodelurl + "jvserv/get_journaltype", { 'headers': headers, params })
    
  }

  //Journal Details Type
   
  public getjournaldtltype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jvmodelurl + "jvserv/get_journaldetailstype", { 'headers': headers, params })
    
  }

  //Journal Summary

  public getjournalsummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(jvmodelurl + "jvserv/create_jventry", { 'headers': headers, params })
    
  }

  //Journal Approval Summary

  public getjournalappsummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(jvmodelurl + "jvserv/jvaprvlsummary", { 'headers': headers, params })
    
  }

  //CR Number Search

  public crnosearch(crno: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(crno == undefined){
      crno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + "apserv/get_approved_apcrno/"+crno, { 'headers': headers })
  }
  

  //JV Number Search

  public jvnosearch(refno: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(refno == undefined){
      refno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + "jvserv/jvrefnosearch?jerefno="+ refno, { 'headers': headers })
  }
  //JV Single Get

  public jvsingleget(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(id == undefined){
      id == ""
    }
    return this.http.get<any>(jvmodelurl + "jvserv/jventry/"+id, { 'headers': headers })
    
  }

  //JV Approve
   
  public jvapprove(data){

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jvmodelurl + "jvserv/jventryapproved", data, { 'headers': headers })
    
  }

  //JV Reject

  public jvreject(data){

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jvmodelurl + "jvserv/jventryreject", data, { 'headers': headers })

  }

  //JV Header Delete

  public jvheaderdelete(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(id == undefined){
      id == ""
    }
    return this.http.get<any>(jvmodelurl + "jvserv/jvdelete/"+id, { 'headers': headers })
    
  }


  //JV Detail Delete

  public jvdetaildelete(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(id == undefined){
      id == ""
    }
    return this.http.get<any>(jvmodelurl + "jvserv/jvdetaildelete/"+id, { 'headers': headers })
    
  }


  public jvsummarySearch(crno,status,amount,refno,type,branch,raiser): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'jvserv/jventrysearch?jecrno='+crno+'&jestatus='+status+'&jeamount='+amount+'&jerefno='+refno+'&jetype='+type+'&jebranch='+branch+'&created_by='+raiser, { 'headers': headers })

   
  }

  //JV Status Dropdown


  public getjournalstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jvmodelurl + "jvserv/get_journalstatus", { 'headers': headers, params })
    
  }

  public jvbulkupload(images){

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formData = new FormData();
    
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    // console.log("formdata",formData)
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jvmodelurl + "jvserv/search_jvupload",formData, { 'headers': headers })
    
  }

  public getrmcode(rmkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'usrserv/memosearchemp?query='+rmkeyvalue , { 'headers': headers })
  }

  public getrmscroll(rmkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (rmkeyvalue === null) {
      rmkeyvalue = "";

    }
    let urlvalue = jvmodelurl + 'usrserv/memosearchemp?query=' + rmkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getentrydetail(crno:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (crno === undefined) {
      crno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jvmodelurl + "entryserv/fetch_commonentrydetails/"+crno, { 'headers': headers, params })
    
  }
  
  public gettrandetail(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jvmodelurl + "jvserv/get_trans/"+id, { 'headers': headers, params })
    
  }


  //File Download

  public filedownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'jvserv/jvfile/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  //Delete File

  public deletefile(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'jvserv/deletefile/'+id, { 'headers': headers })
  }

  // Excel Template Download

  public templatedownload(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jvmodelurl + 'jvserv/xltemp', { 'headers': headers, responseType: 'blob' as 'json' })
  }




  







}
