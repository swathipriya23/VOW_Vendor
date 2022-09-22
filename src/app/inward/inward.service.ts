import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';


const inwardUrl = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class DataService {
  idleState = 'Not started.';
  timedOut = false;
  inwardFormJson: any;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  constructor(private idle: Idle, private http: HttpClient) { }

  public getPinCode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/pincode', { 'headers': headers })
  }

  public getCity(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/city', { 'headers': headers })
  }

  public getState(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/state', { 'headers': headers })
  }

  public getDistrict(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/district', { 'headers': headers })
  }

  public getDesignation(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/designation', { 'headers': headers })
  }
  public getContactType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/contacttype', { 'headers': headers })
  }



  public courierCreateForm(courier: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(courier)
    // console.log("COU", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'mstserv/courier', data, { 'headers': headers })
  }



  public channelCreateForm(channel: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(channel)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("CHANNEL HEADE", headers)
    return this.http.post<any>(inwardUrl + 'mstserv/channel', data, { 'headers': headers })
  }


  public documentCreateForm(document: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(document)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'mstserv/Documenttype', data, { 'headers': headers })
  }


  public getDocument(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(inwardUrl + 'mstserv/Documenttype', { headers, params })
  }

  public getChannel(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(inwardUrl + 'mstserv/channel', { headers, params })
  }

  public getCourier(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(inwardUrl + 'mstserv/courier', { headers, params })
  }




  public getInwardSummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(inwardUrl + 'inwdserv/inward', { headers, params })
  }

  public createInwardForm(inwardForm: any, iddata): Observable<any> {
    this.reset();
    if (inwardForm.channel == 1) {
      let courierdata 
      if(typeof inwardForm.courier == 'string' ){
        courierdata = inwardForm.courier
      }else{
        courierdata = inwardForm.courier.id
      }
      let json: any = {
        "courier_id": courierdata,
        "channel_id": inwardForm.channel,
        "inwardfrom": inwardForm.inwardfrom,
        "noofpockets": inwardForm.noofpockets,
        "awbno": inwardForm.awbno,
        "date": inwardForm.date
      }
      this.inwardFormJson = json
    }
    else {
      let json: any = {
        "channel_id": inwardForm.channel,
        "inwardfrom": inwardForm.inwardfrom,
        "noofpockets": inwardForm.noofpockets,
        "date": inwardForm.date,
        "courier_id": "",
        "awbno": ""
      }
      this.inwardFormJson = json
    }
    if (iddata) {
      let idForUpdate = {
        id: iddata
      }
      this.inwardFormJson = Object.assign({}, idForUpdate, this.inwardFormJson)
    }
    let jsonData = this.inwardFormJson

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // console.log("DATA", jsonData)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/inward', jsonData, { 'headers': headers })
  }




  public getCourierEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/courier/' + idValue, { headers })
  }




  public editCourierForm(data: any, id: number): Observable<any> {
    this.reset();
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
    // console.log("CouiereEdit", body)
    return this.http.post<any>(inwardUrl + 'mstserv/courier', jsonValue, { 'headers': headers })
  }


  public getChannelEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/channel/' + idValue, { headers })
  }



  public editChannelForm(data: any, id: number): Observable<any> {
    this.reset();
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
    // console.log("ChnnaeleEdiii", body)
    return this.http.post<any>(inwardUrl + 'mstserv/channel', jsonValue, { 'headers': headers })
  }





  public getdocumentEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/Documenttype/' + idValue, { headers })
  }



  public editDocumentForm(data: any, id: number): Observable<any> {
    this.reset();
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
    // console.log("ChnnaeleEdiii", body)
    return this.http.post<any>(inwardUrl + 'mstserv/Documenttype', jsonValue, { 'headers': headers })
  }


  public getInwardDetailsView(id: any, pageNumber, pageSize): Observable<any> {
    this.reset();
    let idValue = id
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inwarddetails/' + idValue, { 'headers': headers, params })
  }

  public inwardDetailsClone(header_id: any, row_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = {}
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/inward/' + header_id + '/details/' + row_id + '/clone', body, { headers })
  }


  public inwardDetailsUpload(header_id: any, row_id, fileUpload: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/inward/' + header_id + '/details/' + row_id + '/upload', fileUpload, { headers })
  }

  public escalationType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/escalationtype', { headers })
  }


  public Documenttype(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/Documenttype', { headers })
  }

  public escalationsubtype(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/escalationsubtype', { headers })
  }

  public inwardDetailsViewUpload(json: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.post<any>(inwardUrl + 'inwdserv/inwarddetailupdate', json, { headers })
  }


  public productCategory(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/pdtcat', { headers })
  }

  public productSubCategory(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/prosubcat', { headers })
  }



  public fileDownload(id: any): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + "docserv/document/download/" + id, { headers, responseType: 'blob' as 'json' })
  }

  public employeeBranch(): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + "usrserv/empbranch", { headers })
  }



  public getInwardsummarySearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/inward_summarysearch', searchdel, { 'headers': headers })
  }

  public getChannelFKdd(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/channel_search?query=' + keyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getCourierFKdd(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/courier_search?query=' + keyvalue + '&page=' + pageno, { 'headers': headers })
  }

  // jan 23
  public inwardDetailsIndividualUpdate(header_id: any, row_id, json: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.post<any>(inwardUrl + 'inwdserv/inward/' + header_id + '/details/' + row_id, json, { headers })
  }






  public getChannelsearch(code, name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/channel_summarysearch?code=' + code + '&name=' + name, { headers })
  }

  // public getDocsearch(code, name, page): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(inwardUrl + 'mstserv/document_summarysearch?code=' + code + '&name=' + name + '&page=' + page, { headers })
  // }

  public getCouriersearch(code, name, contactname): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/courier_summarysearch?code='+code+'&name='+ name +'&contact_person='+contactname, { headers })
  }

  public getInwardDetailsearch(keys: any, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/inwardetails_summarysearch?page=' + page, keys, { headers })
  }

  public getbranchFK(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getInwardSummarySearch(data, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.post<any>(inwardUrl + 'inwdserv/inward_summarysearch' + '?page=' + pageno, data, { headers })
  }

  public pushingNewDataToDetails(differenceInCountAndLength): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + '', { headers })
  }

  public getInwardDocAssignSummarySearch(keys: any, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/documentsummarysearch?page='+page , keys, { headers })
  }

  public getInwardDocResponseSummarySearch(keys: any, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/doc_responsesummarysearch' + '?page=' + page, keys, { headers })
  }
  public getInwardDetailsummarySearch(data, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.post<any>(inwardUrl + 'inwdserv/inwardetails_summarysearch' + '?page=' + pageno, data, { headers })
  }


  public detailsBasedOnPacket(headerid, packetno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inwarddetails?inward_id='+headerid+'&packet_no='+packetno, { headers })
  }

  public AddBasedOnCount(headerID, packno, count ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inward/'+headerID+'/packet_no/'+packno+'/count/'+count, { headers })
  }


  public getemployeeFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getemployeeFK(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'usrserv/searchemployee?query=', { 'headers': headers })
  }


  public getassignDeptFK(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'usrserv/searchdepartment?type=all&query='+keyvalue+'&page=' + pageno, { 'headers': headers })
  }

  public ActiontypeDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inward_action', { headers })
  }
  public StatusDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inward_status', { headers })
  }

  public docstatusDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inward_docaction', { headers })
  }


  public postDocAssignUpdate(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/documentassignupdate', data, { headers })
  }

  public postDocResponseUpdate(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/documentresponseupdate', data, { headers })
  }


  public postDocAssignBulkUpdate(data): Observable<any> {
    this.reset();
    let dataToSubmit = {
      id: data.id,
      actiontype: data.actiontype,
      tenor: data.tenor,
      assigndept_id: data.assigndept_id.id,
      assignemployee_id: data.assignemployee_id.id,
      bulk: 1
    }
    const formData: FormData = new FormData();
    let datavalue = JSON.stringify(dataToSubmit)
    formData.append('data', datavalue);
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(inwardUrl + 'inwdserv/documentassignupdate', formData, { headers })
  }

  public docAssignUnAssignstatusDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inward_docstatus', { headers })
  }

  public getSearchstatusList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inward_status', { headers })
  }

  public DeleteInwardDetails(headetId, detailID, packno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(inwardUrl + 'inwdserv/inward_delete/'+headetId+"/"+detailID+"/"+ packno, { headers })
  }


  public gettranhistory(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + "inwdserv/inwardtran/" + id, { 'headers': headers })
  }
  public getDesignationScroll(data:any,page:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/designation?page='+page +'&data='+data, { 'headers': headers })
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
    let urlvalue = inwardUrl + 'mstserv/pincode_search?query=' + pinkeyvalue + '&page=' + pageno;
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
    let urlvalue = inwardUrl + 'mstserv/new_city_search?query=' + citykeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDistrictDropDownscroll(districtkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = inwardUrl + 'mstserv/district_search?query=' + districtkeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getStateDropDownscroll(statekeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (statekeyvalue === null) {
      statekeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = inwardUrl + 'mstserv/state_search?query=' + statekeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDistrictDropDown(districtkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = inwardUrl + 'mstserv/district_search?query=' + districtkeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getPinCodeDropDown(pinkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pinkeyvalue === null) {
      pinkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = inwardUrl + 'mstserv/pincode_search?query=' + pinkeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getCityDropDown(citykeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = inwardUrl + 'mstserv/new_city_search?query=' + citykeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getStateDropDown(statekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (statekeyvalue === null) {
      statekeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = inwardUrl + 'mstserv/state_search?query=' + statekeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDocsearch(code, name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/document_summarysearch?code='+code+'&name='+ name , { headers })
  }
  public DocumenttypeSearchAPI(key, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'mstserv/search_doctype?query='+key+'&page='+page, { headers })
  }
  public fileListViewnward(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + 'inwdserv/inwarddetails_file/'+id, { headers })
  }
  public pdfPopup(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + "inwdserv/fileview/" + id, { headers, responseType: 'blob' as 'json' })
  }
  public imageView(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(inwardUrl + "inwdserv/fileview/" + id, { headers })
  }
}

