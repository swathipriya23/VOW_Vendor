import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { MEMOLIST } from "../model/memointerface";
import { map, retry } from "rxjs/operators";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from "src/environments/environment";


export interface Department {
    id: string;
    name: string;
}
export interface Category {
    id: string;
    name: string;
}
export interface subCategory {
    id: string;
    name: string;
}
export interface Template {
    id: string;
    template: string;
}
const memoUrl = environment.apiURL
// const getToken = localStorage.getItem("sessionData");
// let tokenValue = JSON.parse(getToken);
// let token1 = tokenValue.token

@Injectable()
export class MemoService {
    idleState = 'Not started.';
    timedOut = false;


    mem_URL = environment.apiURL + 'memserv';
    usr_URL = environment.apiURL + 'usrserv';



    constructor(private idle: Idle, private http: HttpClient) {

    }

    public getSender(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(this.usr_URL + '/filter?search=memo_filter', {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    public getFrom(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(this.usr_URL + '/employee', {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    public getCategory1(Categoryvalue: string): Observable<any> {
        this.reset();
        let token='';
        const getToken = localStorage.getItem("sessionData");
        if (getToken){
          let tokenValue = JSON.parse(getToken);
          token = tokenValue.token}
        const headers = { 'Authorization': 'Token ' + token }
        let caturl = memoUrl + "memserv/category_search?query=" + Categoryvalue;
        return this.http.get<any>(caturl, { 'headers': headers })
      }
    
    public getCategory_Dept(Categoryvalue: string,deptid :any): Observable<any> {
        this.reset();
        let token='';
        const getToken = localStorage.getItem("sessionData");
        if (getToken){
          let tokenValue = JSON.parse(getToken);
          token = tokenValue.token}
        const headers = { 'Authorization': 'Token ' + token }
        let caturl = memoUrl + "memserv/category_search?query=" + Categoryvalue + "&department_id=" + deptid;
        // console.log(caturl);
        return this.http.get<any>(caturl, { 'headers': headers })
      }
    
      public getSubCategory1(Categoryvalue: any, id: any): Observable<any> {
        if (id===undefined) {
          return;}
        this.reset();
        let token='';
        const getToken = localStorage.getItem("sessionData");
        if (getToken){
          let tokenValue = JSON.parse(getToken);
          token = tokenValue.token}
        const headers = { 'Authorization': 'Token ' + token }
        let url = memoUrl + "memserv/category_search/" + id + "/subcategory?query=" + Categoryvalue;
        return this.http.get<any>(url, { 'headers': headers })
      }
    

    public get_EmployeeCC(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(this.usr_URL + '/searchemployee', {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    public get_EmployeeList(cckeyvalue, pageno): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        if (cckeyvalue === null) {
            cckeyvalue = "";
        }
        let urlvalue = this.usr_URL + '/memosearchemp?query=' + cckeyvalue + '&page=' + pageno;
        return this.http.get(urlvalue, {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }
    public getApproverdata(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(this.usr_URL + '/employee', {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    public getUserBranch(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(this.usr_URL + '/user_branch', {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    public getMemoSequence(memoid:any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let url = this.mem_URL + '/memo/' + memoid + '/reply_memo';
        return this.http.get(url, {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    public getCloseAndClone(memoid:any): Observable<any> {
        this.reset();   
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let url = this.mem_URL + '/memo/' + memoid + '/closeclone';
        return this.http.get(url, {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    public removeComment_service(commentid:any): Observable<any> {
        this.reset();   
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let url = this.mem_URL + '/ignore_comments/' + commentid;
        return this.http.get(url, {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }
    public getForward(memoid:any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let url = this.mem_URL + '/memo/' + memoid + '/forward_memo';
        return this.http.get(url, {
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }
        )
    }

    findMemoList(
        filter = '2_from_emp', sortOrder = 'asc',
        pageNumber = 1, pageSize = 10): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token

        return this.http.get(this.mem_URL + '/memo', {
            params: new HttpParams()
                .set('filter', filter)
                .set('page', pageNumber.toString()),
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)

        }).pipe(
            map(res => res)
        );
    }

    findMemoList1(
        filter, sortOrder = 'asc',
        pageNumber = 1, pageSize = 10,urlname): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let params: any = new HttpParams();
            params = params.append('page', pageNumber.toString());
            params = params.append('pageSize', pageSize.toString());
            // console.log(params);
        if (urlname==='search'){
            const body = filter;
            return this.http.post(this.mem_URL + '/'+ urlname, body, {params,
                // params: new HttpParams()
                //     .set('page', pageNumber.toString()),
                // params: new HttpParams()
                //     .set('pageSize', pageSize.toString()),
                headers: new HttpHeaders()
                    .set('Authorization', 'Token ' + token)

            }).pipe(
                map(res => res)
            );
        }else{
            return this.http.get(this.mem_URL + '/'+ urlname, {
                params: new HttpParams()
                    .set('page', pageNumber.toString()),
                headers: new HttpHeaders()
                    .set('Authorization', 'Token ' + token)
            }).pipe(
                map(res => res)
            );
        }
    }

    findDeptList(
        filter = '1_to_dept', sortOrder = 'asc',
        pageNumber = 1, pageSize = 10): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(memoUrl + 'usrserv/department', {
            params: new HttpParams()
                .set('page', pageNumber.toString()),
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }).pipe(
            map(res => res)
        );
    }

    findCatList(
        filter = '1_to_dept', sortOrder = 'asc',
        pageNumber = 1, pageSize = 10): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(this.mem_URL + '/category', {
            params: new HttpParams()
                .set('page', pageNumber.toString()),
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)

        }).pipe(
            map(res => res)
        );
    }

    findSubcatList(
        filter = '1_to_dept', sortOrder = 'asc',
        pageNumber = 1, pageSize = 10): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(this.mem_URL + '/category/1/subcategory', {
            params: new HttpParams()
                .set('page', pageNumber.toString()),
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)
        }).pipe(
            map(res => res)
        );
    }


    //category

    public getcategorylist(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(this.mem_URL + "/category", { 'headers': headers })
    }


    
    public getDepartment(deptkeyvalue): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        let url=memoUrl + 'usrserv/searchdepartment?query=' + deptkeyvalue
        // console.log(url);
        return this.http.get<any>(url, { 'headers': headers })
    }

    public getDepartmentPage(deptkeyvalue,pageno,type): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        const headers = { 'Authorization': 'Token ' + token }
        let url=''
        // console.log("type",type);
        if (type === ''){
             url=memoUrl + 'usrserv/searchdepartment?query=' + deptkeyvalue + '&page=' + pageno ;
        }else{
             url=memoUrl + 'usrserv/searchdepartment?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
        }
        // console.log(url);
        return this.http.get<any>(url, { 'headers': headers })
    }

    public getDepartment1(deptkeyvalue,mydept_from): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        let idValue=tokenValue.user_id;
        const headers = { 'Authorization': 'Token ' + token }
        let url='';
        if (mydept_from===true){
             url=memoUrl + 'usrserv/searchdepartment?query=' + deptkeyvalue
            return this.http.get<any>(url, { 'headers': headers })
        }else{
             url=memoUrl + 'usrserv/searchdepartment?type=all&query='+ deptkeyvalue;
            return this.http.get<any>(url , { 'headers': headers })
        }
    }

    public adddept_Toemp(memojson: any, employeeeId: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = employeeeId
        const url = memoUrl + 'usrserv/employee/' + idValue + '/department'
        let object = {
            "method": "add"
        }
        let json = Object.assign({}, memojson, object, idValue)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(url, json, { 'headers': headers })

    }

    public removedept_Fromemp(memojson: any, employeeeId: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = employeeeId
        const url = memoUrl + 'usrserv/employee/' + idValue + '/department'
        let object = {
            "method": "remove"
        }
        let json = Object.assign({}, memojson, object, idValue)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(url, json, { 'headers': headers })

    }
    public get_empTodeptMap(employeeeId: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = employeeeId
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + 'usrserv/employee/' + idValue + '/department', { 'headers': headers })
    }

    public createCategoryForm(memoCreateList: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const body = JSON.stringify(memoCreateList)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(this.mem_URL + '/category', body, { 'headers': headers })

    }




    public editCategoryForm(data: any, id: number): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = id;
        let value = {
            "id": idValue,
        }
        let jsonValue = Object.assign({}, data, value)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(this.mem_URL + '/category', jsonValue, { 'headers': headers })

    }

    //subcategory
    public getsubcategorylist(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(this.mem_URL + '/category/3/subcategory', { 'headers': headers })
    }


    public getCategory(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token

        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(this.mem_URL + '/category', { 'headers': headers })
    }

    public getCategorySearch(catKeyValue): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token

        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(this.mem_URL + '/category_search?query=' + catKeyValue, { 'headers': headers })
    }


    public createSubcategoryForm(data: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const body = JSON.stringify(data)
        let id = data.category_id
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(this.mem_URL + '/category/' + id + '/subcategory', body, { 'headers': headers })
    }


    public editSubcategoryForm(data: any, idValue: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let value = {
            "id": idValue,
        }
        let jsonValue = Object.assign({}, data, value)
        let id = data.category.id
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(memoUrl + "memserv/category/" + id + "/subcategory", jsonValue, { 'headers': headers })
    }

    //department create
    public getdepartmentlist(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + "usrserv/department", { 'headers': headers })
    }

    public creatMemoForm(memoCreateList: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const body = JSON.stringify(memoCreateList)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(memoUrl + "usrserv/department", body, { 'headers': headers })
    }

    public deptEditFrom(data: any, id: number): Observable<any> {
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
        return this.http.post<any>(memoUrl + "usrserv/department", jsonValue, { 'headers': headers })
    }

    //employee to dept
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
        return this.http.get<any>(memoUrl + 'usrserv/employee?page=' + pageNumber, { 'headers': headers })
    }

    public getDepartmentlist(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + "usrserv/department", { 'headers': headers })
    }

    findEmpList(
        filter = '1_to_dept', sortOrder = 'asc',
        pageNumber = 1, pageSize = 10): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        return this.http.get(memoUrl + "usrserv/department", {
            params: new HttpParams()
                //.set('filter',filter )
                .set('sortOrder', sortOrder)
                .set('page', pageNumber.toString())
                .set('pageSize', pageSize.toString()),
            headers: new HttpHeaders()
                .set('Authorization', 'Token ' + token)

        }).pipe(
            map(res => res)
        );
    }

    public getDeptvalue(id: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const idValue = id;
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + 'usrserv/employee/' + idValue, { 'headers': headers })
    }

    public createEmpForm(memoCreateList: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const url = memoUrl + 'usrserv/employee/' + 1 + '/department'
        let object = {
            "method": "add"
        }
        let json = Object.assign({}, memoCreateList, object)
        const body = json
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(url, body, { 'headers': headers })
    }

    public daataForm(memoCreateList: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const url = memoUrl + 'usrserv/employee/' + 1 + '/department'
        let object = {
            "method": "remove"
        }
        let json = Object.assign({}, memoCreateList, object)
        const body = json
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(url, body, { 'headers': headers })
    }

    public get_empTodeptMapping(empId: any,pageno:any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = empId
        const headers = { 'Authorization': 'Token ' + token }
        let url=memoUrl + 'usrserv/employee/' + idValue + '/department?' + 'page=' + pageno;
        return this.http.get<any>(url, { 'headers': headers })
    }

    public get_empTodeptMapping1(type:any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        const headers = { 'Authorization': 'Token ' + token }
        let url=memoUrl + 'usrserv/searchdepartment?type=' + type 
        return this.http.get<any>(url, { 'headers': headers })
    }

    public get_priority(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        const headers = { 'Authorization': 'Token ' + token }
        let url=memoUrl + 'memserv/memopriority';
        return this.http.get<any>(url, { 'headers': headers })
    }

    public adddept_Toemployee(memojson: any, empId: any, admin:any, memo:any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = empId
        let rights = {
            "isadmin": admin,
            "can_create": memo
         }
        const url = memoUrl + 'usrserv/employee/' + idValue + '/department'
        let object = {
            "method": "add"
        }
        let json = Object.assign({}, memojson, object, rights, idValue)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(url, json, { 'headers': headers })
    }

    public removedept_Fromemployee(memojson: any, empId: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = empId
        const url = memoUrl + 'usrserv/employee/' + idValue + '/department'
        let object = {
            "method": "remove"
        }
        let json = Object.assign({}, memojson, object, idValue)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(url, json, { 'headers': headers })
    }
    public creatAccountForm(data: any,account_Id): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token

        let dataToSubmit;
        if (account_Id != '') {
          let id = account_Id
          dataToSubmit = Object.assign({}, { 'id': id }, data)
        }
        else {
          dataToSubmit = data
        }

        const body = JSON.stringify(dataToSubmit)
        let id = dataToSubmit.template_id
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(memoUrl + 'prfserv/template/' + id + '/accounts', body, { 'headers': headers })
    }
    public acctEditFrom(data: any, ids: number): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let value = {
            "id": ids,
        }
        let jsonValue = Object.assign({}, data, value)
        let id = data.template_id
        const headers = { 'Authorization': 'Token ' + token }
        let url = memoUrl + 'prfserv/template/' + id + '/accounts'
        return this.http.post<any>(url, jsonValue, { 'headers': headers })
    }
    public createTemplateForm(CreateList: any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const body = JSON.stringify(CreateList)
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(memoUrl + "prfserv/template", body, { 'headers': headers })
    }
    public tempEditFrom(data: any, id: number): Observable<any> {
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
        return this.http.post<any>(memoUrl + "prfserv/template", jsonValue, { 'headers': headers })
    }
    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }
    public getFileType(): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + 'prfserv/proofing_filetype', { 'headers': headers })
    }
    public getTemplate(tempkeyvalue): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + 'prfserv/template?query=' + tempkeyvalue, { 'headers': headers })
    }
    public getModuleMappingList(empId): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = empId
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + 'usrserv/modulemapping/' + idValue, { 'headers': headers })
    }
    public getPermissionList(empId): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = empId
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + 'usrserv/user/' + idValue, { 'headers': headers })
    }
    public getSingleEmployee(empId): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let idValue = empId
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(memoUrl + 'usrserv/employee/' + idValue, { 'headers': headers })
      }
      public getapproverDropdown(parentkeyvalue,memoid): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        if (parentkeyvalue === null) {
          parentkeyvalue = "";
        // console.log('calling empty');
        }
        let urlvalue = memoUrl + 'memserv/memo/'+memoid+'/assignto_employee?query=' + parentkeyvalue ;
        // console.log(urlvalue);
        return this.http.get(urlvalue, {
        headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
        }
        )
        }
        public getAssignto(id): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData");
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            let idValue = id
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(memoUrl + "memserv/memo/"+idValue+"/assignto_employee", { 'headers': headers })
          }
         
          public createAssignform(CreateList: any,id: number): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData");
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.post<any>(memoUrl + "memserv/memo/"+id+"/iom_actiontaken", body, { 'headers': headers })
        }
        public getSingleEmployee_new(empId): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData");
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            let idValue = empId
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(memoUrl + 'usrserv/employee_get_view/' + idValue, { 'headers': headers })
          }
      
}