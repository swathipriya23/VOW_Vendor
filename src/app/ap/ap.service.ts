import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { ApShareServiceService } from '../ap/ap-share-service.service';
import { environment } from 'src/environments/environment';
import { data } from 'jquery';

// const faUrl = "http://34.68.45.66:9001/"
const apUrl = environment.apiURL
//const apUrl = "http://i08e1eed51fc502e66-generic-tcp.at.remote.it:33000/"



@Injectable({
  providedIn: 'root'
})
export class ApService {
  category_id: number;


  constructor(private http: HttpClient, private idle: Idle, private share: ApShareServiceService) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {

    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getInwardStatus(text,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("  text  "+text)
    return this.http.get<any>(apUrl + 'inwdserv/get_apinward_status?text=' + text + '&page=' + pageno, { 'headers': headers })
  }

  
  public getInwardSummary(pageNumber = 1, pageSize = 10,search): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log("  search  "+search)
   
    return this.http.post<any>(apUrl + 'inwdserv/get_apinward?page=' +pageNumber,search,{ 'headers': headers })
  }

  public getInwardECF(text): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("  text  "+text)
    return this.http.get<any>(apUrl + 'ecfserv/get_ecfno/' + text , { 'headers': headers })
  }

  public getInwardOrgInv(text,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("  text  "+text)
    return this.http.get<any>(apUrl + 'apserv/get_yes_or_no?text=' + text + '&page=' + pageno, { 'headers': headers })
  }

  public docInwAdd(data, files): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', JSON.stringify(data));

    if(files != null || files != undefined ){
      formData.append("file", files);
      // for (var i = 0; i < files.length; i++) {
      //   formData.append("file", files[i]);
      // }
    }
    return this.http.post<any>(apUrl + 'apserv/inwdinvheader', formData, { 'headers': headers })
  }

  public apHeaderAdd(invdet): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/apheader',invdet, { 'headers': headers })
  }

  public invHdrAdd(data: any, id,file: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file !== null) {
      for (var i = 0; i < file.length; i++) {
        formData.append("file1", file[i]);
      }
    }
    // formData.append('file1', file);
    return this.http.post<any>(apUrl + 'apserv/apinvoicehdr/'+id, formData, { 'headers': headers })
  }

  public getECFSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/get_apinwardinvoicehdr/' +id,{ 'headers': headers })
  }  

  public getInwDedupeChk(id,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'apserv/dedupe_check/'+ id + '?type=' + type , { 'headers': headers })
  }

  public getInvMakerSummary(data,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    // console.log("  search  "+search)
   
    return this.http.post<any>(apUrl + 'apserv/get_apinvoiceheader',data,{ 'headers': headers })
  }

  public getInvCheckLst(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/get_apauditchecklist/' +1,{ 'headers': headers })
  }  

  public invCheckLstMap(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/inwdinvheader', data, { 'headers': headers })
  }

  public getHdrSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/get_apheader/' +id,{ 'headers': headers })
  } 
  public updateCredEntryFlag(id, det): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(apUrl + 'apserv/apinvoiceheader/' +id, det,{ 'headers': headers })
  }  

  public updateDebEntryFlag(id, det): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(apUrl + 'apserv/get_apinvdetails/' +id, det,{ 'headers': headers })
  }  
  public getInvHdr(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/apinvoiceheader/' +id,{ 'headers': headers })
  }  

  public delInvHdr(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.delete<any>(apUrl + 'apserv/apinvoiceheader/' +id,{ 'headers': headers })
  }  

  public getInvDetail(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/apinvoicedetails/' +id,{ 'headers': headers })
  }  

  public getInvCredit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/apcredit/' +id,{ 'headers': headers })
  }  

  public entryDebit(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/ap_entrydebit',id, { 'headers': headers })
  }  

  public entryCredit(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/ap_entrydebit?entrytype=apcredit',id, { 'headers': headers })
  }  
