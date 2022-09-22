import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { faShareService } from './share.service';
import { environment } from 'src/environments/environment';
import { data } from 'jquery';

// const faUrl = "http://34.68.45.66:9001/"
const faUrl = environment.apiURL



@Injectable({
  providedIn: 'root'
})
export class faservice {
  category_id: number;


  constructor(private http_p:HttpClient,private http: HttpClient, private idle: Idle, private share: faShareService,private backend:HttpBackend) { 
    this.http=new HttpClient(this.backend);
  }
  idleState = 'Not started.';
  timedOut = false;
  reset() {

    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getassetcategorysummary(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "faserv/assetcat?page=" + pageNumber, { 'headers': headers })
  }

  // asset checke view
  public getassetcategorysummaryadd(d: any,page:any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "faserv/assetchecker_view?"+d +"&page="+page, { 'headers': headers })
  }

  public getassetcategorysummaryaddgrp(d: any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "faserv/assetchecker_view_nongrp?" + d, { 'headers': headers })
  }



  // this is bs api call
  public getassetbsdata(keyvalue, page: number): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http_p.get<any>(faUrl + 'mstserv/searchbusinesssegment?query=' + keyvalue + '&page=' + page, { 'headers': headers });
   

  }
  // this is cc api call
  public getassetccdata(data: number): Observable<any> {
    console.log('d=', data)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    let d = { 'businesssegment_id': data }
    return this.http_p.post<any>(faUrl + "mstserv/search_ccbs", d, { 'headers': headers });

  }
  // this is assetcat branch details
  public getassetbranchdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http_p.get<any>(faUrl + "usrserv/search_employeebranch?query=" + value + "&page=" + page, { 'headers': headers });

  }
  // this is assetcat location
  public getassetlocationdata(data: number): Observable<any> {

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log(token)
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    let p = { "data": data }
    return this.http_p.get<any>(faUrl + "faserv/assetlocation?query=" + data, { 'headers': headers });

  }
  // ap category
  public getassetcategorydata(data: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http_p.get<any>(faUrl + "mstserv/Apcategory_search_fa?page=" + page + "&query=" + data, { 'headers': headers });

  }
  // asset subcategory
  public getassetsubcategoryccdata(data: string, id): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http_p.get<any>(faUrl + "mstserv/Apsubcategory_search?category_id=" + id + "&query=" + data, { 'headers': headers });

  }


  ///newly added 10-09-2021
  public getassetfinaldata(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log("service=", data);
    return this.http.post<any>(faUrl + "faserv/create_assetdetails", data, { 'headers': headers });

  }

  public search_employeebranch(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(faUrl + 'usrserv/search_employeebranch?query=' + empkeyvalue, { 'headers': headers })
  }
  // new branch location added 
  public getassetdatalocation(data: any): Observable<any> {
    console.log('location=', data);
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(faUrl + "faserv/assetlocation", data, { 'headers': headers });

  }
  //this is product select
  public getassetproductdata(data: string, page): Observable<any> {
    console.log('product=', data);
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "mstserv/product_search?page=" + page + "&query=" + data, { 'headers': headers });

  }
  // this is asset subcategory select
  public getassetcategory(data: string): Observable<any> {
    console.log('product=', data);
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http_p.get<any>(faUrl + "faserv/assetcat?subcatname=" + data, { 'headers': headers });

  }


  public assetcatCreateForm(assetcatJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("assetcatJson", assetcatJson)
    return this.http.post<any>(faUrl + "faserv/assetcat", assetcatJson, { 'headers': headers })

  }
  public getapcat(apcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'mstserv/Apcategory_search?query=' + apcatkeyvalue;
    // console.log(urlvalue);
    return this.http_p.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }
  public getapcatt(apcatkeyvalue,page:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'faserv/assetgroup?query=' + apcatkeyvalue+"&page="+page;
    // console.log(urlvalue);
    return this.http_p.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }
  public getapcattreverse(apcatkeyvalue,page:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'faserv/fetch_assetgroup_id?query=' + apcatkeyvalue+"&page="+page;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }
  public getapcatid(apcatkeyvalue: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'faserv/fetch_asset_id?assetgroup_id=' + apcatkeyvalue;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }


  public getsubcat(id: number, subcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (subcatkeyvalue === null) {
      subcatkeyvalue = "";
      console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(faUrl + 'mstserv/Apsubcategory_search?category_id=' + id + '&query=' + subcatkeyvalue, { headers, params })
  }




  // return this.http.get<any>(faUrl +'mstserv/Apsubcategory_search?query='+ subcatkeyvalue +'&category_id='+id, { headers,params})

  public depCreateForm(depcatJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("depcatJson", depcatJson)
    return this.http.post<any>(faUrl + "faserv/depreciationsetting", depcatJson, { 'headers': headers })

  }

  public queryget(data, page, pagesize, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/faquery_get?page=" + page + "&pagesize=" + pagesize + "&type=" + type, data, { 'headers': headers })

  }

  public queryverisonget(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + "faserv/faquery_version", { 'headers': headers })

  }

  public Assetparentchildsummary(page, type, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/clumbmakerparentchildget/?page=" + page + "&type=" + type, data, { 'headers': headers })

  }

  public clubmakerupdate(data, type) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/clubmakerupdate/?type=" + type, data, { 'headers': headers })

  }
  public clubmakerget(data, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/Assetclubget?page=" + page, data, { 'headers': headers })

  }
  async getchilddetails(page, parentid) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return await this.http.get<any>(faUrl + "faserv/getparentchild/" + parentid + "?page=" + page, { 'headers': headers }).toPromise();

  }
  public subcategorysearch(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "mstserv/subcategorysearch", data, { 'headers': headers })

  }

  public accounting_ddl(barcode) {
    this.reset();

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + "entryserv/fetch_commonentrydetails/" + barcode, { 'headers': headers })


  }

  public getsubcatid(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'mstserv/Apsubcategory', { 'headers': headers })
  }


  public getapsubcatsearch(ssubcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (ssubcatkeyvalue === null) {
      ssubcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'mstserv/Apsubcat_search?query=' + ssubcatkeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public getsummarySearch(a, b): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (a === undefined) {
      a = "";
      console.log('calling empty');
    }
    if (b === "") {
      b = "";
      console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + 'faserv/assetcat?subcatname=' + a + '&deptype=' + b, { 'headers': headers })
  }



  public getassetlocationsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetlocation?page=" + pageNumber, { 'headers': headers })
  }


  public assetlocCreateForm(assetlocJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("assetlocJson", assetlocJson)
    return this.http.post<any>(faUrl + "faserv/assetlocation", assetlocJson, { 'headers': headers })

  }
  public faunlockdata(assetlocJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("assetlocJson", assetlocJson)
    return this.http.post<any>(faUrl + "faserv/clearingheader_unlock", assetlocJson, { 'headers': headers })

  }


  public getassetmakerbsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetcat?page=" + pageNumber, { 'headers': headers })
  }

  public getassetmakerregsummary(pageNumber = 1, pageSize = 10, dear: any): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log('service=', dear);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString()); // 
    // return this.http.get<any>(faUrl + "faserv/clearingheader?" + "page=" + pageNumber + "&Doc_type=" + dear['Doc_Type'] + "&Is_Grp=" + dear['Is_Grp'], { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/clearingheader?"+ dear['page'], { 'headers': headers })
 
    }

  a: any
  public getassetmakerwbCWIPsummary(pageNumber = 1, pageSize = 10, data: any): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/clearingheader?" + "page=" + pageNumber + "&Doc_type=" + data['Doc_Type'] + "&Is_Grp=" + data['Is_Grp'], { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/clearingheader?"+ data['page'], { 'headers': headers })
  
  }
  // [(ngModel)]="checkedValuesbuc[i]"

  public getassetmakerwbBUCsummary(pageNumber = 1, pageSize = 10, data: any): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/clearingheader?" + "page=" + pageNumber + "&Doc_type=" + data['Doc_Type'] + "&Is_Grp=" + data['Is_Grp'], { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/clearingheader?" +data['page'], { 'headers': headers })
  
  }


  public getinvoicesummary_1(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetcat?page=" + pageNumber, { 'headers': headers })
  }

  public getinvoicesummary(id: any): Observable<any> {
    // this.reset();
    console.log('function caled');
    console.log(id)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/clearingheaderdetails?clearing_header_id=" + id, { 'headers': headers })
  }

  // Newly Added
  // Newly Added

  public getcheckersumrepost(data: any) {
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    console.log(tokenValue);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + "faserv/farepostentry" , data , { 'headers': headers })

  }

  public getcheckerapprover(data: any) {
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/assetchecker_approve' ,data, { 'headers': headers });
  }

  public getcheckerreject(data: any,reason:any) {
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get(faUrl + 'faserv/assetchecker_reject?assetdetails_id='+ data+'&reason='+reason, { 'headers': headers });
  }


  public getcpdatesummary(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    //+ page+data['assetid']+data['asset_value']+data['category']+data['branch']+data['capdate']
    return this.http.get(faUrl + 'faserv/capdatesummary?'+ data['page'] , { 'headers': headers });
  }

  public getcpdateaddsummary(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get(faUrl + 'faserv/capdatemakersummary?'+data['page'], { 'headers': headers });

  }
  public getcpdateaddapprove(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/capdatechangemake', data, { 'headers': headers });

  }
  public getcpdatecheckerapprove(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log(data['page'])
    return this.http.get(faUrl + 'faserv/capdatechangechecksum?'+data['page'] , { 'headers': headers });

  }

  public getcpdatecheckerfinalappove(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/capdatechangecheck', data, { 'headers': headers });

  }
  public getcpdatecheckerfinalreject(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/capdatechangecheck', data, { 'headers': headers });

  }
  public getcpdatecheckerassetid(data: any, page) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http_p.get(faUrl + 'faserv/assetdetails_id?page=' + page + '&query=' + data, { 'headers': headers });

  }



  public bucket(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'faserv/doctype', { 'headers': headers })
  }


  // public bucCreateForm(bucJson): Observable<any> {
  //   // this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   if (bucJson.doctype==="REGULAR"){
  //     bucJson.doctype.text===1
  //   }
  //   if (bucJson.doctype.text==="CWIP"){
  //     bucJson.doctype.text===2
  //   }
  //   if (bucJson.doctype.text==="BUC"){
  //     bucJson.doctype.text===3
  //   }
  //   const headers = { 'Authorization': 'Token ' + token }
  //   console.log("bucJson", bucJson)
  //   return this.http.post<any>(faUrl + "faserv/cwipgroup", bucJson, { 'headers': headers })

  // }
  buJson: any;
  public bucCreateForm(bucJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    if (bucJson.doctype === "REGULAR") {
      let value: any = {
        "name": bucJson.name,
        "doctype": 1,

      }
      this.buJson = value
    }
    else if (bucJson.doctype === "CWIP") {
      let value: any = {
        "name": bucJson.name,
        "doctype": 2,

      }
      this.buJson = value
    }
    else if (bucJson.doctype === "BUC") {
      let value: any = {
        "name": bucJson.name,
        "doctype": 3,

      }
      this.buJson = value;
    }

    const headers = { 'Authorization': 'Token ' + token }
    console.log("bucJson", this.buJson)
    // return this.http.post<any>(faUrl + "faserv/cwipgroup", this.buJson, { 'headers': headers })
    return this.http.post<any>(faUrl + "faserv/clearancebucket", this.buJson, { 'headers': headers })

  }


  public bucketnameSearch(bucvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(faUrl + 'faserv/cwipgroup?query=' + bucvalue, { 'headers': headers })
  }
  bucnameJson: any
  aa: any
  public bucnameCreateForm(bucnameJson): Observable<any> {
    this.aa = this.share.checklist.value
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // this.aa.push(1)

    // let value: any = {
    //   "FA_CltHeader_Updateids": this.aa,
    //   "FaClrance_GrpName": bucnameJson.bucketname,

    // }
    // this.bucnameJson = value



    const headers = { 'Authorization': 'Token ' + token }
    console.log("bucnameJson", bucnameJson)
    return this.http.post<any>(faUrl + "faserv/movetobucket", bucnameJson, { 'headers': headers })

  }

  public getassetmakersummarySearch(b, a): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (a === undefined) {
      a = "";
      console.log('calling empty');
    }
    if (b === "") {
      b = "";
      console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + 'faserv/clearingdetails?doctype=' + 2 + '&invno=' + b + '&invdate=' + a, { 'headers': headers })
  }

  public getassetCatdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http_p.get<any>(faUrl + "faserv/assetcat?subcatname=" + value + "&page=" + page, { 'headers': headers });

  }
  // pv start

  public getassetdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(faUrl+'faserv/records', { 'params': params });

  }

  public getbranchdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "faserv/fetch_branch_list?query=" + value + "&page=" + page, { 'headers': headers });

  }

  // api fa_pv_assest_search
  public getassetsearch(query): Observable<any> {
    let data: any = { 'barcode': query }
    console.log(query)
    console.log(data)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl+'faserv/filter_records', data, { 'headers': headers });
  }

  // api fa_pv_branch_search
  public getbranchsearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(faUrl + 'usrserv/search_employeebranch?page=' + page + '&query=' + query, { 'headers': headers })
  }
  public getcategotysearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http_p.get<any>(faUrl + 'faserv/categoryname_search?page=' + page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchdosearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/controlling_office_branch_do?page='+page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchpv(query:any,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+'faserv/filter_records?page='+pageNumber+'&branch='+query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchsearchscroll(query,page): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/search_employeebranch?page=' + page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchdosearchscroll(query,page): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/controlling_office_branch_do?page='+page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_getdata
  public getassetdata1(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records?page=" + pageNumber+'&init='+search, { 'headers': headers });
  }

  // api fa_pv_search
  public getassetdata2(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records?page=" + pageNumber+search, { 'headers': headers });
  }

  // api fa_pv_search
  public getassetdataedit(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/assetedit_records?page=" + pageNumber+search, { 'headers': headers });
  }

  // api fa_pv_insertdata
  public getassetsave(data: any): Observable<any> {
    // let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl+'faserv/assetupdate', data, { 'headers': headers });
  }

  //api fa_pv image
  public getassetsave1(data: any): Observable<any> {
    // let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl+'faserv/assetupdate1', data, { 'headers': headers });
  }

  // api fa_pv_insertdata
  public getassetrowsave(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/add_row', data, { 'headers': headers });
  }
  // api fa_pv_insertdata
  public getassetrowsave1(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/add_row1', data, { 'headers': headers });
  }

  // api fa_pv_insertdata
  public getassetrowupdate(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/update_pv', data, { 'headers': headers });
  }

  public getassetrowupdate1(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/update_pv1', data, { 'headers': headers });
  }
  public assetheaderupdate(id:any,data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/asset_header_update/'+id, data, { 'headers': headers });
  }

  public getasset1(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+"faserv/assetdetails", { 'headers': headers });
  }

  // api approver_getdata
  public getapprover(pageNumber,search,cat:any): Observable<any> {
    console.log('get_branch',search)
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/branchfilter?page="+ pageNumber+'&init='+search+'&cat='+cat, { 'headers': headers });

  }

    // api approver_getdata
    public getapprover1(pageNumber,search): Observable<any> {
      console.log('get',search)
      let params: any = new HttpParams();
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(faUrl + "faserv/branchupdate?page="+ pageNumber+'&init='+search, { 'headers': headers });
  
    }
  

  // api save data approver
  public getapprover_data(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('fa',data)
    return this.http.post<any>(faUrl + "faserv/approver_save", data, { 'headers': headers });
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/branchfilter?page='+pageNumber+'&branch='+query, {'headers': headers});
  }

    // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover1(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/branchupdate?page='+pageNumber+'&branch='+query, {'headers': headers});
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover2(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_full?page='+pageNumber+'&ctrl_branch='+query, {'headers': headers});
  }

  public getbackin_pv(pageNumber, pageSize,search:any,cat:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/branchfilter?page=" + pageNumber+'&init='+search+'&cat='+cat, { 'headers': headers });
  }

  public getbackin_DoPV(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/approver_full?page=" + pageNumber+'&ctrl_branch='+search, { 'headers': headers });
  }
  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover3(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_branch?page='+pageNumber+'&ctrl_branch='+query, {'headers': headers});
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchselect(query: string,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_full?page='+pageNumber+'&branch='+query, {'headers': headers});
  }
  
  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapproverbranch1(query: string,pageNumber): Observable<any> {
    console.log('second',query)
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_branch?page='+pageNumber+'&branch='+query, {'headers': headers});
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapproverfull1(query: string,pageNumber): Observable<any> {
    console.log('second',query)
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_full?page='+pageNumber+'&branch='+query, {'headers': headers});
  }


  //api approver branch download 
  public getApproverBranchDownload():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/branchfile_download?branch=", {'headers': headers,responseType: 'blob' as 'json'})
  }
  public getalldownloadfarepotrs():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/report_far", {'headers': headers,responseType: 'blob' as 'json'})
  }

  //api approver full download 
  public getApproverFullDownload():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/fullfile_download?branch=", {'headers': headers,responseType: 'blob' as 'json'})
  }

  //api approver branch download 
  public getApproverBranchDownload1(data):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/branchfile_download?ctrl_branch="+data, {'headers': headers,responseType: 'blob' as 'json'})
  }

  //api approver full download 
  public getApproverFullDownload1(data):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/fullfile_download?ctrl_branch="+data, {'headers': headers,responseType: 'blob' as 'json'})
  }
  public getassetcategorysummary1(page = 1, d: any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', page.toString());
    // params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/assetcat?page=" + page, { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/assetchecksummary?" +d['page'], { 'headers': headers })
  }
  public getassetsummarydata(data:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/summary_assetdetails?"+data['page'],{'headers':headers});
  };
  public getassetsuppliername(data:any,page:number){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http_p.get(faUrl+"venserv/search_supplier_name?name="+data+"&page="+page,{'headers':headers});
  };
  public getbucketsummary(data:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/bucketsummary?page=1",{'headers':headers});
  };
  public getbucketsummarysearch(data:any,page:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/bucketnamesearch?data="+data+"&page="+page,{'headers':headers});
  };
  public getassetcategorynew(data: string,page:number): Observable<any> {
    console.log('product=', data);
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http_p.get<any>(faUrl + "faserv/assetcat?subcatname=" + data+"&page="+page, { 'headers': headers });

  }

