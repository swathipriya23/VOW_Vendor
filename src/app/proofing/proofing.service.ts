import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Idle } from '@ng-idle/core';
import { environment } from 'src/environments/environment';


const proofUrl = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class ProofingService {
  idleState = 'Not started.';
  timedOut = false;
  constructor(private idle: Idle, private http: HttpClient) { }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getTemplate(pageNumber = 1): Observable<any> {
    this.reset();
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(proofUrl + 'prfserv/template', { headers, params })
  }

  public getProofingdata(pjson: any, accountid): Observable<any> {
    this.reset();
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    let url = '';
    url = proofUrl + 'prfserv/transaction/' + accountid
    // url = proofUrl + 'prfserv/wisfin_transaction?account_number=175001100&from_date=2021-12-06&to_date=2021-12-08'
    const headers = { 'Authorization': 'Token ' + token }
    // console.log(url);
    // console.log("Body", pjson)
    return this.http.post<any>(url, pjson, { headers })
  }
  public getProofingData(pjson: any, accountid,fromdate, todate): Observable<any> {
    this.reset();
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    let url = '';
    // url = proofUrl + 'prfserv/transaction/' + accountid
    url = proofUrl + 'prfserv/wisfin_transaction?account_number=175001100&from_date=2019-01-01&to_date=2022-01-01'
    const headers = { 'Authorization': 'Token ' + token }
    // console.log(url);
    // console.log("Body", pjson)
    return this.http.post<any>(url, pjson, { headers })
  }

  public getLabel(): Observable<any> {
    this.reset();
    let token ='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/label', { headers  , responseType: "json"})
  }

  public mapLabelToProofData(pjson: any, Labelid: any, type: any): Observable<any> {
    this.reset();
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    let idValue = Labelid
    console.log('pjson1', pjson)
      console.log("maping")
    // const url=proofUrl + 'prfserv/labelassign/' + idValue + '?Type=' + type	
    let url = proofUrl + 'prfserv/assignlabel'
    if (type === 'Remove') {
      url = proofUrl + 'prfserv/labelassign/' + idValue + '?Type=' + type
    }
    if (type === 'Assgin') {
      url = proofUrl + 'prfserv/labelassign/' + idValue + '?Type=' + type
    }
    const headers = { 'Authorization': 'Token ' + token }
    // console.log(url);
    // console.log("Body", pjson)
    return this.http.post<any>(url, pjson, { headers })

  }
  // public update_remarks(pjson: any, Labelid:any): Observable<any> {	
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   // const body = JSON.stringify(CreateList)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   // console.log("Body", pjson)
  //   let url=proofUrl + "prfserv/label/"+Labelid+'/description'
  //   return this.http.post<any>(url, pjson, { 'headers': headers })

  // }
  public approveService(pjson: any, status: any): Observable<any> {
    this.reset();
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}

    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", pjson)
    let url = proofUrl + "prfserv/upload_process?status=" + status + '&type=Account'
    // console.log(url);
    return this.http.post<any>(url, pjson, { 'headers': headers })

  }
  public createTemplateForm(CreateList: any): Observable<any> {
    this.reset();
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(proofUrl + "prfserv/proofingtemplate", body, { 'headers': headers })
  }

  public uploadDocument(id: any, accountid: any, upload: any): Observable<any> {
    this.reset();
    let idValue = id
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    let formData = new FormData();
    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/proofingdocument/document/' + idValue + '/' + accountid, formData, { 'headers': headers })

  }
  public get_uploaddata(id: any, accountid: any): Observable<any> {
    this.reset();
    let idValue = id
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/upload_viewdata/' + accountid, { 'headers': headers })
  }

  public uploadPreview(id: any): Observable<any> {
    let idValue = id
    let token =''
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/proofingdocument/' + idValue, { headers, responseType: 'blob' as 'json' })

  }


  public getTemplateDD(): Observable<any> {
    this.reset();
    let token =''
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token}
    const headers = { 'Authorization': 'Token ' + token }
    // console.log('token',token)
    return this.http.get<any>(proofUrl + 'prfserv/template', { headers , responseType: "json"} );
  }

  public getAccount_List(): Observable<any> {
    this.reset();
    let token =''
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/accounts?page=1', { headers  , responseType: "json"})
  }


  public proofingLabelSort(fromdate, todate, type, accountid) {
    this.reset();
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}

    let json = {
      "fromdate": fromdate,
      "todate": todate
    }
    let JsonData = Object.assign({}, json)
    let jsonData = JSON.stringify(JsonData)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("balanced_transaction", jsonData)
    let url = ""
    if (type === 'All') {
      url = proofUrl + 'prfserv/balanced_transaction/' + accountid;
    }
    if (type === 'Mapped') {
      url = proofUrl + 'prfserv/balanced_transaction/' + accountid + '?type=knockup';
    }
    if (type === 'Partially Mapped') {
      url = proofUrl + 'prfserv/balanced_transaction/' + accountid + '?type=unknockup';
    }
    // console.log('proofingLabelSort', url)
    return this.http.post<any>(url, jsonData, { 'headers': headers })
  }

  public userDescription(id: any, description: any): Observable<any> {
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    let idValue = id;
    let value = {
      "transaction_id": [idValue]
    }
    let jsonValue = Object.assign({}, description, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction_description", jsonValue, { 'headers': headers })
  }


  public uploadTransactionImages(id: any, transactionFile: any): Observable<any> {
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    let idValue = id;
    let file = transactionFile;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction/" + idValue + "/transactiondocument", file, { 'headers': headers })
  }


  public transactionDownload(id: any): Observable<any> {
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "docserv/document/download/" + idValue, { headers, responseType: 'blob' as 'json' })
  }

  public uploadLabelImages(id: any, labelFile: any): Observable<any> {
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    let idValue = id
    let file = labelFile
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/label/" + idValue + "/labeldocument", file, { 'headers': headers })
  }

  public labelDownload(id: any): Observable<any> {
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "docserv/document/download/" + idValue, { headers, responseType: 'blob' as 'json' })
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
    return this.http.get<any>(proofUrl + "prfserv/accounts?page=" + pageNumber, { 'headers': headers })
  }
  public acctDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(proofUrl + "prfserv/accounts/" + idValue, { 'headers': headers })

  }
  public getTemplateList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(proofUrl + "prfserv/template?page=" + pageNumber, { 'headers': headers })
  }
  public templateDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(proofUrl + "prfserv/template/" + idValue, { 'headers': headers })

  }
  public agingsearch(aging): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=type
    // console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(proofUrl + "prfserv/proofingreport_details", aging,{ 'headers': headers })
  }  
  public aging(aging): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=type
    // console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(proofUrl + "prfserv/proofingreport_details?flag=report", aging,{ 'headers': headers })
  } 
  public aging_exceldownload(from_days,to_days,params): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/aging_exceldownload?from_days="+from_days+"&to_days="+to_days,params,{ headers, responseType: 'blob' as 'json' })
    
  } 
  public transactiondownload(id: any,type:any): Observable<any> {
    let token='';
    const getToken = localStorage.getItem("sessionData");
    if (getToken){
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token}
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction_exceldownload?account_id=" + idValue,type, { headers, responseType: 'blob' as 'json' })
  } 
}