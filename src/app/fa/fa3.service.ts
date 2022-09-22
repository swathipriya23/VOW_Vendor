import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpParams } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

const atmaUrl = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class Fa3Service {
  idleState = 'Not started.';
  timedOut = false;
  taxJson: any;

  constructor(private http_p:HttpClient,private http: HttpClient, private idle: Idle,private httpBackend:HttpBackend ) {
    this.http=new HttpClient(this.httpBackend);
   }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getAssetValueChange(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let val={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/assetvaluechange?page=' + pageNumber, search,{ 'headers': headers })
  }
  public getAssetDetailsValueChange(pageNumber = 1, pageSize = 10,search): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/valuechange?page=' + pageNumber,search,{ 'headers': headers })
  }
  public assetValuChange(vendor: any, reason,date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let changeValue = {
      "assetdetails":vendor,
      "valuechange_date":date,
      "reason":reason,
    }
    
  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)    
    return this.http.post<any>(atmaUrl + "faserv/valuechange_assetdetails", JSON.stringify(Json), { 'headers': headers })
  }
  
  public getCheckerSummary(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let data={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/valuechange_checker?page=' + pageNumber,search,{ 'headers': headers })
  }
  public valuechange_approve(vendor: any, reason): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let changeValue = {
      "assetdetails":vendor,
      "reason":reason,
    }
    // console.log("change",changeValue)
  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)
  
  
    
    return this.http.post<any>(atmaUrl + "faserv/valuechange_approve", JSON.stringify(Json), { 'headers': headers })
  }
  public valuechange_reject(vendor: any, reason): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let changeValue = {
      "assetdetails":vendor,
      "reason":reason,
    }
    // console.log("change",changeValue)
  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)
  
  
    
    return this.http.post<any>(atmaUrl + "faserv/valuechange_reject", JSON.stringify(Json), { 'headers': headers })
  }
  public getAssetdetailsValueChange(pageNumber = 1, pageSize = 10): Observable<any> {
   let search={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/valuechange?page=' + pageNumber,search,{ 'headers': headers })
  }
  
  public getAssetTransfer(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let AssetTran={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/get_assettransfer?page=' +pageNumber,search,{ 'headers': headers })
  }
  
  public fetch_assettransfer(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let AssetTran={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/fetch_assettransfer?page=' +pageNumber,search,{ 'headers': headers })
  }
  
  public getbusinesssegmentfilter(name,pageno): Observable<any> {
    let no=""
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("name",name,"no",no)
    return this.http_p.get<any>(atmaUrl + 'mstserv/businesssegmentsearch?page=' + pageno + '&name=' + name + '&no=' + no, { 'headers': headers })
  }
  
  public getcostcentrefilter(bsid,name): Observable<any> {
    
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("name",bsid,"no",name)
    return this.http_p.get<any>(atmaUrl + 'mstserv/searchbs_cc?bs_id=' + bsid + '&query=' + name, { 'headers': headers })
  }
  
  public getassetlocationfilter(pageno,name): Observable<any> {
    
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("name",pageno,"no",name)
    return this.http.get<any>(atmaUrl + 'assetlocation?page=' + pageno + '&query=' + name, { 'headers': headers })
  }
  public getlocationfilter(pageno,name): Observable<any> { 
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("name",pageno,"no",name)
    return this.http_p.get<any>(atmaUrl + 'faserv/assetlocation?page=' + pageno + '&query=' + name, { 'headers': headers })
  }
  
  
  public assettranfer(vendor: any, reason,date,empid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let changeValue = {
      "assetdetails":vendor,
      "reason":reason,
      "assettransfer_date":date,
      'empid':empid
    };
    // console.log("change",changeValue)
  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)
  
    // let formData = new FormData();
    // formData.append("data",JSON.stringify(Json))
    // console.log("json",JSON.stringify(Json))
    // console.log("form",formData)
    
    return this.http.post<any>(atmaUrl + "faserv/assettransfer", JSON.stringify(Json), { 'headers': headers })
  }
  public assettranfersummary(pageNumber = 1, pageSize = 10,search): Observable<any> {
    // let AssetTran={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/get_assettransferchecker?page='+pageNumber,search,{ 'headers': headers })
  }
  
  public assettransfer_approve(vendor: any, reason): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let changeValue = {
      "assetdetails":vendor,
      "reason":reason,
    }
    // console.log("change",changeValue)
  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)
  
  
    
    return this.http.post<any>(atmaUrl + "faserv/assettransfer_approve", JSON.stringify(Json), { 'headers': headers })
  }
  public getEmployeeBranchSearchFilter(branchval,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(atmaUrl + 'usrserv/search_employeebranch?query=' + branchval + '&page=' + pageno, { 'headers': headers })
  }
  public getAssetSearchFilter(subcatname,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(atmaUrl + 'faserv/assetcat?subcatname=' + subcatname + '&page=' + pageno, { 'headers': headers })
  }
  public getAssetIdSearchFilter(barcode,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(atmaUrl + 'faserv/assetdetails?barcode=' + barcode + '&page=' + pageno, { 'headers': headers })
  }

  public getCategoryChange(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let value={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/get_categorychange?page='+pageNumber , search,{ 'headers': headers })
  }
  
  public getcategorychangeAdd(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let val={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log("getcategorychangeAdd")
   
    return this.http.post<any>(atmaUrl + 'faserv/fetch_categorychange?page='+pageNumber,search,{ 'headers': headers })
  }
  public assetCategoryChange(vendor: any, reason,date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let changeValue = {
      "assetdetails":vendor,
      "catchange_date":date,
      "reason":reason,
    }
    // console.log("change",changeValue)
  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)
  
    // let formData = new FormData();
    // formData.append("data",JSON.stringify(Json))
    // console.log("json",JSON.stringify(Json))
    // console.log("form",formData)
    
    return this.http.post<any>(atmaUrl + "faserv/categorychange", JSON.stringify(Json), { 'headers': headers })
  }


  public getCheckerChangeApproveSummary(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let data={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/get_catchangechecker' ,search,{ 'headers': headers })
  }

  public categorychangeapprove(vendor: any, reason): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let changeValue = {
      "assetdetails":vendor,
      "reason":reason,
    }  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)    
    return this.http.post<any>(atmaUrl + "faserv/catchange_approve", JSON.stringify(Json), { 'headers': headers })
  }

  public assetsalesadd(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let sales={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log("sales")
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/get_assetsale?page='+pageNumber,search,{ 'headers': headers })
  }
  public assetchange(salesValue: any, reason,date,customerid,salerate): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let changeValue = {
      "assetdetails":salesValue,
      "reason":reason,
      "assetsale_date":date,
      "customer_id":customerid,
      "is_salenote":salerate
    }  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)    
    return this.http.post<any>(atmaUrl + "faserv/assetsale", JSON.stringify(Json), { 'headers': headers })
  }


  public getCustomerFilter(subcatname,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(atmaUrl + 'mstserv/customer?page=' + pageno + '&name=' + subcatname, { 'headers': headers })
  }
  public getassetsale(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let value={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/fetch_assetsale?page='+pageNumber , search,{ 'headers': headers })
  }
  public assetsalesapprove(pageNumber = 1, pageSize = 10,search): Observable<any> {
    let value={}
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.post<any>(atmaUrl + 'faserv/get_assetsalechecker?page='+pageNumber , search,{ 'headers': headers })
  }


  public assetsaleapprove(vendor: any, reason): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let changeValue = {
      "assetdetails":vendor,
      "reason":reason,
    }  
    let Json = Object.assign({}, changeValue)
    console.log("json",Json)    
    return this.http.post<any>(atmaUrl + "faserv/assetsaleapprove", JSON.stringify(Json), { 'headers': headers })
  }

  public getCustomerStateFilter(page:any,data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(atmaUrl + 'mstserv/state?page='+page+'&data='+data, { 'headers': headers })
  }

  public assetsaleadd(salesValue: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   console.log('sale',salesValue)
    let Json = Object.assign({}, salesValue)
    console.log("json",Json)    
    return this.http.post<any>(atmaUrl + "mstserv/customer", JSON.stringify(Json), { 'headers': headers })
  }


  public getpdfPO(poheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "faserv/assetsale_invoicepdf/" + poheaderid, { headers, responseType: 'blob' as 'json' })
  }
  public fileDownloadpo(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'faserv/assetsale_invoicepdf/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }
}