// -
// api depreciation_cal
public getdepreciation(pageNumber = 1, pageSize = 10):Observable<any>{
  let params: any = new HttpParams();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/depreciation?page="+pageNumber,{'headers':headers });
}

// api depreciation_cal_prepare
public getDepreciationPrepare(data1,data2):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
    const requestOptions: Object = {
    'from_date': data1,
    'to_date': data2,
    'calculate_for': "ALL",
    'deptype':"1"
  }
  return this.http.post<any>(faUrl + "faserv/depreciation",requestOptions,{'headers':headers });
}

 // api depreciation_cal_prepare
 public getDepreciationCal(str1,str2,radioFlag):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
    const requestOptions: Object = {
    'from_date': str1,
    'to_date': str2,
    'calculate_for': 'ALL',
    'deptype': radioFlag
  }
  console.log('download ',requestOptions)
  return this.http.post<any>(faUrl + "faserv/depreciation",requestOptions,{'headers':headers });
}

 // api depreciation_cal_Forecastexcel_prepare
 public getDepreciationForecastPrepare(year='',month=''):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/report_depreciation?year="+year+'&month='+month,{ 'headers': headers  });
}

 // api depreciation_cal_Regularexcel_prepare
 public getDepreciationRegularPrepare(year='',month=''):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/report_depreciation_regular?year="+year+"&month="+month,{ 'headers': headers });
}

