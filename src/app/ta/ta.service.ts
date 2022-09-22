import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { User } from '../user'
import { environment } from 'src/environments/environment';

const url = environment.apiURL
const taURL = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class TaService {
  constructor(private http: HttpClient, private idle: Idle,) { }

  landlordbankADDEditJson: any
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public login(user: User): Observable<any> {
    this.reset();
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(user);
    // // console.log(body)
    // console.log(memoUrl);
    return this.http.post(taURL + 'usrserv/auth_token' + '', body, { 'headers': headers })
    // .subscribe(data => {
    //   if(data){
    //     this.Loginname=data.name;
    //   }
    // })
  }

  public createtourmakers(CreateList: any, files: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = ''
    }
    // if (onbehalfof == undefined) {
    //   onbehalfof = ''
    // }
    let tourjson = Object.assign({}, CreateList)
    let formData = new FormData();
    formData.append('data', JSON.stringify(tourjson));
    for (var i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    // formData.append('onbehalfof', onbehalfof);
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/tour", formData, { 'headers': headers })
  }
  public expenseAdd(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    // if (files == undefined) {
    //   files = ''
    // }
    let tourjson = Object.assign({}, CreateList)
    let formData = new FormData();
    formData.append('data', JSON.stringify(tourjson));
    // for (var i = 0; i < files.length; i++) {
    //   formData.append('file', files[i]);
    // }
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/expense/submit", formData, { 'headers': headers })
  }
  public edittourmakers(CreateList: any, files: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, CreateList, value)
    if (files == undefined) {
      files = ''
    }
    let tourjson = Object.assign({}, CreateList)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    for (var i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/tour", formData, { 'headers': headers })
  }
  public createtourmaker(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/tour", body, { 'headers': headers })
  }

  public TourmakerEditForm(id, tourJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, tourJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tour", jsonValue, { 'headers': headers })
  }

  // public getadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   // const getToken: any = sessionStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   console.log(params);
  //   return this.http.get<any>(taURL + "taserv/touradvance", { 'headers': headers })
  // }

  public getadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/touradvance", { 'headers': headers })
  }

  //advance maker summary
  public getAdvanceMakerSummaryDetails(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/touradvance?page=' + pageNumber + val, { 'headers': headers })

  }

  public getViewadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "" + pageNumber, { 'headers': headers })
  }
  public getTourMakerSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/nac_tourdata?page=' + pageNumber + val, { 'headers': headers })
  }
  public getTourApprovesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=2", { 'headers': headers, params })
  }
  public getTourapprovetounoSummary(tourno, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?tour_no=" + tourno, { 'headers': headers, params })
  }
  public getTourapproverequestdateSummary(date, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?request_date=" + date, { 'headers': headers, params })
  }
  public getTourapprovetourrequestdateSummary(date, tour, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + 'taserv/tourapprove/tour?request_date=' + date + '&tour_no=' + tour, { 'headers': headers, params })
  }
  public getTourApprovedsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=3", { 'headers': headers, params })
  }
  public getTourPendingsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=2", { 'headers': headers, params })
  }
  public getTourRejectsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=4", { 'headers': headers, params })
  }
  public getTourReturnsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=5", { 'headers': headers, params })
  }
  public getTourForwardsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=6", { 'headers': headers, params })
  }
  public getTourmakerSummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata', { 'headers': headers, params })

  }
  public getTourmakertounoSummary(tourno, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata?tour_no=' + tourno, { 'headers': headers, params })

  }
  public getTourmakerrequestdateSummary(date, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata?request_date=' + date, { 'headers': headers, params })

  }
  public getTourmakertourrequestdateSummary(date, tour, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata?request_date=' + date + '&tour_no=' + tour, { 'headers': headers, params })

  }
  public getAdvancemakerSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();


    return this.http.get<any>(taURL + 'taserv/advance_summary?page=' + pageNumber + val, { 'headers': headers, params })

  }

  public getAdvancemakerSummaryonbehalf(val, pageNumber, empid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();


    return this.http.get<any>(taURL + 'taserv/advance_summary?onbehalf=' + empid + '&page=' + pageNumber + val, { 'headers': headers, params })

  }
  public getTourmakereditSummary(summ): Observable<any> {
    this.reset();
    if (summ === undefined) {
      summ = ""
    }
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourdata/' + summ, { 'headers': headers })
    // return this.http.get<any>(taURL +'taserv/tourdata/'+,{ 'headers': headers })

  }
  // public getadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   // const getToken: any = sessionStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   console.log(params);
  //   return this.http.get<any>(taURL + "taserv/touradvance", { 'headers': headers })
  // }
  public getadvancesummaryOnbehalf(val, pageNumber, empgid): Observable<any> {
    this.reset();
    if (empgid === undefined) {
      empgid = 0
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(taURL + 'taserv/touradvance?onbehalf=' + empgid + '&page=' + pageNumber + val, { 'headers': headers, params })
  }

  public setallowamount(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/updateapprove", body, { 'headers': headers })
  }
  public getexpreasonValue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/ascte_exp", { 'headers': headers })
  }
  public getshiftCenter(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/conv_center", { 'headers': headers })
  }
  public getemployeedetails(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/emp_details_get?onbehalf=" + id, { 'headers': headers })
  }
  public getemployeesdetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/emp_details_get", { 'headers': headers })
  }
  public getexpreasonValueshifting(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/ascte_exp", { 'headers': headers })
  }
  public gettravelMode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/traveltype", { 'headers': headers })
  }
  public getacttravel(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/actualmode", { 'headers': headers })
  }
  public getCenter(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/lodging_center", { 'headers': headers })
  }
  public getroadtravelMode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/actualmode", { 'headers': headers })
  }
  public gettraintravelMode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_Train", { 'headers': headers })
  }
  public getairtravelMode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_Air", { 'headers': headers })
  }
  public getseatravelMode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_Sea", { 'headers': headers })
  }
  public getcityValue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/allowance_get?expense=8&salarygrade=S3", { 'headers': headers })
  }
  public getreasonValue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourreason", { 'headers': headers })
  }
  public getemployeeValue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/searchemployee", { 'headers': headers })
  }
  public getbranchValue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/search_employeebranch", { 'headers': headers })
  }
  public getbranch(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (val == null) {
      val = '';
    }
    return this.http.get<any>(taURL + "taserv/branch_dropdown?branch=" + val, { 'headers': headers })
  }
  public getacc(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/accommodation_booking_admin", { 'headers': headers })
  }
  public getair(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/air_booking_admin", { 'headers': headers })
  }
  public getcab(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/cab_booking_admin", { 'headers': headers })
  }
  public getbus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/bus_booking_admin", { 'headers': headers })
  }
  public gettrain(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/train_booking_admin", { 'headers': headers })
  }
  public getacclist(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/get_requirements_admin?requirement_id=" + id + "&type=1", { 'headers': headers })
  }
  public getcablist(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/get_requirements_admin?requirement_id=" + id + "&type=2", { 'headers': headers })
  }
  public getbuslist(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/get_requirements_admin?requirement_id=" + id + "&type=3", { 'headers': headers })
  }
  public gettrainlist(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/get_requirements_admin?requirement_id=" + id + "&type=4", { 'headers': headers })
  }
  public getairlist(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/get_requirements_admin?requirement_id=" + id + "&type=5", { 'headers': headers })
  }
  public setemployee(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = id
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.get<any>(taURL + "taserv/onbehalf_emp_get/" + body, { 'headers': headers })
  }
  public setemployeeValue(value, branch, onbehalfid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (onbehalfid) {
      return this.http.get<any>(taURL + "taserv/branch_approver_get/advance/branch/" + branch + '?onbehalfof=' + onbehalfid + '&name=' + value, { 'headers': headers })
    }
    else {
      return this.http.get<any>(taURL + "taserv/branch_approver_get/advance/branch/" + branch + '?name=' + value, { 'headers': headers })
    }
  }
  public setemployeeValues(value, branch, onbehalfid, tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (onbehalfid != 0) {
      return this.http.get<any>(taURL + "taserv/branch_approver_get/expense/branch/" + branch + '?onbehalfof=' + onbehalfid + '&name=' + value, { 'headers': headers })
    }
    else {
      return this.http.get<any>(taURL + "taserv/branch_approver_get/expense/branch/" + 471 + '?name=' + value + '&tourid=' + tourid, { 'headers': headers })
    }
  }
  public getbusinesssegmentValue(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "mstserv/searchbusinesssegment?query=" + value + "&page=" + page, { 'headers': headers })
  }
  public getcostcenterValue(value, id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "mstserv/searchbs_cc?query=" + value + '&bs_id=' + id, { 'headers': headers })
  }
  public approvetourmaker(approveJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let jsonValue = Object.assign({}, approveJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tourapprove", jsonValue, { 'headers': headers })
  }
  public rejecttourmaker(approveJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let jsonValue = Object.assign({}, approveJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tourreject", jsonValue, { 'headers': headers })
  }
  public acc_Book(approveJson, files, evt): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }

    let jsonValue = Object.assign({}, approveJson)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }

    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/accommodation_booking_admin", formData, { 'headers': headers })
  }
  public train_Book(approveJson, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let jsonValue = Object.assign({}, approveJson)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/train_booking_admin", formData, { 'headers': headers })
  }
  public cab_Book(approveJson, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let jsonValue = Object.assign({}, approveJson)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/cab_booking_admin", formData, { 'headers': headers })
  }
  public air_Book(approveJson, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }

    let jsonValue = Object.assign({}, approveJson)
    let formData = new FormData();

    formData.append('data', JSON.stringify(jsonValue));
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/air_booking_admin", formData, { 'headers': headers })
  }
  public bus_Book(approveJson, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let jsonValue = Object.assign({}, approveJson)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/bus_booking_admin", formData, { 'headers': headers })
  }
  public cancelreq(approveJson, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let jsonValue = Object.assign({}, approveJson)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/req_cancel_approve", formData, { 'headers': headers })
  }
  public returntourmaker(approveJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let jsonValue = Object.assign({}, approveJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tourreturn", jsonValue, { 'headers': headers })
  }
  public advanceCancel(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/tourcancel", body, { 'headers': headers })
  }
  public tourCancel(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/tourcancel", body, { 'headers': headers })
  }
  public getexpenceSummary(pageNumber, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let params: any = new HttpParams();

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/expense_summary?page=" + pageNumber + val, { 'headers': headers, params })

  }


  public getadvanceEditview(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/approval_flow_get?type=advance&tourid=" + id, { 'headers': headers })

  }
  public getadvanceccbsEditview(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/ccbs_get?type=1&tour=" + id, { 'headers': headers })

  }

  public getccbsedit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/ccbs_get?id=" + id, { 'headers': headers })

  }



  public IncidentalCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/incidental", body, { 'headers': headers })
  }
  public approver_Incidental(CreateList, expenseid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/expamount?tour_id=" + expenseid + "&expense_id=3", body, { 'headers': headers })
  }
  public LocalconveyanceCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/localconv", body, { 'headers': headers })
  }
  public miscellaneousCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/associate", body, { 'headers': headers })
  }
  public localdeputationCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/localdeputation", body, { 'headers': headers })
  }
  public localdeputationEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/localdeputation", body, { 'headers': headers })
  }
  public miscellaneousEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/misc", body, { 'headers': headers })
  }
  public TravelingEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/misc", body, { 'headers': headers })
  }
  public LodgingEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/lodging", body, { 'headers': headers })
  }
  public getdeputeligibleAmount(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/localdeputation/logic", body, { 'headers': headers })
  }
  public getmisceligibleAmount(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/misc/logic", body, { 'headers': headers })
  }
  public getlodgingeligibleAmount(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/lodging/logic", body, { 'headers': headers })
  }
  public LodgingCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/lodging", body, { 'headers': headers })
  }
  public TravelingCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/travel", body, { 'headers': headers })
  }
  public packingCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/packingmvg", body, { 'headers': headers })
  }
  public getclaimrequestsummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/claimreq/tour/' + id, { 'headers': headers })

  }
  public getdailydiemeditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/dailydeim/tour/' + id, { 'headers': headers })

  }
  public gettravelingeditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/travel/tour/' + id, { 'headers': headers })

  }
  public getmisceditSummary(id, report): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (report) {
      return this.http.get<any>(taURL + 'taserv/misc/tour/' + id + '?report=1', { 'headers': headers })
    }
    else {
      return this.http.get<any>(taURL + 'taserv/associate/tour/' + id, { 'headers': headers })
    }


  }
  public expensedeleteSummary(id, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/expense_delete/' + id + '/tour/' + type, { 'headers': headers })

  }
  public deletemiscdeleteSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/misc/tour/' + id, { 'headers': headers })

  }
  public deletetraveldeleteSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/travel/tour/' + id, { 'headers': headers })

  }
  public deletelodgingdeleteSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/lodging/tour/' + id, { 'headers': headers })

  }
  public deletedeptdeleteSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/localdeputation/tour/' + id, { 'headers': headers })

  }
  public getdeputeditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/localdeputation/tour/' + id, { 'headers': headers })

  }
  public getpackingeditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/packingmvg/tour/' + id, { 'headers': headers })

  }
  public getlocaleditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/localconv/tour/' + id, { 'headers': headers })

  }
  public getlodgeeditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/lodging/tour/' + id, { 'headers': headers })

  }
  public getincidentaleditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/incidental/tour/' + id, { 'headers': headers })

  }
  public getCancelapproveSummary(statusId, pageNumber, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(taURL + "taserv/tourapprove/TourCancel?status=" + statusId + "&page=" + pageNumber + val, { 'headers': headers })

  }
  public getCancelapproveadvanceSummary(statusId, pageNumber, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(taURL + "taserv/tourapprove/AdvanceCancel?status=" + statusId + "&page=" + pageNumber + val, { 'headers': headers })

  }
  public getCancelMakeronbehalfSummary(val, pageNumber, empgid): Observable<any> {
    this.reset();
    if (empgid === undefined) {
      empgid = 0
    }
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log(params);
    return this.http.get<any>(taURL + "taserv/cancelled_data?type=TourCancel&page=" + pageNumber + "&onbehalf=" + empgid + val, { 'headers': headers })

  }
  public getCancelMakerSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log(params);
    return this.http.get<any>(taURL + "taserv/cancelled_data?type=TourCancel&page=" + pageNumber + val, { 'headers': headers })

  }
  public getCancelApproverSummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "", { 'headers': headers })

  }
  public getCancelAddMakerSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    console.log(params);
    return this.http.get<any>(taURL + "taserv/approved_data?type=tour&page=" + pageNumber + val, { 'headers': headers })

  }
  public getCancelAddMakeronbehalfSummary(val, pageNumber, empgid): Observable<any> {
    this.reset();
    if (empgid === undefined) {
      empgid = 0
    }
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    console.log(params);
    return this.http.get<any>(taURL + "taserv/approved_data?type=tour&page=" + pageNumber + "&onbehalf=" + empgid + val, { 'headers': headers })

  }
  public getCancelAddMakeradvanceSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    console.log(params);
    return this.http.get<any>(taURL + "taserv/approved_data?type=advance&page=" + pageNumber + val, { 'headers': headers })

  }
  public getCancelAddMakeradvanceonbehalfSummary(val, pageNumber, empgid): Observable<any> {
    this.reset();
    if (empgid === undefined) {
      empgid = 0
    }
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    console.log(params);
    return this.http.get<any>(taURL + "taserv/approved_data?type=advance&page=" + pageNumber + "&onbehalf=" + empgid + val, { 'headers': headers })

  }

  public getAssignSummary(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/approverlist?page=" + pageNumber, { 'headers': headers })

  }
  public getonBehalfSummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "", { 'headers': headers })

  }
  public getCancelMakeradvanceonbehalfSummary(val, pageNumber, empgid): Observable<any> {
    this.reset();
    if (empgid === undefined) {
      empgid = 0
    }
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log(params);
    return this.http.get<any>(taURL + "taserv/cancelled_data?type=AdvanceCancel&page=" + pageNumber + "&onbehalf=" + empgid + val, { 'headers': headers })

  }
  public getCancelMakeradvanceSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log(params);
    return this.http.get<any>(taURL + "taserv/cancelled_data?type=AdvanceCancel&page=" + pageNumber + val, { 'headers': headers })

  }
  public getonBehalfpopup(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "", { 'headers': headers })

  }


  public getadvanceEditsummary(summ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/touradvance/' + summ, { 'headers': headers })
  }
  public getapproveSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourdata/1', { 'headers': headers })

  }



  // public approvetourmaker(approveJson): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let jsonValue = Object.assign({}, approveJson)
  //   console.log("statutoryJson", JSON.stringify(jsonValue))
  //   return this.http.post<any>(taURL + "taserv/tourapprove", jsonValue, { 'headers': headers })

  // }
  // public rejecttourmaker(rejectJson): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let jsonValue = Object.assign({}, rejectJson)
  //   console.log("statutoryJson", JSON.stringify(jsonValue))
  //   return this.http.post<any>(taURL + "taserv/tourreject", jsonValue, { 'headers': headers })

  // }
  // public returntourmaker(returnJson): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let jsonValue = Object.assign({}, returnJson)
  //   console.log("statutoryJson", JSON.stringify(jsonValue))
  //   return this.http.post<any>(taURL + "taserv/tourreturn", jsonValue, { 'headers': headers })

  // }
  public forwardtourmaker(returnJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let jsonValue = Object.assign({}, returnJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tourforward", jsonValue, { 'headers': headers })

  }
  public tourchat(returnJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let jsonValue = Object.assign({}, returnJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/chat_box", jsonValue, { 'headers': headers })

  }
  public advanceCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = CreateList;
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/touradvance", body, { 'headers': headers })
  }
  public getexpenseReturnsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=5", { 'headers': headers })

  }
  public getadvanceReturnsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=5", { 'headers': headers })

  }
  public getadvanceRejectsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=4", { 'headers': headers })

  }
  public getexpenseRejectsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=4", { 'headers': headers })

  }
  public getexpensePendingsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=2", { 'headers': headers })

  }
  public getadvancePendingsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=2", { 'headers': headers })

  }
  public getexpenseApprovedsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=3", { 'headers': headers })

  }
  public getadvanceApprovedsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=3", { 'headers': headers })

  }
  public getapprovexpenceSummary(statusId, pageNumber, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/nac_tourapprove/claim?status=" + statusId + "&page=" + pageNumber + val, { 'headers': headers })

  }
  public getadvanceview(statusId, pageNumber, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=" + statusId + "&page=" + pageNumber + val, { 'headers': headers })

  }
  public expenseCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/dailydeim", body, { 'headers': headers })
  }
  public getexpenseTypeValue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/expenselist", { 'headers': headers })
  }
  public DailydiemCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/dailydeim", body, { 'headers': headers })
  }
  public getHolidaydiemSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/holidaydeim', { 'headers': headers })

  }
  public deleteholidaydiem(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/holidaydeim/" + id, { 'headers': headers })
  }
  public createholidaydiem(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/holidaydeim", body, { 'headers': headers })
  }
  public getGradeEligibleSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/grade', { 'headers': headers })

  }
  public deletegradeeligible(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/grade/" + id, { 'headers': headers })
  }
  public creategradeeligible(GradeList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(GradeList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/grade", body, { 'headers': headers })
  }
  public getCommondropdownSummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown?page=' + page, { 'headers': headers })

  }
  public deletecommondropdown(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/common_dropdown/" + id, { 'headers': headers })
  }
  public createCommondropdown(DropdownList: any): Observable<any> {
    this.reset();
    let myobj = { "data": DropdownList };
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let body = JSON.stringify(myobj);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/common_dropdown", body, { 'headers': headers })
  }
  public getCommondropdownselectedSummary(id: any, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    //return this.http.get<any>(taURL + 'taserv/common_dropdown_details?id=' + id + '&page='+ page , { 'headers': headers })
    return this.http.get<any>(taURL + 'taserv/common_dropdown/detail/' + id, { 'headers': headers })

  }
  public getCommondropdowndetailSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_details', { 'headers': headers })

  }
  public deletecommondropdowndetail(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/common_dropdown_details/" + id, { 'headers': headers })
  }
  public createCommondropdowndetail(DropdowndetailList: any): Observable<any> {
    this.reset();
    let myobj = { "data": DropdowndetailList };
    //let body = JSON.stringify(myobj);
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(myobj)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/common_dropdown_details", body, { 'headers': headers })
  }

  public getUsageCode(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = taURL + 'usrserv/search_employeebranch?query=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getGstCode(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = taURL + 'taserv/bank_gst_get?gst=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getusageSearchFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/search_employeebranch?query=' + empkeyvalue, { 'headers': headers })

  }
  public getgstSearchFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/bank_gst_get?gst=' + empkeyvalue, { 'headers': headers })

  }
  public getemployeeSummary(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/nac_onbehalf_emp_get?query=' + value + '&page=' + page, { 'headers': headers })

  }
  public getonbehalfSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/onbehalf_emp_get', { 'headers': headers })

  }
  public getbranchSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/employeebranch', { 'headers': headers })

  }

  public getbranchValues(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/search_employeebranch?query=central&pageno=48", { 'headers': headers })
  }


  public getTourmakeronbehalfSummary(pageNumber = 1, pageSize = 10, empgid): Observable<any> {
    this.reset();
    if (empgid === undefined) {
      empgid = 0
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/nac_tourdata?onbehalf=' + empgid, { 'headers': headers, params })

  }
  public getexpenceSummarylist(val, pageNumber, empgid): Observable<any> {
    this.reset();
    if (empgid === undefined) {
      empgid = 0
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(taURL + 'taserv/expense_summary?onbehalf=' + empgid + '&page=' + pageNumber + val, { 'headers': headers, params })

  }
  public getempbasedreport(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_summary/7995', { 'headers': headers })

  }
  public gettournobasedreport(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_detail/1', { 'headers': headers })
  }

  public getemployeevalue(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/branch_employee_get/' + id, { 'headers': headers })
  }
  public gettoursearch(tourno, empid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    if (tourno == "") {
      return this.http.get<any>(taURL + 'taserv/report_tour_summary?empid=' + empid, { 'headers': headers })
    }
    else if (empid == "") {
      return this.http.get<any>(taURL + 'taserv/report_tour_summary?tourno=' + tourno, { 'headers': headers })
    }
    else {
      return this.http.get<any>(taURL + 'taserv/report_tour_summary?tourno=' + tourno + '&empid=' + empid, { 'headers': headers })
    }

  }
  public getemptourreport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_tourid_summary/' + id, { 'headers': headers })

  }
  public getconsolidatereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/consolidate_report/' + id, { 'headers': headers })
  }
  public gettouriddownload(id, empid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    if (empid === "") {
      return this.http.get<any>(taURL + 'taserv/report_download_tour_summary?tourno=' + id, { headers, responseType: 'blob' as 'json' })
    }
    else if (id === "") {
      return this.http.get<any>(taURL + 'taserv/report_download_tour_summary?empid=' + empid, { headers, responseType: 'blob' as 'json' })

    }
    else {
      return this.http.get<any>(taURL + 'taserv/report_download_tour_summary?tourno=' + id + '&empid=' + empid, { headers, responseType: 'blob' as 'json' })
    }
  }

  public gettourdetailreport(page, book, date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_requirements?booking_type=' + book + '&requested_date=' + date + '&page=' + page, { 'headers': headers })
  }
  public gettourexpensereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/claimreq/tour/' + id, { 'headers': headers })
  }
  public gettouradvancereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/touradvance/' + id, { 'headers': headers })
  }
  public gettourdetaildownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_download_tour_detail/' + id, { headers, responseType: 'blob' as 'json' })


  }
  public gettourexpensedownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_download_tour_expense/' + id, { headers, responseType: 'blob' as 'json' })


  }
  public getempreportdownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_download_tourid/' + id, { headers, responseType: 'blob' as 'json' })
  }
  public getreasonValues(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === null) {
      id = "";

    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourreason?name=' + id, { 'headers': headers })
  }
  public getbranchemployee(value, branch, onbehalfof): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (onbehalfof) {
      return this.http.get<any>(taURL + 'taserv/branch_approver_get/tour/branch/' + branch + '?name=' + value + '&onbehalfof=' + onbehalfof, { 'headers': headers })

    }
    else {
      return this.http.get<any>(taURL + 'taserv/branch_approver_get/tour/branch/' + 471 + '?name=' + value, { 'headers': headers })
    }
  }
  public getonbehalfemployee(value, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/onbehalf_emp_get/' + branch, { 'headers': headers })
    // return this.http.get<any>(taURL + 'taserv/onbehalf_emp_get/' + branch +'?name='+value, { 'headers': headers })
  }
  public getemployeevaluepermit(maker, id, value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === null) {
      id = "";

    }
    if (maker == undefined) {
      maker = ''
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/branch_employee_get/' + value + '?maker=' + maker + '?name=' + id, { 'headers': headers })
  }
  public gethsncode(value, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'mstserv/search_hsn?query=' + value + '&page=' + pageno, { 'headers': headers })
  }
  public getgstcode(value, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/bank_gst_get?gst=' + value + '&page=' + pageno, { 'headers': headers })
  }
  public getdaterelaxation(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/date_relaxation', { 'headers': headers })
  }
  public getactivedate(id, tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let activeValue = [{
      "id": id,
      "status": 0,
      "tour_id": tourid
    }]

    return this.http.post<any>(taURL + "taserv/date_relaxation", activeValue, { 'headers': headers })

  }
  public getinactivedate(id, tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let activeValue = [{
      "id": id,
      "status": 1,
      "tour_id": tourid
    }]

    return this.http.post<any>(taURL + "taserv/date_relaxation", activeValue, { 'headers': headers })

  }
  public getpermitlist(maker, onbehalfof): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (maker == undefined) {
      maker = ''
    }
    if (onbehalfof == undefined) {
      onbehalfof = ''
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/branchwise_employee_get/0?maker=' + maker + '&onbehalfof=' + onbehalfof, { 'headers': headers })
  }
  public getchatlist(tourid, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    if (tourid == undefined) {
      tourid = ''
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/chat_box?tourid=' + tourid + '&page=' + pageno, { 'headers': headers })
  }
  public getpermittedlist(maker, empkeyvalue, pageno, onbehalfof): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    if (maker == undefined) {
      maker = ''
    }
    if (onbehalfof == undefined) {
      onbehalfof = ''
    }
    let urlvalue = taURL + 'usrserv/branchwise_employee_get/0?maker=' + maker + '&name=' + empkeyvalue + '&page=' + pageno + '&onbehalfof=' + onbehalfof;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbranchwisereport(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let empid = tokenValue.employee_id
    const headers = { 'Authorization': 'Token ' + token }
    if (data === 1) {
      return this.http.get<any>(taURL + 'taserv/branchwise_pending/' + empid, { 'headers': headers })
    } else {
      return this.http.get<any>(taURL + 'taserv/branchwise_pending/0', { 'headers': headers })

    }
  }
  public getfetchimages(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/document_get?tour_id=' + id + '&ref_type=1', { headers })

  }
  public fileDelete(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/particular_doc_get/' + id, { headers })
  }
  public getreqfiles(id, type): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/document_get?requirement=' + id + '&ref_type=1&requirement_type=' + type, { headers })

  }

  public getadvpdf(invoiceid) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'ecfserv/ecf_covernote/' + invoiceid, { headers, responseType: 'blob' as 'json' })
  }

  public viewfile(fileid, option, value) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/document_view?doc_option=' + option + '&id=' + fileid, { headers, responseType: 'blob' as 'json' })
  }

  public getfetchimagesss(id) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // window.open(url)
    return this.http.get<any>(taURL + 'taserv/document_view?doc_option=download&id=' + id, { headers, responseType: 'blob' as 'json' })
  }

  public app_onbehalf(value) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // window.open(url)
    return this.http.get<any>(taURL + 'usrserv/ceo_team_get_ta?query=' + value, { headers })
  }

  public getviewpdfimages(url): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(taURL + 'taserv/fetch_documents/'+id, { headers, responseType: 'blob' as 'json'  })
    return this.http.get<any>(url)
  }

  public getapproveflowalllist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=all&tourid=' + id, { 'headers': headers })
  }
  public getcancelflowlist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=TourCancel&tourid=' + id, { 'headers': headers })
  }
  public getadvancecancelflowlist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=AdvanceCancel&tourid=' + id, { 'headers': headers })
  }
  public getapproveflowexpenselist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=claim&tourid=' + id, { 'headers': headers })
  }
  public getapproveflowlist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=tour&tourid=' + id, { 'headers': headers })
  }
  public getcitylist(value, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/insert_ta_city?city_name=' + value + '&page=' + pageno, { 'headers': headers })
  }

  public getsubcat(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/d_subcat', { 'headers': headers })
  }
  public getcitytype(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/dailydiem', { 'headers': headers })
  }

  public getincidentaltravelmode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/incidental_travelmode', { 'headers': headers })
  }
  public getstatus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/status', { 'headers': headers })
  }
  public getyesno(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/yn', { 'headers': headers })
  }
  public getypelist(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/lodge_homestay', { 'headers': headers })
  }
  public getdepend(onbehalf): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (onbehalf != 0) {
      return this.http.get<any>(taURL + 'taserv/dependencies_get?onbehalf=' + onbehalf, { 'headers': headers })
    }
    else {
      return this.http.get<any>(taURL + 'taserv/dependencies_get', { 'headers': headers })
    }

  }
  public Incidentaleligibleamt(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/incidental/logic", body, { 'headers': headers })
  }


  public advanceapproveamt(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/updateapprove", body, { 'headers': headers })
  }


  public getloc_convtravelmode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/mode_of_travel', { 'headers': headers })
  }
  public getloc_convtrain(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_train', { 'headers': headers })
  }
  public getloc_convroad(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_road', { 'headers': headers })
  }

  public getloc_convcenter(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/metro_nonmetro', { 'headers': headers })
  }
  public getloc_convonward(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_onward', { 'headers': headers })
  }
  public localconveligibleamt(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/localconv/logic", body, { 'headers': headers })
  }
  public dailydeimligibleamt(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/dailydeim/logic", body, { 'headers': headers })
  }
  public packingeligibleamt(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/packingmvg/logic", body, { 'headers': headers })
  }
  public getpacking_twowheeler(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/packing_twowheeler', { 'headers': headers })
  }
  public LocalconveyanceEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/localconv", body, { 'headers': headers })
  }
  public deletelocal(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/localconv/tour/' + id, { 'headers': headers })

  }
  public IncidentalEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/incidental", body, { 'headers': headers })
  }
  public deleteincidental(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/incidental/tour/' + id, { 'headers': headers })

  }

  public DailydiemEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/dailydeim", body, { 'headers': headers })
  }
  public deletedailydeim(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/dailydeim/tour/' + id, { 'headers': headers })

  }
  public deletepacking(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/packingmvg/tour/' + id, { 'headers': headers })

  }
  public getmaxtonnage(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourno_grade_get/" + id, { 'headers': headers })

  }

  public samebooking(type, fromtime, fromplace, toplace, bookid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let object = {
      "booking_type": Number(type),
      "from_time": fromtime,
      "from_place": fromplace,
      "to_place": toplace
    }
    const body = JSON.stringify(object)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/sameday_booking", body, { 'headers': headers })
  }
  //advance maker summary
  public getTourApprovalSummary(statusId, pageNumber, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/nac_tourapprove/tour?status=" + statusId + "&page=" + pageNumber + val, { 'headers': headers })

  }
  //Onbehalf
  public getonbehalf(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/onbehalfof?page=" + page, { 'headers': headers })
  }

  public getonbehalfemployeeget(branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/branchwise_employee_get/" + branch, { 'headers': headers })
  }

  public getonbehalfemployeepage(branch, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/branchwise_employee_get/" + branch + '?page=' + page, { 'headers': headers })
  }

  public getemployeevaluechanges(branch, values): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/branchwise_employee_get/" + branch + "?name=" + values, { 'headers': headers })
  }


  public getemplvalue(branch, empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(taURL + 'taserv/search_employee?branch='+branch +'&query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
    return this.http.get<any>(taURL + 'usrserv/branchwise_employee_get/' + branch + '?name=' + empkeyvalue + '&maker=14&page=' + pageno, { 'headers': headers })
  }

  public getbranchname(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/search_employeebranch?query", { 'headers': headers })

  }
  public getemployeedetail(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
    }
    let urlvalue = taURL + 'taserv/search_employee?query=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getonbehalfstatusupdate(statusdata): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/onbehalfof", statusdata, { 'headers': headers })
  }

  public getonbehalftablestatusupdate(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/onbehalfof_status_update", data, { 'headers': headers })
  }

  public getemployeeonbehalf(branch, empid, page, maker): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/branch_onbehalf_status/" + branch + "/emp/" + empid + '?page=' + page + '&maker=' + maker, { 'headers': headers })
  }







  //Date relaxation

  public getdaterelaxationdata(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/date_relaxation?page=' + page, { 'headers': headers })
  }

  public getbranchValuedata(tourid: any, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const id = tourid
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/date_relaxation?tour_no=" + id + '&page=' + page, { 'headers': headers })
  }

  //Claim Allowance

  public getexpensetypesearch(name, salarygrade, place, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    let grade = salarygrade
    if (name == null) {
      name = ''
    }
    if (grade == null) {
      grade = ''
    }
    let city = place
    if (city == null) {
      city = ''
    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/allowance?expensename=" + name + "&employeegrade=" + grade + "&city=" + city + '&page=' + page, { 'headers': headers })
  }

  public getdataallowance(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/allowance?page=' + page, { 'headers': headers })
  }

  public getallowanceupdate(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + 'taserv/allowance', id, { 'headers': headers })
  }

  public getallowancechange(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + 'taserv/allowance', id, { 'headers': headers })
  }
  //expense edit

  public getbranchvalues(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/search_employeebranch?page=" + page, { 'headers': headers })
  }


  public getclaimccbsEditview(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/ccbs_get?type=2&tour=" + id, { 'headers': headers })

  }

  public claimcomment(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/change_maker_comment", body, { 'headers': headers })
  }

  public claimapproveupdate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/change_approver", body, { 'headers': headers })
  }
  public claimccbsupdate(tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/app_amt_ccbs_update/" + tourid, {}, { 'headers': headers })
  }



  //localconveyance

  public approver_amountupdate(tourno, id, CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/expamount?tour_id=" + tourno + "&expense_id=" + id, body, { 'headers': headers })
  }

  public eligibletravel(tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourno_grade_get/" + tourid, { 'headers': headers })
  }

  public assignapprover(payload): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    const body = JSON.stringify(payload)
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/approverlist", body, { 'headers': headers })
  }

  public recoverysum(payload): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    const body = JSON.stringify(payload)
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/recovery_summary", body, { 'headers': headers })
  }

  public jventry(payload): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    const body = JSON.stringify(payload)
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/recovery_summary", body, { 'headers': headers })
  }


  public gettourrequirementdropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/booking_req", { 'headers': headers })
  }

  public gettourclientdropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/client", { 'headers': headers })
  }

  //taserv/delete_travel_requirements?id=78,&type=1
  public getdeleteparticularrequirement(id, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/delete_travel_requirements?id=" + id + "&type=" + type, { 'headers': headers })
  }

  public reqstatuslist(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/booking_status", { 'headers': headers })
  }

  public getTourAdminSummary(pageNumber, val, bookingtype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/admin_summary?status=3&booking_type=" + bookingtype + "&page=" + pageNumber + val, { 'headers': headers })

  }

  // tour_detail_delete

  public getdeleteparticulardelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/tour_detail_delete/" + id, { 'headers': headers })
  }

  public gettravelonweekend(stratdate, enddate, tourno, onbehalf): Observable<any> {
    this.reset();
    if (tourno) {
      tourno = '&tour_id=' + tourno;
    }
    if (onbehalf) {
      onbehalf = '&onbehalf=' + onbehalf
    }
    else {
      onbehalf = ''
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/holiday_check?start_date=" + stratdate +
      "&end_date=" + enddate + tourno + onbehalf
      , {}, { 'headers': headers })
  }

  public gettravletypedropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/official", { 'headers': headers })
  }

  public nonbasedlocation(onbehalf): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (onbehalf) {
      return this.http.get<any>(taURL + "taserv/employee_base_get?onbehalf=" + onbehalf, { 'headers': headers })
    }
    else {
      return this.http.get<any>(taURL + "taserv/employee_base_get", { 'headers': headers })
    }

  }

  public expallfiles(tourid, expid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/document_get?tour_id=" + tourid + '&ref_type=2&requirement_type=' + expid, { 'headers': headers })
  }

  public expfileupload(files, data): Observable<any> {
    this.reset()
    let tourjson = Object.assign({}, data)
    let formData = new FormData();
    formData.append('data', JSON.stringify(tourjson));
    for (var i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    console.log(formData)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/document_insert", formData, { 'headers': headers })
  }

  public gettourdetailreportdetailitenary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_detail/' + id, { 'headers': headers })
  }

  public getbookingcancellation(type, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/cancel_booking_request?booking_type=" + type + '&requirement_id=' + id, {}, { 'headers': headers })
  }

  public booking_cancel_approve(type, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/req_cancel_approve?booking_type=" + type + '&requirement_id=' + id, {}, { 'headers': headers })
  }

  public gettourreportxl(book, params) {
    let page = 1;
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/nac_report" + params, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public getsearchtour_report_xl(tourno, page, book) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_requirements_download?booking_type=' + book + '&tour_id=' + tourno + '&page=' + page, { headers, responseType: 'blob' as 'json' })
  }

  public getsearchtourdetailreport(page, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/nac_report?page=' + page + val, { 'headers': headers })

  }

  public getclientsearch(value, page, onbehalf): Observable<any> {
    this.reset();
    if (onbehalf) {
      onbehalf = '&onbehalf=' + onbehalf
    }
    else {
      onbehalf = ''
    }
    if (value) {
      value = '&query=' + value
    }
    else {
      value = ''
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    //return this.http.get<any>(taURL + 'mstserv/create_client?query=' + value + '&page=' + page, { 'headers': headers })
    return this.http.get<any>(taURL + 'taserv/frequent_client?page=' + page + value + onbehalf, { 'headers': headers })

  }

  public seenunreadmsg(tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/chat_box_view?tourid=" + tourid, {}, { 'headers': headers })
  }

  public getfromtoplace(value, page, onbehalf): Observable<any> {
    this.reset();
    if (onbehalf) {
      onbehalf = '&onbehalf=' + onbehalf
    }
    else {
      onbehalf = ''
    }
    if (value) {
      value = '&city_name=' + value
    }
    else {
      value = ''
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/frequent_city?from_place=1&page=' + page + value + onbehalf, { 'headers': headers })
    //return this.http.get<any>(taURL + 'taserv/insert_ta_city?city_name=' + value + '&page=' + page, { 'headers': headers })
  }
  public officialchange(payload): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = payload
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/personal_official", body, { 'headers': headers })
  }


  public getchatsummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/chat_summary?page=" + page, { 'headers': headers })
  }

  public inprogress(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/admin_reserv", body, { 'headers': headers })
  }

  public reqreject(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/requirement_reject", body, { 'headers': headers })
  }

  public getalltoursummary(page, date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/all_tour_report?requested_date=" + date + '&page=' + page, { 'headers': headers })
  }
  public getsearchalltoursummary(tourid, page, startdate, enddate, reqtype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((tourid != undefined || tourid != null) && (startdate != undefined || startdate != null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + 'taserv/nac_report?view=1&type=' + reqtype + '&tour_no=' + tourid + '&start_date=' + startdate + '&end_date=' + enddate + "&page=" + page, { 'headers': headers })

    }
    else if ((tourid == undefined || tourid == null) && (startdate != undefined || startdate != null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + 'taserv/nac_report?view=1&type=' + reqtype + '&start_date=' + startdate + '&end_date=' + enddate + "&page=" + page, { 'headers': headers })
    }
    else if ((tourid != undefined || tourid != null) && (startdate == undefined || startdate == null) && (enddate == undefined || enddate == null)) {
      return this.http.get<any>(taURL + 'taserv/nac_report?view=1&type=' + reqtype + '&tour_no=' + tourid + "&page=" + page, { 'headers': headers })
    }
    else if ((tourid != undefined || tourid != null) && (startdate != undefined || startdate != null) && (enddate == undefined || enddate == null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=1&type=" + reqtype + "&tour_no=" + tourid + '&start_date=' + startdate + "&page=" + page, { 'headers': headers })

    }
    else if ((tourid != undefined || tourid != null) && (startdate == undefined || startdate == null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=1&type=" + reqtype + "&tour_no=" + tourid + '&end_date=' + enddate + "&page=" + page, { 'headers': headers })

    }
    else if ((tourid == undefined || tourid == null) && (startdate == undefined || startdate == null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=1&type=" + reqtype + "&end_date=" + enddate + "&page=" + page, { 'headers': headers })
    }
    else if ((tourid == undefined || tourid == null) && (startdate != undefined || startdate != null) && (enddate == undefined || enddate == null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=1&type=" + reqtype + "&start_date=" + startdate + "&page=" + page, { 'headers': headers })

    }
    else {
      return this.http.get<any>(taURL + "taserv/nac_report?view=1&type=" + reqtype + "&page=" + page, { 'headers': headers })

    }

  }

  public getsearchalltoursummarydownload(tourid, page, startdate, enddate, reportdownload): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((tourid != undefined || tourid != null) && (startdate != undefined || startdate != null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + 'taserv/nac_report?view=0&tour_no=' + tourid + '&start_date=' + startdate + '&end_date=' + enddate + '&type=' + reportdownload + "&page=" + page, { 'headers': headers, responseType: 'blob' as 'json' })

    }
    else if ((tourid == undefined || tourid == null) && (startdate != undefined || startdate != null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + 'taserv/nac_report?view=0&start_date=' + startdate + '&end_date=' + enddate + '&type=' + reportdownload + "&page=" + page, { 'headers': headers, responseType: 'blob' as 'json' })
    }
    else if ((tourid != undefined || tourid != null) && (startdate == undefined || startdate == null) && (enddate == undefined || enddate == null)) {
      return this.http.get<any>(taURL + 'taserv/nac_report?view=0&tour_no=' + tourid + '&type=' + reportdownload + "&page=" + page, { 'headers': headers, responseType: 'blob' as 'json' })
    }
    else if ((tourid != undefined || tourid != null) && (startdate != undefined || startdate != null) && (enddate == undefined || enddate == null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=0&tour_no=" + tourid + '&start_date=' + startdate + '&type=' + reportdownload + "&page=" + page, { 'headers': headers, responseType: 'blob' as 'json' })

    }
    else if ((tourid != undefined || tourid != null) && (startdate == undefined || startdate == null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=0&tour_no=" + tourid + '&end_date=' + enddate + '&type=' + reportdownload + "&page=" + page, { 'headers': headers, responseType: 'blob' as 'json' })

    }
    else if ((tourid == undefined || tourid == null) && (startdate == undefined || startdate == null) && (enddate != undefined || enddate != null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=0&end_date=" + enddate + '&type=' + reportdownload + "&page=" + page, { 'headers': headers, responseType: 'blob' as 'json' })
    }
    else if ((tourid == undefined || tourid == null) && (startdate != undefined || startdate != null) && (enddate == undefined || enddate == null)) {
      return this.http.get<any>(taURL + "taserv/nac_report?view=0&start_date=" + startdate + '&type=' + reportdownload + "&page=" + page, { 'headers': headers, responseType: 'blob' as 'json' })

    }
    else {
      return this.http.get<any>(taURL + "taserv/nac_report?view=0&type=" + reportdownload + '&page=' + page, { 'headers': headers, responseType: 'blob' as 'json' })

    }

  }

  public gettourrequirements(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/get_requirements_admin?tour_id=" + id, { 'headers': headers })
  }


  public gettravelreportdropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/report", { 'headers': headers })
  }

  public getcabtypes(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/cab_type", { 'headers': headers })
  }

  public getdeletechatmessage(chatid, tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/delete_chat_box?chatid=" + chatid + "&tourid=" + tourid, { 'headers': headers })
  }

  public getcitysearch(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/insert_ta_city?city_name=' + value + '&page=' + page, { 'headers': headers })
  }

  public getstatesearch(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/state_dropdown?state_name=' + value + '&page=' + page, { 'headers': headers })
  }


  public citytype(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/citytype_dropdown", { 'headers': headers })
  }

  public cityadd(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/insert_ta_city", body, { 'headers': headers })
  }

  public citydelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/city_delete/" + id, { 'headers': headers })
  }

  public cityedit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/insert_ta_city", body, { 'headers': headers })
  }
  //Holiday Page
  public getholidaydetails(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Serveice getting called")
    return this.http.get<any>(taURL + 'taserv/holiday?date=' + value + '&page=' + page, { 'headers': headers })
  }
  public holidayedit(CreateList): Observable<any> {
    console.log("errors in Servicesss")
    CreateList["Holiday Name"] = CreateList.holidayname
    CreateList.Date = CreateList.datess
    CreateList.State = 1 //CreateList.id
    delete CreateList.holidayname
    delete CreateList.datess
    delete CreateList.id
    let CreateList1 = CreateList
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList1)
    console.log(body);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/holiday", body, { 'headers': headers })
    //"Holiday Name":"pongal", "Date":2022:02:01

    //const body1 = [];
    //body1.push(body);
    //console.log(body1)


  }
  public cityfileadd(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    let formData = new FormData();
    formData.append('file', CreateList);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/city_file", formData, { 'headers': headers })
  }

  public holidaydelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/holiday/" + id, { 'headers': headers })
  }
  public holidayadd(CreateList): Observable<any> {
    this.reset();
    console.log("Entering in Add Services")
    CreateList["Holiday Name"] = CreateList.holidayname
    CreateList.Date = CreateList.date
    CreateList.State = 1 //CreateList.id
    delete CreateList.holidayname
    delete CreateList.date
    delete CreateList.id
    let CreateList1 = CreateList

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList1)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/holiday", body, { 'headers': headers })
  }
  public uploadholiday(formData): Observable<any> {
    console.log("error in upload file service");
    console.log(formData)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(taURL + "taserv/holiday_file", formData, { 'headers': header })
  }


  public gettravelreasondetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Serveice getting called")
    return this.http.get<any>(taURL + 'taserv/tourreason', { 'headers': headers })
  }
  public travelreasondelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/tour_reason/" + id, { 'headers': headers })
  }
  public travelreasonedit(CreateList): Observable<any> {
    console.log(CreateList)
    console.log("errors in Servicesss")
    CreateList.code = CreateList.id
    CreateList.fileupload = 0
    // delete CreateList.id
    let CreateList1 = CreateList
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList1)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/tourreason", body, { 'headers': headers })

  }
  public travelreasonadd(CreateList): Observable<any> {
    console.log("errors in Servicesss")
    /*CreateList["Holiday Name"] = CreateList.holidayname */
    //CreateList.code = CreateList.id
    CreateList.fileupload = 0 //CreateList.id
    CreateList.code = 1
    let CreateList1 = CreateList
    console.log("C" + CreateList)
    console.log("C1" + CreateList1)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList1)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/tourreason", body, { 'headers': headers })

  }
  public gettravelexpensedetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Serveice getting called")
    return this.http.get<any>(taURL + 'taserv/tour_expense', { 'headers': headers })
  }

  //travelexpenseedit
  public travelexpenseedit(CreateList): Observable<any> {
    console.log(CreateList)
    console.log("errors in Servicesss")
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/tour_expense", body, { 'headers': headers })

  }
  //travelexpenseadd
  public travelexpenseadd(CreateList): Observable<any> {
    console.log(CreateList)
    console.log("errors in Servicesss")
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/tour_expense", body, { 'headers': headers })

  }
  //travelexpensedelete

  public travelexpensedelete(id): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/tour_expense/" + id, { 'headers': headers })

  }
  //getSearchdata


  public getSearchdatas(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tour_expense?expense=' + value + '&page=' + page, { 'headers': headers })
  }
  //getreasonsearch
  public getreasonsearch(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourreason?name=' + value + '&page=' + page, { 'headers': headers })
  }
  public getreasonsearches(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourreason?name=' + value + '&page=' + page, { 'headers': headers })
  }

  public getfromtoplaces(value, page, onbehalf): Observable<any> {
    this.reset();
    if (onbehalf) {
      onbehalf = '&onbehalf=' + onbehalf
    }
    else {
      onbehalf = ''
    }
    if (value) {
      value = '&city_name=' + value
    }
    else {
      value = ''
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/frequent_city?from_place=0&page=' + page + value + onbehalf, { 'headers': headers })
    //return this.http.get<any>(taURL + 'taserv/insert_ta_city?city_name=' + value + '&page=' + page, { 'headers': headers })
  }

  public commondropdownedit(CreateList): Observable<any> {
    this.reset();
    let myobj = { "data": [CreateList] };

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(myobj)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/common_dropdown", body, { 'headers': headers })
  }

  public commondropdowndetailedit(CreateList): Observable<any> {
    this.reset();
    let myobj = { "data": CreateList };
    //let body = JSON.stringify(myobj);
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(myobj)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/common_dropdown_details", body, { 'headers': headers })
  }



  public getundochatmessage(chatid, tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/undo_chat_box?chatid=" + chatid + "&tourid=" + tourid, {}, { 'headers': headers })
  }
  public tourstatusdropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/admin_tour ", { 'headers': headers })
  }

  public getnonbaselist(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/base_location", { 'headers': headers })
  }

  public skiprmapproval(tourno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/rm_skip/" + tourno, {}, { 'headers': headers })
  }

  public getreportreq(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/req_report", { 'headers': headers })
  }

  public getexcelformat() {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/requirement_excel_format", { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public invoiceupload(file,repreq) {
    this.reset();
    let formData = new FormData();
    formData.append('file', file);
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/requirement_amount_update?booking_type="+repreq, formData, { 'headers': headers })
  }
  public invoicevalidation(file,repreq) {
    this.reset();
    let formData = new FormData();
    formData.append('file', file);
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/requirement_update_validation?booking_type="+repreq, formData, { 'headers': headers })
  }
  public getcabsegment(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/cab_dropdown", { 'headers': headers })
  }
  //getroomtype
  public getroomtype(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/common_dropdown_get/accommondation_type", { 'headers': headers })
  }
}


