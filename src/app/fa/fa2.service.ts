// Write off screen Service
// Split  screen service
// merge screen service
// impairment screen service

import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { faShareService } from './share.service';
import { environment } from 'src/environments/environment';


const faUrl =environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class Fa2Service {
  

  constructor(private http: HttpClient, private idle: Idle, private share: faShareService,private httpBackend:HttpBackend) { 
    this.http=new HttpClient(this.httpBackend);
  }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////// Write Off
//////////////////////////////////////////////////////////////////////////////Write off asset summary 
public getAssetWriteOffsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/writeoff_maker?page=" + pageNumber, { 'headers': headers })
  }
//////////////////////////////////////////////////////////////////////////// Write off summary search
  public getwriteOffsummarySearch(search): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl +'faserv/writeoff_maker_summarysearch', search, { 'headers': headers })
  }



/////////////////// Add  
/////////////////////////////////////////////////////////////////// write off add summary search
  public getassetWriteOffAddSummarySearch(search,pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl + 'faserv/writeoff_add?page=' + pageNumber, search, { 'headers': headers })
  }
/////////////////////////////////////////////////////////////////// write off get for summary
public getAssetWriteOffIdData(id):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  
  return this.http.get<any>(faUrl + "faserv/assetdetails_get/"+id,{'headers':headers });

}
////////////////////////////////////////////////////////////////////Write Off Create
public WriteOffCreate(writeOff): Observable<any> {
  this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(writeOff)
    const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/writeoff', data, { 'headers': headers })
}


//////////////////////////////////////////////////////////////////////////// write off Approval summary 
public getAssetWriteOffApprovalsummary(pageNumber = 1, pageSize = 10): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return this.http.get<any>(faUrl + "faserv/writeoff_checker?page=" + pageNumber, { 'headers': headers, params })
}

////////////////////////////////////////////////////////////////////////// write off approval summary search
public getwriteOffApprovalsummarySearch(search): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/writeoff_checker_search', search, { 'headers': headers })
}


////////////////////////////////////////////////////////////////////////// write off approval submit
public WriteOffCheckerSubmit(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/writeoff_checker', data, { 'headers': headers })
}







/////////////////////////////////////////////////////////////////////////////////////////////////////////////// Impairment
//////////////////////////////////////////////////////////////////////Impairment summary
//   public getAssetImpairmentsummary(pageNumber = 1, pageSize = 10): Observable<any> {
//     this.reset();
//     const getToken: any = localStorage.getItem('sessionData')
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//     let params: any = new HttpParams();
//     params = params.append('page', pageNumber.toString());
//     params = params.append('pageSize', pageSize.toString());
//     return this.http.get<any>(faUrl + "?page=" + pageNumber, { 'headers': headers, params })
//   }
// /// summary search impairment
//   public getAssetImpairmentsummarySearch(search): Observable<any> {
//     this.reset();
//     const getToken: any = localStorage.getItem('sessionData')
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//     return this.http.post<any>(faUrl + '', search, { 'headers': headers })
//   }

//////Approval summary impairment
//   public getAssetImpairmentApprovalsummary(pageNumber = 1, pageSize = 10): Observable<any> {
//     this.reset();
//     const getToken: any = localStorage.getItem('sessionData')
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//     let params: any = new HttpParams();
//     params = params.append('page', pageNumber.toString());
//     params = params.append('pageSize', pageSize.toString());
//     return this.http.get<any>(faUrl + "?page=" + pageNumber, { 'headers': headers, params })
//   }

// ///////Approval summary search impairment
//   public getAssetImpairmentApprovalsummarySearch(search): Observable<any> {
//     this.reset();
//     const getToken: any = localStorage.getItem('sessionData')
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//     return this.http.post<any>(faUrl + '', search, { 'headers': headers })
//   }

///////////// Impairment add screen summary search
  // public getAssetImpairmentAddsummarySearch(search,pageNumber,pageSize ): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   return this.http.post<any>(faUrl + ''+ "?page=" + pageNumber, search, { 'headers': headers, params })
  // }




/////////////////////////////////////////////////////////////////////////////////////////////////////////// Split

  public getAssetSplitsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/split_maker?page=" + pageNumber, { 'headers': headers, params })
  }

  public getAssetSplitsummarySearch(search): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl + 'faserv/split_maker_search', search, { 'headers': headers })
  }


  public getAssetSplitSourcesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/split_checker?page=" + pageNumber, { 'headers': headers, params })
  }

  public getAssetSplitSourcesummarySearch(search): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl + 'faserv/split_checker_search', search, { 'headers': headers })
  }

  public getAssetSplitCheckersummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "?page=" + pageNumber, { 'headers': headers, params })
  }


///////////// split add screen summary search
public getAssetsplitAddsummarySearch(search,pageNumber,pageSize ): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/search_writeoff_add?page='+pageNumber, search, { 'headers': headers })
}


/////////////////////////////////////////////////////////////////// write off get for summary
public getAssetSplitIdData(id):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/split_get?query="+id,{'headers':headers });

}

