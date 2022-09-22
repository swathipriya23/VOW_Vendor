import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { ShareService } from '../ECF/share.service'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment'

const ecfmodelurl = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class EcfService {

  constructor(private http: HttpClient, private ecfshareservice: ShareService, private idle: Idle
  ) { }

  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  //ECF Summary
  public getecfSummaryDetails(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(ecfmodelurl + "ecfserv/create_ecf", { 'headers': headers, params })

  }

  //ECF CO Summary

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
    return this.http.get<any>(ecfmodelurl + "ecfserv/ecfco", { 'headers': headers, params })

  }

  //ECF Type

  public getecftype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/get_ecftype", { 'headers': headers, params })
    
  }

  //Supplier Type

  public getsuppliertype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/get_suppliertype", { 'headers': headers })
  }
  //ECF Header Create
  public createecfheader(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_ecf", CreateList, { 'headers': headers })
  }

  public editecfheader(data: any, ecfheaderid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = ecfheaderid;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_ecf", jsonValue, { 'headers': headers })
  }
  //PPX Dropdown

  public getppxdropdown(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/get_ppx", { 'headers': headers, params })
  }
  //ECF Status
  public getecfstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/get_status", { 'headers': headers, params })
  }

  //AP Status

  // public getapstatus(): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   return this.http.get<any>(ecfmodelurl + "apserv/get_apstatus", { 'headers': headers, params })
  // }
  //ECF Summary Search

  ecfsummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/ecf_hdrsearch?page="+pageno, CreateList, { 'headers': headers })
  }

  //Sales summary search

  

  salessummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/salessummary?page="+pageno, CreateList, { 'headers': headers })
  }

   //Sales Approver summary search

  

   salesappsummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/sales_approvalsearch?page="+pageno, CreateList, { 'headers': headers })
  }

  //ECF CO Summary Search
  ecfcosummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/searchempquery?page="+pageno, CreateList, { 'headers': headers })
  }
  //Commodity Search
  public getcommodity(commoditykeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=&status=1', { 'headers': headers })
  }

  public getcommodityscroll(commoditykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commoditykeyvalue === null) {
      commoditykeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=&page=' + pageno+'&status=1';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }



  //ECF Approval Summary
  
  getapproversummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(ecfmodelurl + "ecfserv/ecf_approvallist", { 'headers': headers, params })
  }

  // }
  //ECF Approval Search
  approvalsummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/ecf_approvalsearch?page="+pageno, CreateList, { 'headers': headers })
  }
  getinvoicedetailsummary(id) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id === undefined) {
      id = " "
    }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/ecfhdr/" + id, { 'headers': headers })
  }

  getOnbehalfofHR() {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/is_onbehalfoff_hr", { 'headers': headers })
  }
  
  getinvoicedetailsummaryy(id) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/ecfhdr/" + id, { 'headers': headers })
  }
  //ECF APPROVE
  public ecfapprove(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/ecfapprove", CreateList, { 'headers': headers })
  }

  //ECF REJECT

  public ecfreject(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/ecfreject", CreateList, { 'headers': headers })
  }

  //ECF APPROVE AND FORWARD
  public ecfapproveforward(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/ecfnextapprove", CreateList, { 'headers': headers })
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
    let urlvalue = ecfmodelurl + 'venserv/landlordbranch_list?query=' + parentkeyvalue;

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
    let urlvalue = ecfmodelurl + 'venserv/landlordbranch_list?query=' + parentkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
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
    let urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
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
    let urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  //APPROVER DROPDOWN
  public getapprover(commodityid,createdbyid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


    //APPROVER SCROLL
  public getapproverscroll(pageno,commodityid,createdbyid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+ '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }



   //DELMATAPPROVER DROPDOWN
   public getdelmatapprover(commodityid,createdbyid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimitlevelfilter?commodityid='+commodityid+'&level=1&created_by='+createdbyid;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


    //DELMATAPPROVER SCROLL
  public getdelmatapproverscroll(pageno,commodityid,createdbyid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimitlevelfilter?commodityid='+commodityid+'&level=1&created_by='+createdbyid+'&page='+ pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }



  
  //EMPLOYEE DROPDOWN
  public getemployee(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'usrserv/searchemployee?query=';
    // + empkeyvalue ;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  //EMPLOYEE SCROLL
  public getemployeescroll(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getsupplierView(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "venserv/supplierbranch/" + id, { 'headers': headers, params })
  }
  //CREATE INVOICE HEADER

  public invoiceheadercreate(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let object = Object.assign({}, CreateList)
    // let formData = new FormData();
    // formData.append('data', JSON.stringify(CreateList));
    // if (images !== null) {
    //   for (var i = 0; i < images.length; i++) {
    //     formData.append("file", images[i]);
    //   }
    // }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_invoiveheader", CreateList, { 'headers': headers })
  }

  //CREATE INVOICE DETAIL
  public invoicedetailcreate(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_invoivedtl", CreateList, { 'headers': headers })
  }
  //HSN

  public gethsn(hsnkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/search_hsncode?query=' + hsnkeyvalue, { 'headers': headers })
  }

  public getuom(uomkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/uom_search?query=' + uomkeyvalue, { 'headers': headers })
  }

  public uomscroll(uomkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (uomkeyvalue === null) {
      uomkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/uom_search?query=' + uomkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public gethsnscroll(hsnkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (hsnkeyvalue === null) {
      hsnkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/search_hsncode?query=' + hsnkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
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
    return this.http.get<any>(ecfmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }

  public getcategoryscroll(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
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
    return this.http.get<any>(ecfmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue, { 'headers': headers })
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

    let urlvalue = ecfmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(ecfmodelurl + 'mstserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })

  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'mstserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(ecfmodelurl + 'mstserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue, { 'headers': headers })
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
    let urlvalue = ecfmodelurl + 'mstserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }



  public DebitdetailCreateForm(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfserv/create_debit', value, { 'headers': headers })
  }
  public getcreditsummary(pageNumber = 1, pageSize = 10, suppid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppid === undefined) {
      suppid = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(ecfmodelurl + "venserv/branch/" + suppid + "/payment", { 'headers': headers, params })

  }

  public getcreditpaymodesummaryy(pageNumber = 1, pageSize = 10, paymodeid, suppid, accno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    if (suppid === undefined) {
      suppid = ""
    }

    if (accno === undefined) {
      accno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(ecfmodelurl + "ecfserv/ecfpayment_list/" + suppid + "/" + paymodeid + "?query=" + accno, { 'headers': headers, params })
  }

  public getcreditpaymodesummary(pageNumber = 1, pageSize = 10, paymodeid, suppid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(ecfmodelurl + "ecfserv/ecfpayment_list/" + suppid + "/" + paymodeid, { 'headers': headers, params })
  }

  public CreditDetailsSumbit(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfserv/create_credit', value, { 'headers': headers })
  }



  public getPaymode(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/paymode_search', { 'headers': headers })
  }
  public GSTcalculation(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfserv/get_tax', value, { 'headers': headers })
  }

  public OverallSubmit(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfserv/ecf_submit',value, { 'headers': headers })
  }

 
  public getselectsupplierSearch(searchsupplier): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (searchsupplier.code === undefined) {
      searchsupplier.code = ''
    }
    if (searchsupplier.panno === undefined) {
      searchsupplier.panno = ''

    }
    if (searchsupplier.gstno === undefined) {
      searchsupplier.gstno = ''
    }
    return this.http.get<any>(ecfmodelurl + 'venserv/search_supplier?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  }

  public getsuppliername(id, suppliername): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppliername === undefined) {
      suppliername = "";
    }
    if (id === undefined) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(ecfmodelurl + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername, { headers })
  }

  public getsuppliernamescroll(id, suppliername, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppliername === undefined) {
      suppliername = "";
    }
    if (id === undefined) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(ecfmodelurl + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername + '&page=' + pageno, { headers })
  }

  public getinvheaderdetails(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/invhdr/" + id, { 'headers': headers, params })
  }

  public getinvdetailsrecords(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfserv/invdtl/" + id, { 'headers': headers, params })
  }

  public ecfhdrdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfserv/ecfdelete/" + id, { 'headers': headers })
  }

  public invhdrdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfserv/invdelete/" + id, { 'headers': headers })
  }

  public invdtldelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfserv/invdtldelete/" + id, { 'headers': headers })
  }

  public debitdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfserv/debitdelete/" + id, { 'headers': headers })
  }

  public creditdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfserv/creditdelete/" + id, { 'headers': headers })
  }

  public ecfmodification(data: any, ecfheaderid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = ecfheaderid;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_ecfmod", jsonValue, { 'headers': headers })
  }

  public createinvhdrmodification(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', JSON.stringify(CreateList));
    // if (images !== null) {
    //   for (var i = 0; i < images.length; i++) {
    //     formData.append("file", images[i]);
    //   }
    // }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_invoiveheadermod", CreateList, { 'headers': headers })
  }

  public createinvdtlmodification(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_invoivedtlmod", CreateList, { 'headers': headers })
  }

  public createdebitmodification(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_debitmod", CreateList, { 'headers': headers })
  }
  public createcreditmodification(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_creditmod", CreateList, { 'headers': headers })
  }
  public createpomodification(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfserv/create_invoivepomod", CreateList, { 'headers': headers })
  }

  public getbankaccno(paymodeid, suppid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    if (suppid === undefined) {
      suppid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "venserv/supplierpaymode/" + suppid + "/" + paymodeid, { 'headers': headers })
  }

  public creditglno(paymodeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "mstserv/paymodecreditgl/" + paymodeid, { 'headers': headers })
  }

  public gettdstaxtype(suppid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (suppid === undefined) {
      suppid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/tds/' + suppid, { 'headers': headers })
  }

  public gettdstaxrate(vendorid, id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (id === undefined) {
      id = ""
    }
    if (vendorid === undefined) {
      vendorid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/tdstaxrate?vendor_id=' + vendorid + '&subtax_id=' + id, { 'headers': headers })
  }

  public gettdstaxcalculation(creditamount, taxrate): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (creditamount === undefined) {
      creditamount = ""
    }
    if (taxrate === undefined) {
      taxrate = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/tdscal/' + creditamount + '/' + taxrate, { 'headers': headers })
  }

  public gettdsapplicability(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/get_tds', { 'headers': headers })
  }

  public coverNotedownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/ecf_covernote/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public coverNoteadvdownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/ecf_covernoteadv/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public getpayto(payid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (payid === undefined) {
      payid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/get_payto/' + payid, { 'headers': headers })
  }

  public geterapaymode(paymodeid,raisedby): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/ecfpaymode_list/' + paymodeid + '?raiser_id=' + raisedby, { 'headers': headers })
  }

  public getbrapaymode(paymodeid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/ecfpaymode_list/' + paymodeid, { 'headers': headers})
  }

  public getadvancetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/get_advancetype', { 'headers': headers })
  }

  public getbranchrole(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfserv/dd', { 'headers': headers })
  }

  // public downloadfile(id:any) {
               
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   let idValue = id;
  //   const headers = { 'Authorization': 'Token ' + token }
  //    window.open(ecfmodelurl+'ecfserv/ecffile/'+idValue+"?token="+token, '_blank');
  //   } 

    public downloadfile(id): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      if (id === undefined) {
        id = ""
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + "ecfserv/ecffile/" + id, { headers, responseType: 'blob' as 'json' })
    }

    public filesdownload(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (id === undefined) {
        id = ""
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'ecfserv/ecffile/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
    }

    public ecfcodownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'ecfserv/ecfcodownload', { 'headers': headers, responseType: 'blob' as 'json' })
    }

    public deletefile(id:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (id === undefined) {
        id = ""
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'ecfserv/deletefile/'+id, { 'headers': headers })
    }

    public getcoview(no:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (no === undefined) {
        no = ""
      }
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(ecfmodelurl + "ecfserv/get_ecfnoo/"+no, { 'headers': headers, params })
    }

    public getpaymentstatus(no:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (no === undefined) {
        no = ""
      }
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(ecfmodelurl + "apserv/fetch_payment_inwarddtls/"+no, { 'headers': headers, params })
    }

    public gettransactionstatus(id:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (id === undefined) {
        id = ""
      }
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(ecfmodelurl + "ecfserv/get_trans/"+id, { 'headers': headers, params })
    }

    // Business Product Dropdown

    public getbusinessproductdd(businesskeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'mstserv/create_bsproduct?query='+businesskeyvalue, { 'headers': headers })
    }

    public getbusinessproductscroll(businesskeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (businesskeyvalue === null) {
        businesskeyvalue = "";
  
      }
      let urlvalue = ecfmodelurl + 'mstserv/create_bsproduct?query=' + businesskeyvalue + '&page=' + pageno;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }
  
    


    //Client Code Dropdown

    public getclientcode(clientkeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'mstserv/create_client?name='+clientkeyvalue+'&code=' , { 'headers': headers })
    }

    public getclientscroll(clientkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (clientkeyvalue === null) {
        clientkeyvalue = "";
  
      }
      let urlvalue = ecfmodelurl + 'mstserv/create_client?name=' + clientkeyvalue + '&code=&page=' + pageno;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }

    // RM Dropdown

    public getrmcode(rmkeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'usrserv/memosearchemp?query='+rmkeyvalue , { 'headers': headers })
    }

    public getrmscroll(rmkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (rmkeyvalue === null) {
        rmkeyvalue = "";
  
      }
      let urlvalue = ecfmodelurl + 'usrserv/memosearchemp?query=' + rmkeyvalue + '&page=' + pageno;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }

    public GetbranchgstnumberGSTtype(suppid,branchid): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (suppid === undefined) {
        suppid = ""
      }
      if (branchid === undefined) {
        branchid = ""
      }
      let userid = tokenValue.employee_id
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'ecfserv/gsttypee/' +suppid+'/'+branchid , { 'headers': headers })
    }

    public ppxadvance(Createdata: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(ecfmodelurl + "apserv/ap_ppxheader?get=true", Createdata, { 'headers': headers })
    }

    public ppxadvancecreate(Createdatas: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(ecfmodelurl + "apserv/ap_ppxdetails", Createdatas, { 'headers': headers })
    }

    public ppxdelete(id: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let value = {
        "ecfheader_id": id,
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(ecfmodelurl + "apserv/ap_ppxdetails?delete=true", value, { 'headers': headers })
    }

    public dualdelmatget(id): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(ecfmodelurl +"ecfserv/dualdelmat/"+id, { 'headers': headers, params })
    }

    public findmultilevel(Createdatas: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(ecfmodelurl + "mstserv/findmultlevel", Createdatas, { 'headers': headers })
    }

      
   public getdelmatforapprover(commodityid,level,createdbyid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    if (level === null) {
      level = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimitlevelfilter?commodityid='+commodityid+'&level='+level+'&created_by='+createdbyid;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


    
  public getdelmatforapproverscroll(pageno,commodityid,level,createdbyid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    if (level === null) {
      level = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimitlevelfilter?commodityid='+commodityid+'&level='+level+'&created_by='+createdbyid+'&page='+ pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public SalesOverallSubmit(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfserv/sales_submit',value, { 'headers': headers })
  }


   





  
    

  
    



  

 
}