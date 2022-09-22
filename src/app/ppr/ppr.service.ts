import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { typeSourceSpan } from '@angular/compiler';

const url = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class PprService {
  idleState = 'Not started.';
  timedOut = false;
  income: any;
  constructor(private idle: Idle, private http: HttpClient) { }
  pprgetjsondata:any;

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getState(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "mstserv/state", { 'headers': headers })
  }

  public getPprsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_expensegrp_list",this.pprgetjsondata, { 'headers': headers })
  }
  public getpprsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_expensegrp_masterlist",this.pprgetjsondata, { 'headers': headers })
  }

  public getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_suppliergrp",this.pprgetjsondata, { 'headers': headers })
  }
  public getccbsdetails(type,pageNumber,pageSize): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_cccbs?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
  }
  public getecfdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_ecf",this.pprgetjsondata, { 'headers': headers })
  }
  public new_expense_list(type,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_expense_list?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
  }
  public new_expenselist(type,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_expense_masterlist?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
  }
  public new_cat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_cat_list",this.pprgetjsondata, { 'headers': headers })
  }
  public new_subcat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_subcat_list",this.pprgetjsondata, { 'headers': headers })
  }
  public new_subcatlist(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_subcat_list",this.pprgetjsondata, { 'headers': headers })
  }
  public getcostcenter(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(url + "mstserv/state?page=" + pageNumber, { 'headers': headers })
  }
  public getbranchdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'usrserv/search_employeebranch?query=' + query+"&page="+pagenumber;
    // let urlvalue = url + 'pprservice/budget_employeebranch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getpprbranchdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = url + 'usrserv/search_employeebranch?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/budget_employeebranch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbsdropdown(mstbusiness_id,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/ppr_bs?query=' + query+"&page="+pagenumber+"&mstbusinessid="+mstbusiness_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbusinessdropdown(sector_id,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/ppr_mstbusiness_segment?query=' + query+"&page="+pagenumber+"&sectorid="+sector_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_business_dropdown(sector_id,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/business_fetch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_bs_dropdown(bscc_id,query,pagenumber) {
    this.reset();
    console.log(bscc_id)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/bs_fetch?query=' + query+"&page="+pagenumber +"&business_id="+bscc_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_cc_dropdown(bs_id,query,pagenumber) {
    this.reset();
    let bsid
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    if(bs_id=='' || bs_id==null || bs_id==undefined){
      bsid=''
    }else{
      bsid=bs_id
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/cc_fetch?query=' + query+"&page="+pagenumber+'&bs_id='+bsid;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbsbudgetdropdown(mstbusiness_id,branchid,branchcode,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    if(branchid==undefined||branchid==null){
      branchid=0
    }
    if(branchcode==undefined||branchcode==null){
      branchcode=0
    }
    let urlvalue = url + 'pprservice/ppr_bs?query=' + query+"&page="+pagenumber+"&mstbusinessid="+mstbusiness_id+"&budget_builder=True"+"&branchid="+branchid+"&branchcode="+branchcode;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbusinessbudgetdropdown(sector_id,branchid,branchcode,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    if(branchid==undefined||branchid==null){
      branchid=0
    }
    if(branchcode==undefined||branchcode==null){
      branchcode=0
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/ppr_mstbusiness_segment?query=' + query+"&page="+pagenumber+"&sectorid="+sector_id+"&budget_builder=True"+"&branchid="+branchid+"&branchcode="+branchcode;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public allocationFormdroupdown(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    var changeValue = {
     "name":type
    }
    // console.log("change",changeValue)
    console.log("changeValue",changeValue.name)
    if(changeValue.name===null){
      changeValue = {
        "name":''
       }
    }
    console.log("changeValue",changeValue.name)

    let Json = Object.assign({}, changeValue)
    
    return this.http.post<any>(url + "usrserv/search_ccbs",JSON.stringify(Json), { 'headers': headers })
  }

  public bsccToDroupdown(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=type
    
    var changeValue = {
      
     "name":type
    }
    if(changeValue.name===null){
      changeValue = {
        
        "name":''
       }
    }
    // console.log("change",changeValue)
  
    let Json = Object.assign({}, changeValue)
    
    return this.http.post<any>(url + "usrserv/search_ccbs",JSON.stringify(Json), { 'headers': headers })
  }

  public getsupplierdetails(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    this.pprgetjsondata=data
    let urlvalue = url + 'pprservice/ppr_supplier?' +"page="+1+"&apexpense_id="+data.apexpense_id
    +"&apsubcat_id="+data.apsubcat_id+"&transactionmonth="+data.transactionmonth
    +"&quarter="+data.quarter+"&masterbusinesssegment_name="+data.masterbusinesssegment_name
    +"&sectorname="+data.sectorname+"&apinvoicesupplier_id="+data.apinvoicesupplier_id
    +"&yearterm="+data.yearterm+"&finyear="+data.finyear+"&bs_name="+data.bs_name+"&cc_name="+data.cc_name
    +"&divAmount="+data.divAmount;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
    // return this.http.post<any>(url + "pprservice/ppr_supplier/1",this.pprgetjsondata, { 'headers': headers })
  }
  public getsupplierdetail(data,pageNumber,pageSize): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
            params = params.append('page', pageNumber.toString());
            params = params.append('pageSize', pageSize.toString());
    this.pprgetjsondata=data
    let urlvalue = url + 'pprservice/ppr_supplier?' +"page="+pageNumber+"&apexpense_id="+data.apexpense_id
    +"&apsubcat_id="+data.apsubcat_id+"&transactionmonth="+data.transactionmonth
    +"&quarter="+data.quarter+"&masterbusinesssegment_name="+data.masterbusinesssegment_name
    +"&sectorname="+data.sectorname+"&apinvoicesupplier_id="+data.apinvoicesupplier_id
    +"&yearterm="+data.yearterm+"&finyear="+data.finyear+"&bs_name="+data.bs_name+"&cc_name="+data.cc_name
    +"&divAmount="+data.divAmount;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
    // return this.http.post<any>(url + "pprservice/ppr_supplier/1",this.pprgetjsondata, { 'headers': headers })
  }
  public getexpensegrpdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'mstserv/expensegrp_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getccdropdown(business_id,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/ppr_cc?query=' + query+"&page="+pagenumber+"&businessid="+business_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getsectordropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'mstserv/sector_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  
  public getfinyeardropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // finyear_search
    // let urlvalue = url + 'pprservice/budget_finyear_search?page='+pagenumber;
    let urlvalue = url + 'pprservice/finyear_search';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbbfinyeardropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // finyear_search
    let urlvalue = url + 'pprservice/budget_finyear_search?page='+pagenumber;
    // let urlvalue = url + 'pprservice/finyear_search';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbudgetsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_expensegrp_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetsearchsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expensegrp_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetapprovesummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expensegrp_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetcheckersummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expensegrp_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetviewsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expensegrp_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_expense_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_listsearch(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expense_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_view_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expense_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_checker_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expense_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_approve_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_expense_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildersubcat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_subcat_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_checker_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_cat_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_approver_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_cat_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_viewer_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_cat_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_cat_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public buildersubcat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_subcat_list",this.pprgetjsondata, { 'headers': headers })
  } 

  public new_buildersubcat_approve_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_subcat_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildersubcat_checker_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_subcat_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildersubcat_view_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_new_subcat_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 

  public budget_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public budgetapprove_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public budgetchecker_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public budgetview_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  }
  public getapproverdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'usrserv/searchemployee?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
    
  public set_budgetbuilder(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_builder_set",this.pprgetjsondata, { 'headers': headers })
  }  
  public budget_draft_set(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(url + "pprservice/budget_draft_set",this.pprgetjsondata, { 'headers': headers })
  } 
  public budget_status_set(status,buget_data,type,remark): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=buget_data
    console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(url + "pprservice/budget_status_set?status="+status+'&level='+type+'&remark_val='+remark,this.pprgetjsondata,{ 'headers': headers })
  } 
  public set_Budgetbuilder(type,amountval_type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(url + "pprservice/budget_builder_set?divAmount="+amountval_type,this.pprgetjsondata, { 'headers': headers })
  }  
  public set_Budgetbuilder_Approve(type,amountval_type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_approver_set?divAmount="+amountval_type,this.pprgetjsondata, { 'headers': headers })
  }  
  public getallocationleveldropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/allocationlevel_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 

  public getcostdriverdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/costdriver_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 

  public getbsccdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/bsccmaping_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 
  public getcostallocationsummary(pagenumber,pageSize,srachid) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let params: any = new HttpParams();
    params = params.append('page', pagenumber.toString());
    params = params.append('pageSize', pageSize.toString());
    var urlvalue
    if(srachid==0){
      urlvalue = url + 'pprservice/allocationmeta?page='+ pagenumber;
    }else{
    urlvalue = url + 'pprservice/allocationmeta?frombscccode='+srachid +'&page='+ pagenumber;}
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 
  public get_cost_allocation_summary(pagenumber,summary_param) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let params: any = new HttpParams();
    params = params.append('page', pagenumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    var urlvalue
   
    urlvalue = url + 'pprservice/fetch_all?page='+pagenumber+'&core_bscc='+summary_param.allocation+'&bs_id='+summary_param.bs+'&cc_id='+summary_param.cc;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 
  public set_allocationratio(changeValue,editid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let changeValue
      // if(costsummary_id===undefined || costsummary_id ==='' || costsummary_id===null){
        // this.minvalue_from
      
      console.log("else")
      // changeValue = {
      //   "source_bscc_code": bs_id,
      //   "frombscccode":bs_id,
      //   "validity_from":validityfrom,
      //   "validity_to":validityto,
      //   "level": allocation_id ,
      //   "cost_driver": cost_id,
      //   "allocation_amount":amount,
      //   "to_data":type
      //   }
    
    console.log("finally=>",changeValue)
    let Json = Object.assign({}, changeValue)
    // this.pprgetjsondata=type
    if(editid!=0){
    return this.http.post<any>(url + "pprservice/modify_allocation",Json, { 'headers': headers })

    }else{
      return this.http.post<any>(url + "pprservice/allocation",Json, { 'headers': headers })
    }
  }  

  public getparticularallocation(type,allocation_id,year_trans,date_trans,pageNumber, pageSize) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    let urlvalue
    if(allocation_id==11){
    urlvalue=url+'pprservice/transaction_ratioallocation?type='+type+'&bs_id=65&cc_id=266'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans + '&page=' + pageNumber +'&frombscccode='+allocation_id

    }
    if(allocation_id==18){
    urlvalue=url+'pprservice/transaction_ratioallocation?type='+type+'&bs_id=73&cc_id=331'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans + '&page=' + pageNumber +'&frombscccode='+allocation_id

    }
    // let urlvalue = url + 'pprservice/allocation_fetch/0?frombscc='+allocation_id+'&month='+date_trans+'&year='+year_trans+'&type=Genrate';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public particularallocation(prokeyvalue){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    // let urlvalue = url + 'pprservice/allocation_fetch/0?frombscc=18&month=12&year=2021&type=Genrate';
    // let urlvalue = url + 'pprservice/allocation_fetch/'+prokeyvalue;
    let urlvalue = url + 'pprservice/allocation/'+prokeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public allocationfrom_amountcal() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/remsbased_allocation?type=otherthenrems&bs_code=73&cc_code=331&transactionmonth=10&transactionyear=2021';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public transfervalidation(year,month) {
    console.log("date",year,month)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/remsbased_allocation?type=otherthenrems&bs_code=73&cc_code=331'+'&transactionmonth='+month +'&transactionyear='+year;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public allocationfrom_techAllocation() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/tech_allocation?transactionmonth=10&transactionyear=2021';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public transferAllocation(year_trans,date_trans) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/tech_allocation?transactionmonth='+date_trans+'&transactionyear='+year_trans+'&bs_code=65&cc_code=266';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public allocationValue(Allocation,level_id,month,year): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let changeValue={
      "Allocation":Allocation
    }
    
    let Json = Object.assign({}, changeValue)
    // this.pprgetjsondata=typeco

    console.log("changeval=>",changeValue,Json)
    return this.http.post<any>(url + "pprservice/allocationtopp?level_id="+level_id+"&month="+month+"&year="+year,JSON.stringify(Json), { 'headers': headers })
  } 
  public getStatus(id_cost,status) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    // let urlvalue = url + 'pprservice/inactive_allocation/'+id_cost;
    let urlvalue = url + 'pprservice/implementry_status?query='+id_cost+'&status='+status;
    console.log("urlvalue=>",urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }  
  public getdata_level(level) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
  var changevaliue=  {
      finyear:"FY20-21",
      yearterm:"Monthly",
      divAmount:"L",
      branch_id:"",
      sectorname:"KVB SECTOR",
      bizname:"PBLG",
      bs_code:"12",
      cc_code:"100",
      expensegrp:["OTHER OPTNG EXPS"]
  // }
  //   let urlvalue = url + 'pprservice/fas_level_fetch'
  //   console.log("urlvalue=>",urlvalue)
  //   return this.http.post(urlvalue, {
  //     headers: new HttpHeaders()
  //       .set('Authorization', 'Token ' + token)
  //   }
  //   )
  }  
  return this.http.post<any>(url + "pprservice/fas_expenseGrp_fetch",JSON.stringify(level), { 'headers': headers })

}
public getdata_level4(level){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/fas_level_four",JSON.stringify(level), { 'headers': headers })

}
public getleveltwosummary(type): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  
  return this.http.post<any>(url + "pprservice/new_expensegrp_list",JSON.stringify(type), { 'headers': headers })
}
public expense_list(type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  return this.http.post<any>(url + "pprservice/fas_expense_fetch",this.pprgetjsondata, { 'headers': headers })
}
public subexpense_list(type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  return this.http.post<any>(url + "pprservice/fas_subcat_fetch",this.pprgetjsondata, { 'headers': headers })
}
public category_list(type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  return this.http.post<any>(url + "pprservice/fas_category_fetch",this.pprgetjsondata, { 'headers': headers })
}
public ppr_supplier(page,supplier_value){
  var supplier={
    "apexpense_id": 21,
    "apsubcat_id": 2379,
    "masterbusinesssegment_name": "PBLG",
    "sectorname": "KVB SECTOR",
    "finyear": "FY20-21",
    "bs_name": "",
    "cc_name": ""
}
const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  
// var urlvalue = url + 'pprservice/ppr_supplier_dropdown';
// return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown",supplier_value, { 'headers': headers })
return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown",supplier_value, { 'headers': headers })
// return this.http.post<any>(url + "venserv/search_suppliername?sup_id=&name=a" { 'headers': headers })
// const getToken = localStorage.getItem("sessionData")
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     let urlvalue = url + "venserv/supplier_list?&page="+page;
//     // console.log("urlvalue=>",urlvalue)
//     return this.http.get(urlvalue, {
//       headers: new HttpHeaders()
//         .set('Authorization', 'Token ' + token)
//     }
//     )
    
}
public ppr_getall_supplier(page,query){
const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = url + "pprservice/supplier_list?page="+page+"&query="+query;
    // console.log("urlvalue=>",urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
}
public ppr_supplier_filter(val,page){
  var supplier={
    "apexpense_id": 21,
    "apsubcat_id": 2379,
    "masterbusinesssegment_name": "PBLG",
    "sectorname": "KVB SECTOR",
    "finyear": "FY20-21",
    "bs_name": "",
    "cc_name": ""
}
const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
// var urlvalue = url + 'pprservice/ppr_supplier_dropdown';
// return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown",supplier_value, { 'headers': headers })
return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown?query="+val,supplier, { 'headers': headers })

    
}
public allocation_values(allocation_name,year_trans,date_trans,allocation_id) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue
  // if (query === null) {
  //   query = "";
  //   console.log('calling empty');
  // }
  if(allocation_id==11){
   urlvalue = url + 'pprservice/transaction_ratioallocation?allocationto_ppr=Genrate&type='+allocation_name+'&bs_id=65&cc_id=266'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans+'&frombscccode='+allocation_id;

  }
  if(allocation_id==18){
     urlvalue = url + 'pprservice/transaction_ratioallocation?allocationto_ppr=Genrate&type='+allocation_name+'&bs_id=73&cc_id=331'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans+'&frombscccode='+allocation_id;

  }
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

