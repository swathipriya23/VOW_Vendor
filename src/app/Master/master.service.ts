import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';

const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class masterService {
  idleState = 'Not started.';
  timedOut = false;
  ComingFrom = '';
  permissionJson: any;
  constructor(private idle: Idle, private http: HttpClient) { }

  public ms_getCategoryList(filter = "", sortOrder = 'asc', pageNumber = 1, catkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(url + "memserv/user_category?page=" + pageNumber +"&query=" +catkeyvalue, { 'headers': headers })
  }


  public getSubCategoryList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10, categoryIdValue: number): Observable<any> {
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
    return this.http.get<any>(url + "memserv/category/" + categoryIdValue + "/subcategory?page=" + pageNumber, { 'headers': headers })
  }
  public getDepartmentList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "usrserv/department?page=" + pageNumber, { 'headers': headers })
  }
  public getRiskList_master(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(url + "mstserv/risktype?page=" + pageNumber, { 'headers': headers })
  }



  public getDocument(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(url + 'mstserv/Documenttype', { headers, params })
  }

  public getChannel(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(url + 'mstserv/channel', { headers, params })
  }

  public getCourier(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(url + 'mstserv/courier', { headers, params })
  }

  public getAccountList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "prfserv/accounts?page=" + pageNumber, { 'headers': headers })
  }

  public acctDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "prfserv/accounts/" + idValue, { 'headers': headers })

  }

  public getTemplateDD(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "prfserv/template?page=" + pageNumber, { 'headers': headers })
  }
  public templateDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "prfserv/template/" + idValue, { 'headers': headers })

  }
  public getCostCentreList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "usrserv/costcentre?page=" + pageNumber, { 'headers': headers })

  }
  public createCostCentreForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/costcentre", body, { 'headers': headers })

  }
  public costCentreEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("costcentreEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/costcentre", jsonValue, { 'headers': headers })

  }
  public getBusinessSegmentList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "usrserv/businesssegment?page=" + pageNumber, { 'headers': headers })
  }
  public createBusinessSegmentForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/businesssegment", body, { 'headers': headers })
  }
  public businessSegmentEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("businesssegmentEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/businesssegment", jsonValue, { 'headers': headers })

  }
  public getCCBSList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "usrserv/ccbsmapping?page=" + pageNumber, { 'headers': headers })
  }
  public getCostCentre(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "usrserv/costcentre", { 'headers': headers })
  }
  public getBusinessSegment(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "usrserv/businesssegment", { 'headers': headers })
  }
  public createCCBSMappingForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/ccbsmapping", body, { 'headers': headers })
  }
  public ccbsMappingEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("ccbsMappingEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/ccbsmapping", jsonValue, { 'headers': headers })

  }
  public getHierarchyList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(url + "usrserv/employeehierarchy?page=" + pageNumber+"&data="+pageSize, { 'headers': headers })
  }
  public createHierarchyForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/employeehierarchy", body, { 'headers': headers })
  }
  public hierarchyEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("hierarchyEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/employeehierarchy", jsonValue, { 'headers': headers })
  }
  public getContactList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "mstserv/contacttype?page=" + pageNumber, { 'headers': headers })
  }
  public createContactForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/contacttype", body, { 'headers': headers })
  }
  public contactEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("contactEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/contacttype", jsonValue, { 'headers': headers })
  }
  public contactDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/contacttype/" + idValue, { 'headers': headers })
  }
  public getDesignationList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize:any): Observable<any> {
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
    return this.http.get<any>( url + "mstserv/designation?page=" + pageNumber+'&data='+pageSize, { 'headers': headers })
  }
  public createDesignationForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/designation", body, { 'headers': headers })
  }
  public designationEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("designationEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/designation", jsonValue, { 'headers': headers })
  }
  public designationDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/designation/" + idValue, { 'headers': headers })
  }
  public getCountryList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "mstserv/country?page=" + pageNumber, { 'headers': headers })
  }
  public createCountryForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/country", body, { 'headers': headers })
  }
  public countryEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("countryEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/country", jsonValue, { 'headers': headers })
  }
  public countryDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/country/" + idValue, { 'headers': headers })
  }
  public getStateList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
  public createStateForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/state", body, { 'headers': headers })
  }
  public getCountry(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "mstserv/country", { 'headers': headers })
  }
  public stateEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("stateEditForm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/state", jsonValue, { 'headers': headers })

  }
  public stateDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/state/" + idValue, { 'headers': headers })
  }
  public getDistrictList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "mstserv/district?page=" + pageNumber, { 'headers': headers })
  }
  public createDistrictForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/district", body, { 'headers': headers })
  }
  public getState(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "mstserv/state", { 'headers': headers })
  }
  public districtEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("districtEditForm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/district", jsonValue, { 'headers': headers })

  }
  public districtDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/district/" + idValue, { 'headers': headers })
  }
  public getCityList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "mstserv/city?page=" + pageNumber, { 'headers': headers })
  }
  public createCityForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/city", body, { 'headers': headers })
  }
  public cityEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("cityEditForm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/city", jsonValue, { 'headers': headers })

  }
  public cityDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/city/" + idValue, { 'headers': headers })
  }


  public get_cityValue(citykeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (citykeyvalue === null) {
      citykeyvalue = "";
    }
    return this.http.get<any>(url + 'mstserv/new_city_search?query=' + citykeyvalue, { 'headers': headers })
   

  }
  public getStateSearch(statekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/state_search?query=' + statekeyvalue, { 'headers': headers })
  }
  public getDistrictDropDown(districtkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
    }

    return this.http.get<any>(url + 'mstserv/district_search?query=' + districtkeyvalue, { 'headers': headers })
   
  }

  public getPinCodeSearch(pincodekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/pincode_search?query=' + pincodekeyvalue, { 'headers': headers })
  }
  public getPincodeList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + "mstserv/pincode?page=" + pageNumber, { 'headers': headers })
  }
  public getCity(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "mstserv/city", { 'headers': headers })
  }
  public getDistrict(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "mstserv/district", { 'headers': headers })
  }
  public createPincodeForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/pincode", body, { 'headers': headers })
  }
  public pincodeEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("pincodeEditForm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "mstserv/pincode", jsonValue, { 'headers': headers })

  }
  public pincodeDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/pincode/" + idValue, { 'headers': headers })
  }
  public riskDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "mstserv/risktype/" + idValue, { 'headers': headers })
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  public getModulesList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "usrserv/usermodule", { 'headers': headers })
  }
  public getRolesList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "usrserv/role", { 'headers': headers })
  }
  public rolesEditForm(data: any, id: number): Observable<any> {
    this.reset();
    // console.log("rolesEditFormmm")
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(url + "usrserv/role", jsonValue, { 'headers': headers })
  }
  public getModule(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "usrserv/usermodule", { 'headers': headers })
  }
  public getRole(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "usrserv/role", { 'headers': headers })
  }
  public get_EmployeeList(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/searchemployee?query=' + empkeyvalue, { 'headers': headers })
  }
  public addPermission(json: any, empId: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (json.submodule_id) {
      let jsonValue: any = {
        "module_id": json.submodule_id,
        "role_id": json.role_id,
        "add": empId
      }
      this.permissionJson = jsonValue;
      // console.log("SUBModuid=-=-=", this.permissionJson)
    } else {
      let jsonValue = {
        "module_id": json.module_id,
        "role_id": json.role_id,
        "add": empId
      }
      this.permissionJson = jsonValue;
      // console.log("Moduid=-=-=", this.permissionJson)

    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'usrserv/permission', this.permissionJson, { 'headers': headers })
  }
  public removeEmployee(memojson: any, CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const Url = url + 'usrserv/permission'
    let json = Object.assign({}, memojson, CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", JSON.stringify(json))
    return this.http.post<any>(Url, json, { 'headers': headers })
  }



  public getEmployee(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(url + 'usrserv/employee?page=' + pageNumber, { 'headers': headers })
  }
  public getempactive(data:any){
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(url + "usrserv/employee_activate_inactivate",data,{ 'headers': headers });
  }
  public getPermissionList1(empid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/user_modules_admin/' + empid, { 'headers': headers })
  }

  public ms_getSubCategoryList1(filter = "", sortOrder = 'asc', pageNumber = 1, subcatkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(url + "memserv/user_subcategory?page=" + pageNumber +"&query=" +subcatkeyvalue, { 'headers': headers })
  }

  public removePermission(json: any,empId:number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let jsonValue: any = {
      "module_id": json.parent_id,
      "role_id": json.role_id,
      "remove": empId
    }
    return this.http.post<any>(url + 'usrserv/permission',jsonValue, { 'headers': headers })
  }

    ////////////////// bs
    public getbs(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      //console.log(params);
      //console.log(headers);
      return this.http.get<any>(url + "mstserv/businesssegmentlist?page=" + pageNumber, { 'headers': headers, params })
    }
  
    public BSCreateForm(bs: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(bs)
      //console.log("bs Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/businesssegment', data, { 'headers': headers })
    }
  
    public getBssearch(no, name): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let names = name
  
      for (let i in names) {
        if (!names[i]) {
          delete names[i];
        }
      }
      let nos = no
  
      for (let i in nos) {
        if (!nos[i]) {
          delete nos[i];
        }
      }
      return this.http.get<any>(url + 'mstserv/businesssegmentsearch?name=' + names + '&no=' + nos, { 'headers': headers })
    }
    public activeInactivebs(bsId, status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = bsId + '?status=' + status
      //console.log('data check for apcat active inactive', data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + "mstserv/businesssegmentstatus/" + bsId + '?status=' + status, { 'headers': headers })
    }
  
    ////////////////// CC
    public getcc(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      //console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "mstserv/costcentrelist?page=" + pageNumber, { 'headers': headers, params })
    }
  
    public getCCsearch(no, name): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let names = name
  
      for (let i in names) {
        if (!names[i]) {
          delete names[i];
        }
      }
      let nos = no
  
      for (let i in nos) {
        if (!nos[i]) {
          delete nos[i];
        }
      }
      return this.http.get<any>(url + 'mstserv/costcentresearch?name=' + names + '&no=' + nos, { 'headers': headers })
    }
    public getCCsearchoverall(no, name): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let names = name
  
      for (let i in names) {
        if (!names[i]) {
          delete names[i];
        }
      }
      let nos = no
  
      for (let i in nos) {
        if (!nos[i]) {
          delete nos[i];
        }
      }
      return this.http.get<any>(url + 'mstserv/costcentresearch_overall?name=' + names + '&no=' + nos, { 'headers': headers })
    }
  
    public CCCreateForm(cc: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(cc)
     // console.log("cc Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/costcentre', data, { 'headers': headers })
    }
  
    public activeInactivecc(ccId, status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = ccId + '?status=' + status
     // console.log('data check for apcat active inactive', data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + "mstserv/costcentrestatus/" + ccId + '?status=' + status, { 'headers': headers })
    }
    public getccBS(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "mstserv/ccbsmapping?page=" + pageNumber, { 'headers': headers, params })
    }
  
  
    public getbsvalue(bskeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + "usrserv/searchbusinesssegment?query=" + bskeyvalue, { 'headers': headers })
    }
    public getbsFKdd(bskeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno, { 'headers': headers })
    }
  
  
    public getccvalue(empkeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + "usrserv/searchcostcentre?query=" + empkeyvalue, { 'headers': headers })
    }
    public getccFKdd(empkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'usrserv/searchcostcentre?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
    }
  
    public ccbsCreateForm(ccbs: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(ccbs)
     // console.log("ccbs Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/ccbsmapping', data, { 'headers': headers })
    }
  
    public getCCBSsearch(searchccbs): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/search_ccbs', searchccbs, { 'headers': headers })
    }
    public getbsInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "mstserv/bslistinactive?page=" + pageNumber, { 'headers': headers, params })
    }
  
    public getbsactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "mstserv/bslistactive?page=" + pageNumber, { 'headers': headers, params })
    }
  
  
    public getccInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      //console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "mstserv/cclistinactive?page=" + pageNumber, { 'headers': headers, params })
    }
  
    public getccactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "mstserv/cclistactive?page=" + pageNumber, { 'headers': headers, params })
    }
    public getlistdepartment(pageNumber:any,data:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // let params: any = new HttpParams();
      // params = params.append('page', pageNumber.toString());
      // params = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "usrserv/employee_department?page="+pageNumber+"&data="+data, { 'headers': headers })
    }
    public getlistdepartmentsenoor(pageNumber:any,data:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // let params: any = new HttpParams();
      // params = params.append('page', pageNumber.toString());
      // params = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "usrserv/fetch_emp_dropdown?data="+data+"&page="+pageNumber, { 'headers': headers })
    }
    public getlistdepartmentcreate(data:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + "usrserv/employee",data, { 'headers': headers })
    }
    public getemployeebranch(data:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + "usrserv/employeebranch",data, { 'headers': headers })
    }
    public getEmployeeedit(id:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/fetch_employee_id/'+id, { 'headers': headers })
    }
    public getBusinesssegmentsearch(query:any, page:any): Observable<any> {
      // let data: any = { 'branch': query }
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/masterbusinesssegment?page=' + page + '&data=' + query, { 'headers': headers })
    }
    public getBusinesssegmentname(query:any, page:any): Observable<any> {
      // let data: any = { 'branch': query }
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/bs_name_list?page=' + page + '&data=' + query, { 'headers': headers })
    }
    public getBusinesssectorsearch(query:any, page:any): Observable<any> {
      // let data: any = { 'branch': query }
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/apsectorname_get?page=' + page + '&data=' + query, { 'headers': headers })
    }
    public BSSegmentSave(searchccbs): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/create_masterbusinesssegment', searchccbs, { 'headers': headers })
    }

    public getPinCodeDropDownscroll(pinkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (pinkeyvalue === null) {
        pinkeyvalue = "";
        console.log('calling empty');
      }
      let urlvalue = url + 'mstserv/pincode_search?query=' + pinkeyvalue + '&page=' + pageno;
      console.log(urlvalue);
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }
    public getCityDropDownscroll(citykeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (citykeyvalue === null) {
        citykeyvalue = "";
        console.log('calling empty');
      }
      let urlvalue = url + 'mstserv/new_city_search?query=' + citykeyvalue + '&page=' + pageno;
      console.log(urlvalue);
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }
    public getempcodedropdown(data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/employee_account_get?page='+page+'&data='+data, { 'headers': headers })
    }
    public getemppaydropdown(data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/employee_paymode_get?page='+page+'&data='+data, { 'headers': headers })
    }
    public getempbankdropdown(data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/employee_bank?page='+page+'&data='+data, { 'headers': headers })
    }
    public getempbranchdropdown(id,data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/employee_bankbranch/'+id+'?page='+page+'&data='+data, { 'headers': headers })
    }
    public getempbankcreate(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'usrserv/create_employee_account_details',data, { 'headers': headers })
    }
    public getempbankaddsummarys(page:any): Observable<any> {


      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();


      return this.http.get<any>(url + 'usrserv/create_employee_account_details?page='+page, { 'headers': headers })
    }
    public getempbankaddsummarys_new(page:any): Observable<any> {


      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();


      // return this.http.get<any>(url + 'usrserv/employee_account_get?page='+page, { 'headers': headers })
      return this.http.get<any>(url + 'usrserv/create_employee_account_details?page='+page, { 'headers': headers })
    }

      

    public getbsdatafilter(data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token

  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/employee_bs_data?data='+data+'&page='+page, { 'headers': headers })
    }
    public getccdatafilter(id:any,data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token

  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
    
      return this.http.get<any>(url + 'usrserv/employee_cc_data/'+id+'?data='+data+'&page='+page, { 'headers': headers })
    }
   

 
    public getcitydatafilter(id:any,data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/city_scroll/'+id+'?page='+page+'&data='+data, { 'headers': headers })
    }

  public getbranchdatafilter(data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/Branch_data?data='+data+'&page='+page, { 'headers': headers })
    }
  public getbranchdataid(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/employeebranch_get/'+data, { 'headers': headers })
    }