public SplitCheckerSubmit(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/split_checker', data, { 'headers': headers })
}

public SplitSubmit(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/split_maker', data, { 'headers': headers })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////// Merge 
//////////////////////////////////////////////////////////////////////////////Merge asset summary 
public getAssetMergesummary(pageNumber = 1, pageSize = 10): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return this.http.get<any>(faUrl + "faserv/merge_maker?page=" + pageNumber, { 'headers': headers })
}
//////////////////////////////////////////////////////////////////////////// Merge summary search
public getMergesummarySearch(search): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl +'faserv/merge_maker_search', search, { 'headers': headers })
}



/////////////////// Add  
/////////////////////////////////////////////////////////////////// Merge add summary search
public getassetMergeAddSummarySearch(search,pageNumber): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/search_writeoff_add?page=' + pageNumber, search, { 'headers': headers })
}
/////////////////////////////////////////////////////////////////// Merge get for summary
public getAssetMergeIdData(id):Observable<any>{
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }

return this.http.get<any>(faUrl + "faserv/assetdetails_get/"+id,{'headers':headers });

}
////////////////////////////////////////////////////////////////////Merge Create
public MergeCreate(Merge): Observable<any> {
this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let data = JSON.stringify(Merge)
  const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(faUrl + 'faserv/merge_maker', data, { 'headers': headers })
}


//////////////////////////////////////////////////////////////////////////// Merge Approval summary 
public getAssetMergeAppsummary(pageNumber = 1, pageSize = 10): Observable<any> {
this.reset();
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }
let params: any = new HttpParams();
params = params.append('page', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
return this.http.get<any>(faUrl + "faserv/merge_checker?page=" + pageNumber, { 'headers': headers, params })
}

//////////////////////////////////////////////////////////////////////////Merge approval summary search
public getAssetMergeAppsummarySearch(search): Observable<any> {
this.reset();
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(faUrl + 'faserv/merge_checker_search', search, { 'headers': headers })
}


////////////////////////////////////////////////////////////////////////// Merge approval submit
public MergeCheckerSubmit(data): Observable<any> {
this.reset();
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(faUrl + 'faserv/merge_checker', data, { 'headers': headers })
}








//////////////////////////////////////////////////////////////////////////////Impairment asset summary 
public getAssetImpairsummary(pageNumber = 1, pageSize = 10): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return this.http.get<any>(faUrl + "faserv/impair_maker?page=" + pageNumber, { 'headers': headers })
}
//////////////////////////////////////////////////////////////////////////// Impairment summary search
public getImpairsummarySearch(search): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl +'faserv/impair_maker_search', search, { 'headers': headers })
}



/////////////////// Add  
///////////////////////////////////////////////////////////////////Impairment add summary search
public getassetImpairAddSummarySearch(search,pageNumber): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/search_impair_add?page=' + pageNumber, search, { 'headers': headers })
}
///////////////////////////////////////////////////////////////////Impairment get for summary
public getAssetImpairIdData(id):Observable<any>{
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }

return this.http.get<any>(faUrl + "faserv/assetdetails_get/"+id,{'headers':headers });

}
////////////////////////////////////////////////////////////////////Impairment Create
public ImpairCreate(Impair): Observable<any> {
this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let data = JSON.stringify(Impair)
  const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(faUrl + 'faserv/impair_maker', data, { 'headers': headers })
}


////////////////////////////////////////////////////////////////////////////Impairment Approval summary 
public getAssetImpairApprovalsummary(pageNumber = 1, pageSize = 10): Observable<any> {
this.reset();
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }
let params: any = new HttpParams();
params = params.append('page', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
return this.http.get<any>(faUrl + "faserv/impair_checker?page=" + pageNumber, { 'headers': headers, params })
}

//////////////////////////////////////////////////////////////////////////Impairment approval summary search
public getImpairApprovalsummarySearch(search): Observable<any> {
this.reset();
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(faUrl + 'faserv/impair_checker_search', search, { 'headers': headers })
}


////////////////////////////////////////////////////////////////////////// Impairment approval submit
public ImpairCheckerSubmit(data): Observable<any> {
this.reset();
const getToken: any = localStorage.getItem('sessionData')
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token
const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(faUrl + 'faserv/impair_checker', data, { 'headers': headers })
}



////////////////////////////////////////////////////////////////////////////// asset cgu map summary 
public getAssetDataCGUmapSummarySearch(search,pageNumber): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/search_impairmapping?page=' + pageNumber, search, { 'headers': headers })
}


public ImpairMasterSubmit(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + 'faserv/cgumaster', data, { 'headers': headers })
  }

  public getcgunamedata(value:string,page):Observable<any>{
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl+"faserv/search_cgu_name?query="+value+"&page="+page ,{'headers':headers });

  }
  public ImpairMappingSubmit(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl + 'faserv/cgu_mapping', data, { 'headers': headers })
    }


    public getSplitBarcodeId(id,count):Observable<any>{
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      
      return this.http.get<any>(faUrl + "faserv/codegenerator_split?query="+id+"&count="+count,{'headers':headers });
      
      }























}