///apserv/ap_entrydebit
  public getInvDebit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/apdebit/' +id,{ 'headers': headers })
  }  

  public ppxheader(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/ap_ppxheader?get=true',id, { 'headers': headers })
  }  

  public ppxdetails(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/ap_ppxdetails',data, { 'headers': headers })
  }  

  public ppxDetailsDelete(crno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    let value = {
      "ecfheader_id": crno,
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(apUrl + "apserv/ap_ppxdetails?delete=true&modlue=AP", value, { 'headers': headers })
  }
    
  public getCcbs(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(apUrl + 'apserv/apdebitccbs/' +id,{ 'headers': headers })
  }  

  public ccbsAddEdit(id,ccbsdet): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/apdebitccbs/'+ id, ccbsdet, { 'headers': headers })
  }  

  public ccbsdelete(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.delete<any>(apUrl + 'apserv/get_apdebitccbs/'+ id, { 'headers': headers })
  }

  public getempQuery(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(apUrl + 'apserv/get_empquery?page=' +pageNumber ,{ 'headers': headers })       
  }

  public getempQuerySrch(pageNumber = 1, pageSize = 10,text:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.post<any>(apUrl + 'apserv/searchempquery?page=' +pageNumber , text,{ 'headers': headers })       
  }

  public getEmpQryCrno(crno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'apserv/get_crno/' +crno, { 'headers': headers })
  }

  public getType(text,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("  text  "+text)
    return this.http.get<any>(apUrl + 'apserv/get_aptype?text=' + text + '&page=' + pageno, { 'headers': headers })
  }

  public getBranch(text,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("  text  "+text)
    return this.http.get<any>(apUrl + 'prserv/search_branch?text=' + text + '&page=' + pageno, { 'headers': headers })
  }

  public invDetAddEdit(id,invdet): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/apinvoicedetails/'+ id, invdet, { 'headers': headers })
  }
  
  public invDetDel(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.delete<any>(apUrl + 'apserv/get_apinvdetails/'+ id, { 'headers': headers })
  }

  public invCreditAddEdit(id,creddet): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/apcredit/'+ id, creddet, { 'headers': headers })
  }  

  public invCreditDel(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.delete<any>(apUrl + 'apserv/get_apcredit/'+ id, { 'headers': headers })
  }

  public invCreditEntryDel(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.delete<any>(apUrl + 'apserv/apcredit/'+ id, { 'headers': headers })
  }

  public invDebitAddEdit(id,debdet): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/apdebit/'+ id, debdet, { 'headers': headers })
  }  

  public invDebitDel(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.delete<any>(apUrl + 'apserv/get_apdebit/'+ id, { 'headers': headers })
  }


  //OVERALL SUBMIT
  public OverallAPSubmit(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(apUrl + 'apserv/apfinal_submit', data, { 'headers': headers })
  }  

  public getecftype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apUrl + "ecfserv/get_ecftype", { 'headers': headers, params })
  }

  public getsupplierView(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apUrl + "venserv/supplierbranch/" + id, { 'headers': headers, params })
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

    return this.http.get<any>(apUrl + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername, { headers })
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

    return this.http.get<any>(apUrl + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername + '&page=' + pageno, { headers })
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
    return this.http.get<any>(apUrl + 'venserv/search_supplier?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  }

  public getsuppliertype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apUrl + "ecfserv/get_suppliertype", { 'headers': headers })
  }

  public getcommodity(commoditykeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=', { 'headers': headers })
  }

  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
        }
    let urlvalue = apUrl + 'mstserv/bankbranch?name=' + branchkeyvalue;
    return this.http.get(urlvalue, { 'headers': headers })
  }
 
  public getcommodityscroll(commoditykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (commoditykeyvalue === null) {
      commoditykeyvalue = "";
    }
    return this.http.get<any>(apUrl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=&page=' + pageno, { 'headers': headers })
    // let urlvalue = apUrl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=&page=' + pageno;
    // return this.http.get(urlvalue, {
    //   headers: new HttpHeaders().set('Authorization', 'Token ' + token)})
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
    let urlvalue = apUrl + 'mstserv/bankbranch?query=' + branchkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {headers: new HttpHeaders().set('Authorization', 'Token ' + token)})
  }



  
  public getadvancetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'ecfserv/get_advancetype', { 'headers': headers })
  }
 
 

 
  public gethsnscroll(hsnkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (hsnkeyvalue === null) {
      hsnkeyvalue = "";
    }
    let urlvalue = apUrl + 'mstserv/search_hsncode?query=' + hsnkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public uomscroll(uomkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (uomkeyvalue === null) {
      uomkeyvalue = "";
    }
    let urlvalue = apUrl + 'mstserv/uom_search?query=' + uomkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public gethsn(hsnkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/search_hsncode?query=' + hsnkeyvalue, { 'headers': headers })
  }

  public getuom(uomkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/uom_search?query=' + uomkeyvalue, { 'headers': headers })
  }

  public getproduct(productkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/productsearch?query=' + productkeyvalue, { 'headers': headers })
  }

  public GSTcalculation(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(apUrl + 'ecfserv/get_tax', value, { 'headers': headers })
  }

  public getPaymode(text): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/paymode_search?query=' + text, { 'headers': headers })
  }

  public getdebbankacc(accno: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/bankdetails?account_no='+ accno, { 'headers': headers })
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
    return this.http.get<any>(apUrl + "ecfserv/ecfpayment_list/" + suppid + "/" + paymodeid + "?query=" + accno, { 'headers': headers, params })
  }

  public geteraAcc(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'apserv/get_apraiseraccountdtls/' + id, { 'headers': headers })
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
    return this.http.get<any>(apUrl + 'ecfserv/ecfpaymode_list/' + paymodeid, { 'headers': headers})
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
    return this.http.get<any>(apUrl + "venserv/supplierpaymode/" + suppid + "/" + paymodeid, { 'headers': headers })
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
    return this.http.get<any>(apUrl + "mstserv/paymodecreditgl/" + paymodeid, { 'headers': headers })
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
    return this.http.get<any>(apUrl + 'ecfserv/tds/' + suppid, { 'headers': headers })
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
    return this.http.get<any>(apUrl + 'ecfserv/tdstaxrate?vendor_id=' + vendorid + '&subtax_id=' + id, { 'headers': headers })
  }

  public gettdstaxcalculationOld(creditamount, taxrate): Observable<any> {
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
    return this.http.get<any>(apUrl + 'ecfserv/tdscal/' + creditamount + '/' + taxrate, { 'headers': headers })
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
    return this.http.get<any>(apUrl + 'apserv/aptds_calculation/' + creditamount + '/' + taxrate, { 'headers': headers })
  }

  public gettdsapplicability(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'ecfserv/get_tds', { 'headers': headers })
  }

  getcat(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }

  public getcategoryscroll(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    let urlvalue = apUrl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
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
    return this.http.get<any>(apUrl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue, { 'headers': headers })
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

    let urlvalue = apUrl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(apUrl + 'mstserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })


  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    let urlvalue = apUrl + 'mstserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(apUrl + 'mstserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue, { 'headers': headers })
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
    let urlvalue = apUrl + 'mstserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
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
    return this.http.get<any>(apUrl + "venserv/branch/" + suppid + "/payment", { 'headers': headers, params })
  }


   //APPROVER DROPDOWN
   public getapprover(approverkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (approverkeyvalue === null) {
      approverkeyvalue = "";

    }
    let urlvalue = apUrl + 'prserv/search_employeelimit?commodityid=1&type=ECF&employee=' + approverkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  //APPROVER SCROLL
    public getapproverscroll(approverkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (approverkeyvalue === null) {
        approverkeyvalue = "";
  
      }
      let urlvalue = apUrl + 'prserv/search_employeelimit?commodityid=1&type=ECF&employee=' + approverkeyvalue + '&page=' + pageno;
  
  
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }

    public getsupplierdet(id,invhdrid, subtaxid): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
     
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(apUrl + 'apserv/supplier_report/' + id + '/apinvoiceheader/' + invhdrid
                                      + "?subtax_id=" + subtaxid, { 'headers': headers })
    }


 
	
 
    audicservie(id:any) :Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      
      return this.http.get(apUrl+'apserv/get_apauditchecklist/'+id, { 'headers': header })
    }
    audiokservie(array: any) :Observable<any> {
      
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
      return this.http.post(apUrl+'apserv/auditchecklist_map', array, { 'headers': header })
    }
    bounce(data: any):Observable<any> {
    
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const header = { 'Authorization': 'Token ' + token }
       return this.http.post(apUrl+'apserv/apstatus_update', data, { 'headers': header })
    }

    public fileView(id:any) {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      window.open(apUrl +'apserv/apfiledownload/'+idValue+"?download=true&token="+token, '_blank');
      }

    public downloadfile(id:any) {
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let idValue = id;
      const headers = { 'Authorization': 'Token ' + token }

      return this.http.get<any>(apUrl + 'apserv/apfiledownload/' + id +"?download=true", { 'headers': headers, responseType: 'blob' as 'json' })
      }

      public deleteFileUpload(id:any): Observable<any> {
        this.reset();
        const getToken: any = localStorage.getItem('sessionData')
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        if (id === undefined) {
          id = ""
        }
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.delete<any>(apUrl + 'apserv/apfiledownload/'+id, { 'headers': headers })
      }

      downloadfileapp(id:any):Observable<any> {
        this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(apUrl + 'ecfserv/ecffile/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
        }
        public deletefile(id:any): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.get<any>(apUrl + 'ecfserv/deletefile/'+id, { 'headers': headers })
        }
        public gettdstaxtype1(id): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          let params: any = new HttpParams();
          return this.http.get<any>(apUrl + "venserv/supplier_tax/" + id, { 'headers': headers, params })
        }
        public getvendorid(suppid): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          let params: any = new HttpParams();
          return this.http.get<any>(apUrl + "venserv/branch/" + suppid + "/payment", { 'headers': headers, params })
        }
        public getclientcode(clientkeyvalue): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.get<any>(apUrl + 'mstserv/create_client?name=&code=&page=2' , { 'headers': headers })
        }
        public getclientscroll(clientkeyvalue, pageno): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          if (clientkeyvalue === null) {
            clientkeyvalue = "";
          }
         
          let urlvalue = apUrl + 'mstserv/create_client?name=' + clientkeyvalue + '&code=&page=' + pageno;
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
          return this.http.get<any>(apUrl + 'usrserv/memosearchemp?query='+rmkeyvalue , { 'headers': headers })
        }
        public getrmscroll(rmkeyvalue, pageno): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          if (rmkeyvalue === null) {
            rmkeyvalue = "";
          }
          let urlvalue = apUrl + 'usrserv/memosearchemp?query=' + rmkeyvalue + '&page=' + pageno;
          return this.http.get(urlvalue, {
            headers: new HttpHeaders()
              .set('Authorization', 'Token ' + token)
          }
          )
        }
        	
  public getbusinessproductdd(businesskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/create_bsproduct?query='+businesskeyvalue, { 'headers': headers })
  }
  public getbusinessproductscroll(businesskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (businesskeyvalue === null) {
      businesskeyvalue = "";
    }
    let urlvalue = apUrl + 'mstserv/create_bsproduct?query=' + businesskeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
   
  public getPlaceOfSupply(place): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(apUrl + 'mstserv/state_search?query='+ place, { 'headers': headers })
  }
  public getPlaceOfSupplyscroll(place, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (place === null) {
      place = "";
    }
    let urlvalue = apUrl + 'mstserv/state_search?query=' + place + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
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
    return this.http.get<any>(apUrl + 'ecfserv/get_payto/' + payid, { 'headers': headers })
  }
  
   public getppxdropdown(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(apUrl + "ecfserv/get_ppx", { 'headers': headers, params })
  }
  public uploadCcbsFile(id,file: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    if (file !== null) {
        formData.append("file", file);
    }
    return this.http.post<any>(apUrl + 'apserv/apdebitccbs/' + id + '?upload=true', formData,{ 'headers': headers })
  }


  
  sftpGet(json:any) :Observable<any> {
      
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    return this.http.post(apUrl + "usrserv/sftp_data_list_get", json, { 'headers': header })
  }

  //sftpFileDowload
  public sftpFileDownload(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
   
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(apUrl + "usrserv/sftp_common_download_api", data, { 'headers':headers, responseType: 'blob' as 'json' })
  }
}