// employee business mapping api's
public get_finyear(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null || query===undefined) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/emp_bus_map_finyear?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public get_employee(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/searchemployee?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public get_business(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/businesssegment?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public getsummary(branch_id,chipSelectedid,finyearid,statusVal,branchsearchid,pageNumber,pageSize): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
 console.log("chipSelectedprodid=>",chipSelectedid)
 if (branch_id === null || branch_id==undefined ) {
  branch_id = "";
  console.log('calling empty');
}
if (chipSelectedid === null || chipSelectedid==undefined ) {
  chipSelectedid = "";
  console.log('calling empty');
}
if (finyearid === null || finyearid==undefined ) {
  finyearid = "";
  console.log('calling empty');
}
if (statusVal === null || statusVal==undefined ) {
  statusVal = "";
  console.log('calling empty');
}
if (branchsearchid === null || branchsearchid==undefined ) {
  branchsearchid = "";
  console.log('calling empty');
}
let params: any = new HttpParams();

params = params.append('page', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
//  let val=chipSelectedid
  let urlvalue = url + 'usrserv/emp_bus_map?bs_id='+branch_id+'&emp_id='+chipSelectedid+'&finyear='+finyearid+'&status='+statusVal+'&page='+pageNumber+'&branch='+branchsearchid;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
} 
public emp_bus(type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  return this.http.post<any>(url + "usrserv/emp_bus_map",this.pprgetjsondata, { 'headers': headers })
}
public get_status(query) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/get_emp_bus_map_status';
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )}

  public status_update(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(url + "usrserv/update_status_emp_bus_map",type, { 'headers': headers })
  }  
  public submit_subcat(supplier_value){
    
  const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
  // var urlvalue = url + 'pprservice/ppr_supplier_dropdown';
  return this.http.post<any>(url + "pprservice/budget_suppliergrp_list" ,supplier_value, { 'headers': headers })
  
      
  } 
  public status_filter() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/budget_view_status';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )}
    public budgetremarks(type): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      this.pprgetjsondata=type
      console.log(type)
      return this.http.post<any>(url + "pprservice/budget_remark",type, { 'headers': headers })
    }
    public getecf(type): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      this.pprgetjsondata=type
      console.log(type)
      

      return this.http.post<any>(url + "pprservice/ppr_ecf_filelist",type, { 'headers': headers })
    }
    public ecfdownload(filename,cr_no,invoiceheaderid,file_gid) {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      
      const headers = { 'Authorization': 'Token ' + token }
      // url +'docserv/document/download/Memo_118985?module=1'
      let urlvalue = url + 'pprservice/ppr_ecf_filedownload?filename='+filename+'&cr_no='+cr_no+'&file_gid='+file_gid+'&invoiceheaderid='+invoiceheaderid;
      
      

      
      return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
      )}
      public ppr_nac(time) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let urlvalue=url+'pprservice/ppr_nac_set_single';
        
        
        
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      }
      public ppr_activeclient_summary(pageNumber,pageSize) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let urlvalue=url+'pprservice/ppr_client_list?page='+pageNumber;
        
        
        
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      }
      public ppr_client_typelist(type,pagenumber,pageSize) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        // let urlvalue=url+'pprservice/income_header_amount?page='+pagenumber;
        // let urlvalue=url+'pprservice/income_amount_date?page='+pagenumber;
        let urlvalue=url+'pprservice/income_report'
        const headers = { 'Authorization': 'Token ' + token } 
    
        return this.http.post(urlvalue,type, { 'headers': headers }
        )
      }
      public asset_class_search(query) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let urlvalue=url+'pprservice/asset_class_search?query='+query;
        
        const headers = { 'Authorization': 'Token ' + token }
        
        
        return this.http.get(urlvalue, { 'headers': headers }
        )
      }
      public get_product_search(query,pageNumber) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        // let urlvalue=url+'mstserv/product_search?query='+query+'&page='+pageNumber;
        let urlvalue=url+'mstserv/create_bsproduct?query='+query+'&page='+pageNumber
        const headers = { 'Authorization': 'Token ' + token }
        
        
        return this.http.get(urlvalue, { 'headers': headers }
        )
      }
      public activeclientsearch(assectval,pageNumber,pageSize,): Observable<any> {
        this.reset();
        console.log("pageNumber=>",pageNumber)
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        this.pprgetjsondata=assectval
        return this.http.post<any>(url + "pprservice/ppr_client_date",this.pprgetjsondata, { 'headers': headers })
        // return this.http.post<any>(url + "pprservice/ppr_client_list",this.pprgetjsondata, { 'headers': headers })
      }
      public income_header_fetch(assectval,pageNumber,pageSize): Observable<any> {
        this.reset();
        console.log("pageNumber=>",pageNumber)
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        this.pprgetjsondata=assectval
        // return this.http.post<any>(url + "pprservice/income_header_fetch?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
        return this.http.post<any>(url + "pprservice/income_header_date?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
      }
     async income_grp_fetch(index,assectval) {
        this.reset();
        
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        this.pprgetjsondata=assectval
        if(index==4){
          const res:any= await this.http.post<any>(url + "pprservice/level_core_get",this.pprgetjsondata, { 'headers': headers }).toPromise()
          return res
        }
        if(index==0){
          const res:any= await this.http.post<any>(url + "pprservice/new_incomegrp_list",this.pprgetjsondata, { 'headers': headers }).toPromise()
          this.income=res
          return this.income
          // return this.http.post<any>(url + "pprservice/ppr_incomegrp_list",this.pprgetjsondata, { 'headers': headers })
       
        }
      }
      public income_fetch(assectval): Observable<any> {
        this.reset();
        
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        this.pprgetjsondata=assectval
        return this.http.post<any>(url + "pprservice/new_incomegrp_list",this.pprgetjsondata, { 'headers': headers })
        // return this.http.post<any>(url + "pprservice/ppr_incomegrp_list",this.pprgetjsondata, { 'headers': headers })
    
      }
      public income_head_fetch(income_head): Observable<any> {
        this.reset();
        
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        this.pprgetjsondata=income_head
        return this.http.post<any>(url + "pprservice/new_incomehead_list",this.pprgetjsondata, { 'headers': headers })
        // return this.http.post<any>(url + "pprservice/ppr_incomehead_list",this.pprgetjsondata, { 'headers': headers })
     
      }
      public income_cat_fetch(income_cat): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        this.pprgetjsondata=income_cat
        return this.http.post<any>(url + "pprservice/new_incomecat_list",this.pprgetjsondata, { 'headers': headers })
        // return this.http.post<any>(url + "pprservice/ppr_incomecat_list",this.pprgetjsondata, { 'headers': headers })
      
      }
      public income_subcat_fetch(income_subcat): Observable<any> {
        this.reset();
        
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        this.pprgetjsondata=income_subcat
        return this.http.post<any>(url + "pprservice/new_incomesubcat_list",this.pprgetjsondata, { 'headers': headers })
        // return this.http.post<any>(url + "pprservice/ppr_income_subcat_list",this.pprgetjsondata, { 'headers': headers })
      
      }
      public rm_client(type,query,asset_id,pagenumber): Observable<any>{
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let urlvalue=url+'pprservice/asset_class?type='+type+'&query='+query+'&assettype_id='+asset_id+'&page='+pagenumber;
        
        const headers = { 'Authorization': 'Token ' + token }
        
        
        return this.http.get(urlvalue, { 'headers': headers }
        )
      }
      public excel_download(assectval) {
        this.reset();
        let token = '';
        const getToken = localStorage.getItem("sessionData");
        if (getToken) {
          let tokenValue = JSON.parse(getToken);
          token = tokenValue.token
        }
        
        const headers = { 'Authorization': 'Token ' + token }      
        return this.http.post<any>(url + "pprservice/ppr_income_filedownload",assectval, { 'headers': headers, responseType: 'blob' as 'json' })
      }


  // ppr-source
  public set_pprsources(sources): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let source_data=sources
    // return this.http.post<any>(url + "pprservice/income_header_fetch?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/set_pprsources",source_data, { 'headers': headers })
  }
  public summary_pprsources_view(sources,pagenumber,pageSize): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let source_data=sources
    // return this.http.post<any>(url + "pprservice/income_header_fetch?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/pprsources_list?page="+pagenumber,source_data, { 'headers': headers })
  }
  public get_source_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/ppr_source_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_headgrp_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/ppr_headgrps_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_subgrp_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/ppr_subgrps_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_glsubgrp_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/ppr_glsubgrps_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public summary_headgrp_view(headgrp,pagenumber,pageSize): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let headgrp_data=headgrp
    console.log("headgrp_data=>",headgrp_data)
    return this.http.post<any>(url + "pprservice/ppr_headgrps_list?page="+pagenumber,headgrp_data, { 'headers': headers })
  }
  public set_headgrp(headgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let headgrp_data=headgrp
    console.log("headgrp_data=>",headgrp_data)
    return this.http.post<any>(url + "pprservice/set_head_groups",headgrp_data, { 'headers': headers })
  }
  public set_subgrp(subgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let subgrp_data=subgrp
    console.log("headgrp_data=>",subgrp_data)
    return this.http.post<any>(url + "pprservice/set_sub_groups",subgrp_data, { 'headers': headers })
  }
  public set_gl_subgroup(set_glsubgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let gl_sub_grp=set_glsubgrp
    console.log("headgrp_data=>",gl_sub_grp)
    return this.http.post<any>(url + "pprservice/set_gl_subgroup",gl_sub_grp, { 'headers': headers })
  }
  public summary_subgrp_view(subgrp,pagenumber): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let subgrp_data=subgrp
    console.log("headgrp_data=>",subgrp_data)
    return this.http.post<any>(url + "pprservice/ppr_subgrps_list?page="+pagenumber,subgrp_data, { 'headers': headers })
  }
  public summary_glsubgrp_view(subgrp,pagenumber): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let subgrp_data=subgrp
    console.log("headgrp_data=>",subgrp_data)
    return this.http.post<any>(url + "pprservice/ppr_gl_subgrp_list?page="+pagenumber,subgrp_data, { 'headers': headers })
  }
  public dss_report(dss_data): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dss_datas=dss_data
    console.log("headgrp_data=>",dss_datas)
    return this.http.post<any>(url + "pprservice/dssdate_level_list",dss_datas, { 'headers': headers })
  }
  activeclientupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'pprservice/fileupload_acti_clients',formdata,{ 'headers': header})
  }
  incomeupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'pprservice/income_upload',formdata,{ 'headers': header})
  }
  expanseupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'pprservice/expense_overall_upload',formdata,{ 'headers': header})
  }
  dssupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'pprservice/dss_upload',formdata,{ 'headers': header})
  }
  public otheropertingexpgrp(otherexpgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let expgr=otherexpgrp
    console.log("headgrp_data=>",expgr)
    return this.http.post<any>(url + "pprservice/ppr_expensegrp_list",expgr, { 'headers': headers })
  }
  public expheader(otherexpgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let expheader=otherexpgrp
    console.log("headgrp_data=>",expheader)
    return this.http.post<any>(url + "pprservice/ppr_expensehead_list",expheader, { 'headers': headers })
  }
  public expcategory(otherexpgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let expheader=otherexpgrp
    console.log("headgrp_data=>",expheader)
    return this.http.post<any>(url + "pprservice/ppr_category_list",expheader, { 'headers': headers })
  }
  public expsubcategory(otherexpgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let expheader=otherexpgrp
    console.log("headgrp_data=>",expheader)
    return this.http.post<any>(url + "pprservice/ppr_subcategory_list",expheader, { 'headers': headers })
  }
  public otheroperatingupload(otheroperating): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=otheroperating
    return this.http.post<any>(url + "pprservice/ppr_expense_overall_set",this.pprgetjsondata, { 'headers': headers })
  }  
  public allocation_list(transaction): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=transaction
    return this.http.post<any>(url + "pprservice/new_allocation_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public trancationinsert(transaction): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=transaction
    return this.http.post<any>(url + "pprservice/new_allocation_pprinsert",this.pprgetjsondata, { 'headers': headers })
  } 
  // expgrp level mapping

  
  public expgrpmappingsummary(id,page) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = url + 'pprservice/level_create?level='+id+'&page='+page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 
  public expgrp_mapping(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=type
    console.log(type)
    return this.http.post<any>(url + "pprservice/level_create",type, { 'headers': headers })
  }
  public expgrpdelete(id,status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.delete<any>(url + 'pprservice/level/'+id+'?status='+status, { 'headers': headers })
  }
  public get_profitability_report(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const income_expense_api=this.http.post<any>(url + "pprservice/subcatwise_expensegrp_list",params, { 'headers': headers })
    return income_expense_api;
  }
  public get_profitability_head(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const income_expense_api=this.http.post<any>(url + "pprservice/subcatwise_expensehead_list",params, { 'headers': headers })
    return income_expense_api;
  }
  public get_profitability_cat(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const income_expense_api=this.http.post<any>(url + "pprservice/subcatwise_cat_list",params, { 'headers': headers })
    return income_expense_api;
  }
  public get_profitability_subcat(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const income_expense_api=this.http.post<any>(url + "pprservice/subcatwise_subcat_list",params, { 'headers': headers })
    return income_expense_api;
  }
  public get_profitability_allocation(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const income_expense_api=this.http.post<any>(url + "pprservice/level_core_get",params, { 'headers': headers })
    return income_expense_api;
  }
}