public getstatedatafilter(id:any,data:any,page:any): Observable<any> {

      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token

  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/fetch_state_scroll/'+id+'?page='+page+'&data='+data, { 'headers': headers })
    }
 public getdistrictdatafilter(id:any,data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/district_scroll/'+id+'?page='+page+'&data='+data, { 'headers': headers })
    }

 public getsummarycity(id:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/fetch_district_city_state?status='+id+'&page='+page, { 'headers': headers })

      // const headers = { 'Authorization': 'Token ' + token }
      // let params: any = new HttpParams();
      // return this.http.post<any>(url + 'usrserv/employeeaccount_active_inactivate',data, { 'headers': headers })

    }
    public getactiveinsctiveempbank(data){
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'usrserv/employeeaccount_active_inactivate',data, { 'headers': headers })

    }
    public getsummarydistrict(id:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/fetch_district_state?status='+id+'&page='+page, { 'headers': headers })
    }
    public getsummarydepartmentedit(id:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'usrserv/department/'+id+'?page='+page, { 'headers': headers })
    }
    public getdesignationsummary(data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/designation?page='+page+'&data='+data, { 'headers': headers })
    }
    public getdesignationcreate(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/designation',data,{ 'headers': headers })
    }
    public getRiskcreate(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/risktype',data,{ 'headers': headers })
    }
    public getsectorcreate(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/sector',data,{ 'headers': headers })
    }
    public getsectorsummary(data:any,page:any,status:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/sector_search?page='+page+'&query='+data+'&status='+status,{ 'headers': headers })
    }
    public getsectorsummaryactiveinactive(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/apsector_activate_inactivate',data,{ 'headers': headers })
    }

    public getbranchsearchscroll(query,page): Observable<any> {
      let data: any = { 'branch': query }
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'usrserv/search_employeebranch?page=' + page + '&query=' + query, { 'headers': headers })
    }
    public getPMDServ(pageNumber, pageSize,code,name,location,status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "mstserv/pmd_branch?page=" + pageNumber+'&name='+name+'&code='+code+'&location='+location+'&status='+status, { 'headers': headers, params })
    }
    public PMDCreateForm(bs: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(bs)
      //console.log("bs Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/pmd_branch', data, { 'headers': headers })

    }
    public expenceidscrollget(d: any,page:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      // let data = JSON.stringify(bs)
      //console.log("bs Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/expensegrp_search?query='+d+'&page='+page, { 'headers': headers })

    }
    public expenceformcreate(d: any): Observable<any> {

      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token

      // let data = JSON.stringify(bs)
      //console.log("bs Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/expensegrp', d, { 'headers': headers })

    }
    public expencedatacreate(data:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      // let data = JSON.stringify(bs)
      //console.log("bs Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/expense',data, { 'headers': headers })
    }
    public expencesummarydata(page:any,data:any,status:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      // let data = JSON.stringify(bs)
      //console.log("bs Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/expensegrp?page='+page+'&query='+data+'&status='+status, { 'headers': headers })

    }
    public getentitysummary(page:any,d:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.get<any>(url + "usrserv/entity?page=" +page+'&data='+d, { 'headers': headers })

    }
    public getempbranchsummary(page:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.get<any>(url + "usrserv/employeebranch?page=" +page, { 'headers': headers })

    }
    public getempbranchsummarysearch(data):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.get<any>(url + "usrserv/employeebranch?" +data, { 'headers': headers })

    }
    public getentityactiveinactive(data:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.post<any>(url + "usrserv/entity_activate_inactivate" ,data, { 'headers': headers })

    }
    public getentitycreate(data:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.post<any>(url + "usrserv/entity" ,data, { 'headers': headers })

    }
    public commodityCreateForm(com: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(com)
      // console.log("com Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/commodity', data, { 'headers': headers })
    }
    public getemployeeFKdd(empkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
    }
    public getcommodityFKdd(comkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/searchcommodity?query=' + comkeyvalue + '&page=' + pageno, { 'headers': headers })
    }
    public getemployeeFK(empkeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
    }
    public getcommodityFK(comkeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/searchcommodity?query=' + comkeyvalue, { 'headers': headers })
    }
    public getdelmattype(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.get<any>(url + 'mstserv/delmattype', { 'headers': headers })
    }
    public delmatmakercreate(delmake): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(delmake)
      //console.log("delmake Data", data)
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.post<any>(url + 'mstserv/delmat', data, { 'headers': headers })
    }
    public getproductFKdd(prodkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };
      // return
      return this.http.get<any>(url + "mstserv/productsearch?query=" + prodkeyvalue + '&page=' + pageno, { 'headers': headers })
    }
    public getcommodity(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      //console.log(params);
      //console.log(headers);
      return this.http.get<any>(url + "mstserv/commodity?page=" + pageNumber, { 'headers': headers, params })
    }
    public getCommoditySearch(code, name,page:any,status:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let names = name
  
      for (let i in names) {
        if (!names[i]) {
          delete names[i];
        }
      }
      let codes = code
  
      for (let i in codes) {
        if (!codes[i]) {
          delete codes[i];
        }
      }
      return this.http.get<any>(url + 'mstserv/commoditysearch?name=' + names + '&code=' + codes+'&status='+status, { 'headers': headers })
    }
    public activeInactiveCommodity(comId, status_action): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + "mstserv/commoditystatus/" + comId + '?status=' + status_action, { 'headers': headers })
    }
    public getdelmat(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      //console.log(params);
      //console.log(headers);//
      return this.http.get<any>(url + "mstserv/delmat?page=" + pageNumber, { 'headers': headers, params })
    }
    public getdelmatSearch(searchdel): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.post<any>(url + 'mstserv/delmatsearch', searchdel, { 'headers': headers })
    }
    public activeInactivedel(delId, status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = delId + '?status=' + status
      //console.log('data check for apcat active inactive', data)
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.get<any>(url + "mstserv/delmatstatus/" + delId + '?status=' + status, { 'headers': headers })
    }
    public getInactivelist() {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.get<any>(url + "mstserv/listinactive", { 'headers': headers })
    }
    public getactivelist() {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.get<any>(url + "mstserv/listactive", { 'headers': headers })
    }
    public getdelmatapp(pageNumber = 1, pageSize = 10): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      // console.log(params);
      // console.log(headers);//
      return this.http.get<any>(url + "mstserv/pending_list?page=" + pageNumber, { 'headers': headers, params })
    }
    public getdelrejectdata(data): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.post<any>(url + "mstserv/updaterejected", data, { 'headers': headers })
    }
    public getdelmatappSearch(searchdel): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/searchpending', searchdel, { 'headers': headers })
    }
    public getproduct(prodkeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // return
      return this.http.get<any>(url + "mstserv/productsearch?query=" + prodkeyvalue, { 'headers': headers })
    }
    public productCreateForm(prod: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(prod)
      //console.log("prod Data", data)
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.post<any>(url + 'mstserv/cpmapping', data, { 'headers': headers })
    }
    public getprodselectedlist(ids: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let id = ids
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.get<any>(url + 'mstserv/cpMap/' + id, { 'headers': headers })
    }
    public getglsummary(pageNumber, pageSize): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
    // /arams = params.append('pageSize', pageSize.toString());
     // console.log(params);
     // console.log(headers);
      return this.http.get<any>(url + "usrserv/gl_summary?page=" + pageNumber+pageSize, { 'headers': headers })
    }
    public getdelapprovaldata(approval): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let data = JSON.stringify(approval)
      //console.log("approval Data", data)
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.post<any>(url + 'mstserv/updateapproved', data, { 'headers': headers })
    }
    public getdelmattypedropdown(data:any,page:any){
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      //console.log("approval Data", data)
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/expensegrp?page='+page+'&query='+data, { 'headers': headers })
    
    }
    public getexpencesummaryactiveinactive(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/apexpense_activate_inactivate',data,{ 'headers': headers })
    }
    public getfinyearsummary(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/financial_year?'+data,{ 'headers': headers })
    }
    public getfinyearcreate(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/financial_year',data,{ 'headers': headers })
    }
    public getfinQuateryearcreate(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/financial_quarters_year',data,{ 'headers': headers })
    }
    public getfinQuateryearsummary(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/financial_quarters_year?'+data,{ 'headers': headers })
    }
    public getfinyearactiveinactive(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/finyr_activate_inactivate',data,{ 'headers': headers })
    }
    public getfinQyearactiveinactive(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/fin_quarter_yr_activate_inactivate',data,{ 'headers': headers })
    }
    getcbsglactive(data:any){
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'usrserv/gl_activate_inactivate',data,{ 'headers': headers });
    }
    public getempbranchlactive(data:any){
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + "usrserv/employeebranch_activate_inactivate",data,{ 'headers': headers });
    }
    getpmdcbsglactive(data:any){
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/pmd_activate_inactivate',data,{ 'headers': headers });
    }
    getdesignationsearch(page:any,data:any){
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(url + 'mstserv/designation_search?page='+page+'&query='+data,{ 'headers': headers });
    }
    public getdelmatSearch_new(searchdel,status:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.post<any>(url + 'mstserv/delmatsearch_mst?status='+status, searchdel, { 'headers': headers })
    }
    public getdelmatappSearch_new(searchdel): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(url + 'mstserv/searchpending_mst', searchdel, { 'headers': headers })
    }
    public getBssearch_new(no, name,status,page:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(url + 'mstserv/businesssegmentsearch_mst?name=' + name + '&no=' + no+'&status='+status+'&page='+page, { 'headers': headers })
    }
    public getCCsearchoverall_new(no, name,status,page:any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(url + 'mstserv/costcentresearch_overall_mst?name=' + name + '&no=' + no+'&status='+status+'&page='+page, { 'headers': headers })
    }
    public getentitysummarysearch_new(page:any,d:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.get<any>(url + "configserv/entity_search?page=" +page+'&query='+d, { 'headers': headers })

    }
    public get_cityValue_new(citykeyvalue,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if (citykeyvalue === null) {
        citykeyvalue = "";
      }
      return this.http.get<any>(url + 'mstserv/city_search_new?query=' + citykeyvalue, { 'headers': headers })
     
  
    }
    public getStateSearch_new(statekeyvalue,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/state_search?query=' + statekeyvalue, { 'headers': headers })
    }
    public getDistrictDropDown_new(districtkeyvalue,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if (districtkeyvalue === null) {
        districtkeyvalue = "";
      }
  
      return this.http.get<any>(url + 'mstserv/district_search?query=' + districtkeyvalue, { 'headers': headers })
     
    }
    public getAppVersionMaster(pageNumber = 1, pageSize = 10, d,i,status:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      return this.http.get<any>(url + "mstserv/appversion?page=" + pageNumber +"&no="+d+"&remarks="+i+'&status='+status, { 'headers': headers })
    }
    public getappversionactiveinactive(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/appversionactiveinactive',data,{ 'headers': headers })
    }
    public getappversioncreate(data:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.post<any>(url + "mstserv/appversion" ,data, { 'headers': headers })

    }
    public getCommodityDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/commodity_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getempbranchDoenload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'usrserv/employeebranch_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getRiskTypeDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/risktype_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getDelmatMakerDownloadprepare(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/download_file/'+data, { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getDelmatMakerDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/delmat_download', { 'headers': headers})
    }
    public getDelmatApproverDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/delmat_approval_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getDeparmentDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'usrserv/department_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getCCBSDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/ccbsmapping_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getBSDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/businesssegment_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getCCDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/costcentre_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getDesignationDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/designation_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getPincodeDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/pincode_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getCityDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/city_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getDistrictDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/district_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getStateDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/state_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getrisksummarysearch_new(page:any,d:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.get<any>(url + "mstserv/risktype?page=" +page+'&query='+d, { 'headers': headers })

    }
    public getClientMaster(pageNumber = 1, pageSize = 10, d, i,status:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      params = params.append('page', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      return this.http.get<any>(url + "mstserv/create_client?page=" + pageNumber +"&code="+d+"&name="+i+'&status='+status, { 'headers': headers })
    }
    public getclientactiveinactive(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
  
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(url + 'mstserv/clientcode_activate_inactivate',data,{ 'headers': headers })
    }
    public getclientcreate(data:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.post<any>(url + "mstserv/create_client" ,data, { 'headers': headers })

    }
    public getClientDownload(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(url + 'mstserv/clientcode_download', { 'headers': headers,responseType: 'blob' as 'json' })
    }
    public getrmSearch(id,page): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.get<any>(url + 'mstserv/rm_drop_down?query='+id+'&page='+page, { 'headers': headers })
    }
    public getempupload(data:any):Observable<any>{
      const getToken=localStorage.getItem('sessionData');
      let tokenValue=JSON.parse(getToken);
      let token=tokenValue.token;
      const headers={'Authorization': 'Token ' +token};
      return this.http.post<any>(url + "mstserv/fetch_employee_excel" ,data, { 'headers': headers })

    }






    public getCommodity(id) {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.get<any>(url + "mstserv/commodity/"+id, { 'headers': headers })
    }
    public getdelmatSearch_neww(searchdel,status:any,page): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };//
      return this.http.post<any>(url + 'mstserv/delmatsearch_mst?status='+status+'&page='+page, searchdel, { 'headers': headers })
    }
}


  