public getassetsource():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/faquery_get_source",{ 'headers': headers });
}

//temp forecast download
 public getDepreciationTempForecastPrepare():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/temp_forecast",{ 'headers': headers,responseType: 'blob' as 'json'  });
}

//temp regular download
public getDepreciationTempRegularPrepare():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/temp_regular",{ 'headers': headers,responseType: 'blob' as 'json'  });
}

// api depreciation_cal_Forecastexcel_download
public getDepreciationForecastDownload():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/download_forecast",{ 'headers': headers,responseType: 'blob' as 'json'  });
}

// api depreciation_cal_Regularexcel_download
public getDepreciationRegularDownload():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/download_regular",{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public downloadfile(data, page, pagesize, type) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  console.log('dear=,', data);
  let http:any=new HttpClient(this.backend);
  return http.post(faUrl + "faserv/faquery_get_download?page=" + page + "&pagesize=" + pagesize + "&type=" + type, data, { 'headers': headers ,responseType: 'blob' as 'json'});

}
public downloadfile_depreciation() {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  console.log('dear=,', data)
  return this.http.get(faUrl + "faserv/itdepreciation" , { 'headers': headers ,responseType: 'blob' as 'json'});

}
public getemployeemappingpv( page) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // console.log('dear=,', data)
  return this.http.get(faUrl + "faserv/asset_emp_map?page=" + page , { 'headers': headers});

}
public getemployeemappingfamakesum( page,barcode_id) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // console.log('dear=,', data)
  return this.http.get(faUrl + "faserv/asset_emp_map?query="+barcode_id+"&page=" + page , { 'headers': headers});

}
public getemployeemappingpv_search( page) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // console.log('dear=,', data)
  return this.http.get(faUrl + "faserv/asset_emp_map"+page , { 'headers': headers });

}
public getemployeemappingpvcreate( data) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // console.log('dear=,', data)
  return this.http.post(faUrl + "faserv/asset_emp_map",data , { 'headers': headers});

}
public getemployeemappingpvactive( data) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // console.log('dear=,', data)
  return this.http.post(faUrl + "faserv/asset_map_activate_inactivate",data , { 'headers': headers});

}
public getemployeedropdown( data:any,page:any) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // console.log('dear=,', data)
  return this.http_p.get(faUrl + "usrserv/fetch_emp_dropdown?page="+page+'&data='+data , { 'headers': headers });

}
// api depreciation_cal_prepare
public getDepreciationCalIT(str1):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
    const requestOptions: Object = {
    'from_date': str1
  }
  console.log('download ',requestOptions)
  return this.http.post<any>(faUrl + "faserv/itdepreciation",requestOptions,{'headers':headers });
}
public getemployeeFKdd(empkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http_p.get<any>(faUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
}
public getfaupload(data:any):Observable<any>{
  const getToken=localStorage.getItem('sessionData');
  let tokenValue=JSON.parse(getToken);
  let token=tokenValue.token;
  const headers={'Authorization': 'Token ' +token};
  return this.http.post<any>(faUrl + "faserv/fa_upload_file" ,data, { 'headers': headers })

}
public getassetcategorydata_expence(data: string, page): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('filter', filter);
  // params = params.append('sortOrder', sortOrder);
  // params = params.append('page', pageNumber.toString());
  // params = params.append('pageSize', pageSize.toString());

  return this.http.get<any>(faUrl + "mstserv/Apcategory_search_faexp?page=" + page + "&query=" + data, { 'headers': headers });

}
}










