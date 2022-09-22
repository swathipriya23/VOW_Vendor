import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { typeSourceSpan } from '@angular/compiler';
// const url = environment.pprURL
const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class DssService {
  idleState = 'Not started.';
  timedOut = false;
 

  constructor(private idle: Idle, private http: HttpClient) { }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
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
  public dss_report_profitorloss(dss_data): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dss_datas=dss_data
    console.log("headgrp_data=>",dss_datas)
    return this.http.post<any>(url + "pprservice/dss_profitorloss_list",dss_datas, { 'headers': headers })
  }
  public dss_average(dss_average): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dss_datas=dss_average
    console.log("headgrp_data=>",dss_datas)
    return this.http.post<any>(url + "pprservice/dss_average_list",dss_average, { 'headers': headers })
  }
  public dss_overall(overall_view): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/overall_dssdate_level_list",overall_view, { 'headers': headers })
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
  // source
  public deletesource(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/modify_source_status?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
  public deletehead(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/modify_status_edit?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
  public deletesubgrp(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/modify_subgroup_status?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
  public deletegl(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/modify_glsubgroup_status?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
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
  


// gl-subgroup
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

// Head-Group
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
// Source
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
  // sub-group
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
}
