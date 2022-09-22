import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MemoService, Category, subCategory, Department } from "../../service/memo.service";
import { DataService } from '../../service/data.service';
import { SharedService } from '../../service/shared.service';
import { FormControl, FormGroup,  FormBuilder } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { finalize, switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';
import { event } from 'jquery';

const isSkipLocationChange = environment.isSkipLocationChange
export interface iDepartmentList {
  name: string;
  id: number;
  code: string;
  short_notation: string;
}

export interface iEmployeeList {
  full_name: string;
  id: number;
}

export interface PriorityValue {
  id: string;
  name: string;
}
export interface DeptfilterValue {
  id: number;
  name: string;
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};


class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}


@Component({
  selector: 'app-memodept',
  templateUrl: './memodept.component.html',
  styleUrls: ['./memodept.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MemodeptComponent implements OnInit {

  memoSearchForm: FormGroup;
  memocategory = new FormControl();
  memosubcategory = new FormControl();
  memofromdept = new FormControl();
  memotodept = new FormControl();

  isLoading = false;
  isLast: any;
  selectedItem: any;
  categoryList: Array<Category>;
  sub_categoryList: Array<subCategory>;
  departmentList: Array<Department>;
  priorityList: Array<any>;
  memolist: Array<any>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  finaljson: any;
  categoryID: any;
  sort_by: string = "ascending";
  DateSortType: string = '';
  PrioritySortType: string = '';
  sort_field: string;
  SendReceiveTag: any;
  SendReceiveDept:any;
  memourl: any;
  memotype1: any;
  codes: any;
  public mydeptlist: iDepartmentList[];
  public mydeptlistexist: iDepartmentList[];
  mydept_from: boolean = false;

  // sendreceivetype: string[] = ['Pending(For Approval)', 'BTo to me', 'Draft', 'Sent by me', 'Received by me', 'Sent', 'Received'];
  sendreceivetype: string[] = ['Pending for Approver/Recommender','Pending(For Approval)', 'Pending(For Recommendation)','BTo to me', 'Draft', 'Sent by me', 'Received by me', 'Sent', 'Received'];

  urlname = '';
  ApprovalType: any = '';
  public allEmployeeList: iEmployeeList[];
  public chipSelectedEmployeeCC: iEmployeeList[] = [];
  public chipSelectedEmployeeCCid = [];
  public employeeccControl = new FormControl();

  public allEmployeeApprover: iEmployeeList[];
  public chipSelectedEmployeeApprover: iEmployeeList[] = [];
  public chipSelectedEmployeeApproverid = [];
  public employeeApproverControl = new FormControl();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  @ViewChild('employeeccInput') employeeccInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('fromDeptInput') fromDeptInput: any;
  @ViewChild('toDeptInput') toDeptInput: any;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;
  @ViewChild('autoapprover') matAutocomplete1: MatAutocomplete;
  filter2deptid:any;
  filter1search:any
  pagenos:any

  constructor(private memoService: MemoService, private dataService: DataService,
    public sharedService: SharedService, private router: Router,
    private activateRoute: ActivatedRoute, private formBuilder: FormBuilder,
    private datePipe: DatePipe, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {

    this.memoSearchForm = new FormGroup({
      memoapprover: new FormControl(null),
      memodatefrom: new FormControl(null),
      memodateto: new FormControl(null),
      memosubject: new FormControl(null),
      memocategory: new FormControl(null),
      memosubcategory: new FormControl(null),
      memofromdept: new FormControl(null),
      memotodept: new FormControl(null),
      memosendreceive: new FormControl(null),
      mydept: new FormControl(null),
      memopriority: new FormControl(null)
    });
    this.myDepartmentList();
    this.memoSearchForm.get('memopriority').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.get_priority()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.priorityList = datas;
      })
    this.memoSearchForm.get('memofromdept').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getDepartmentPage(value, 1, '')
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList = datas;
      })

    this.memoSearchForm.get('memotodept').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getDepartmentPage(value, 1, '')
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList = datas;
      })

    this.memoSearchForm.get('memocategory').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getCategory1(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      })
    // if (this.categoryID !== undefined){
    this.memoSearchForm.get('memosubcategory').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getSubCategory1(value, this.categoryID)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sub_categoryList = datas;
      })

      

    if (this.employeeccControl !== null) {
      this.employeeccControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.memoService.get_EmployeeList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.allEmployeeList = datas;
        })

    }

    if (this.employeeApproverControl !== null) {
      this.employeeApproverControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.memoService.get_EmployeeList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.allEmployeeList = datas;
        })
    }

    this.memoSearchForm.get('mydept').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.get_empTodeptMapping1('all')
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.mydeptlist = datas;
      })
   
    let get_apptypedata = localStorage.getItem('ls_approvaltypeiom')
    if (get_apptypedata === null){
      get_apptypedata = 'Pending for Approver/Recommender';
    }
    this.filter1search = get_apptypedata
    const get_searchclick = localStorage.getItem('memosearch_datas')
    const getiompageno =  localStorage.getItem("iompagenumber")
    this.pagenos =getiompageno
    const filter2result = localStorage.getItem("filter2search")
    if(filter2result){
      let getsearch_filterdata = JSON.parse(filter2result);
      if(get_apptypedata === "Sent"){
      this.memotype1 = "_from_dept";
      this.ApprovalType = 'Sent';
      this.filter2deptid=getsearch_filterdata.filter2.id
      this.memoSearchForm.patchValue({
       mydept:getsearch_filterdata.filter2
      })
    
      this.memourl = "memo?filter=" +  this.filter2deptid + this.memotype1 + "&mtype=iom";
      if (this.sort_field !== undefined) {
        this.memourl = this.memourl + '&sort_by=' + this.sort_by + '&sort_field=' + this.sort_field
      }
      this.loadMemoList1(this.finaljson, 'asc', this.pagenos, 10, this.memourl);
    }
    
    if(get_apptypedata === "Received"){
      this.memotype1 = "_to_dept";
      this.ApprovalType = 'Received';
       this.filter2deptid=getsearch_filterdata.filter2.id
      this.memoSearchForm.patchValue({
       mydept:getsearch_filterdata.filter2
      })
    
      this.memourl = "memo?filter=" +  this.filter2deptid + this.memotype1 + "&mtype=iom";
      if (this.sort_field !== undefined) {
        this.memourl = this.memourl + '&sort_by=' + this.sort_by + '&sort_field=' + this.sort_field
      }
      this.loadMemoList1(this.finaljson, 'asc', this.pagenos, 10, this.memourl);
    }
     
    

     
    }

    if(getiompageno){
      this.pageno=getiompageno
    }
    if(get_searchclick != null){
      this.memourl = 'search'
      this.finaljson=get_searchclick
      this.loadMemoList1(this.finaljson, 'asc', this.pageno, 10,  this.memourl)

    }
   
   if (get_apptypedata === 'Pending(For Approval)' || (get_apptypedata === null && get_searchclick === null)) {
      let atype = 'Pending(For Approval)';
      this.ApprovalType = "Pending(For Approval)"
      this.sort_field = "created_date";
      this.sort_by = "descending"
      this.DateSortType = "descending"
      this.PrioritySortType = "descending"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'BTo to me') {
      let atype = 'BTo to me';
      this.ApprovalType = "BTo to me"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'Sent by me') {
      let atype = 'Sent by me';
      this.ApprovalType = "Sent by me"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'Received by me') {
      let atype = 'Received by me';
      this.ApprovalType = "Received by me"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'Sent') {
      let atype = 'Sent';
      this.ApprovalType = "Sent"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'Received') {
      let atype = 'Received';
      this.ApprovalType = "Received"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'Draft') {
      let atype = 'Draft';
      this.ApprovalType = "Draft"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'Pending(For Recommendation)') {
      let atype = 'Pending(For Recommendation)';
      this.ApprovalType = "Pending(For Recommendation)"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    if (get_apptypedata === 'Pending for Approver/Recommender') {
      let atype = 'Pending for Approver/Recommender';
      this.ApprovalType = "Pending for Approver/Recommender"
      this.memoSearchForm.patchValue({ memosendreceive: atype });
    }
    const getsearchdata = localStorage.getItem('memosearch_datas')
    if (getsearchdata) {
      let getsearch_data = JSON.parse(getsearchdata);
      if (getsearch_data.from_date !== undefined) {
        this.memoSearchForm.patchValue({ memodatefrom: new Date(getsearch_data.from_date) });
      }
      if (getsearch_data.to_date !== undefined) {
        this.memoSearchForm.patchValue({ memodateto: new Date(getsearch_data.to_date) });
      }
      if (getsearch_data.subject !== undefined) {
        this.memoSearchForm.patchValue({ memosubject: getsearch_data.subject });
      }

      if (getsearch_data.category !== undefined) {
        this.memoSearchForm.patchValue({ memocategory: getsearch_data.searchcategory });
      }
      if (getsearch_data.subcategory !== undefined) {
        this.memoSearchForm.patchValue({ memosubcategory: getsearch_data.subcategory });
      }
      if (getsearch_data.priority !== undefined) {
        this.memoSearchForm.patchValue({ memopriority: getsearch_data.searchpriority });
      }
      if (getsearch_data.cc !== undefined) {
        this.memoSearchForm.patchValue({ memocc: getsearch_data.cc });
      }
      if (getsearch_data.searchapprover !== undefined) {
        for(let i=0;i<getsearch_data.searchapprover.length;i++){
          this.chipSelectedEmployeeApprover.push(getsearch_data.searchapprover[i])
        }
        this.memoSearchForm.patchValue({ memoapprover: this.chipSelectedEmployeeApprover });
      }
      let sender1: any;
      let sender2: any;
      if (getsearch_data.sender !== undefined && getsearch_data.sender[0] !== undefined) {
        sender1 = getsearch_data.sender[0];
      }
      if (getsearch_data.sender !== undefined && getsearch_data.sender[1] !== undefined) {
        sender2 = getsearch_data.sender[1];
      }

      if ((sender1 !== undefined) && sender1.type === 'dept') {
        this.memoSearchForm.patchValue({ memofromdept: sender1 });
      }

      if ((sender2 !== undefined) && sender2.type === 'dept') {
        this.memoSearchForm.patchValue({ memofromdept: sender2 });
      }

      let to1: any;
      let to2: any;
      if (getsearch_data.to !== undefined && getsearch_data.to[0] !== undefined) {
        to1 = getsearch_data.to[0];
      }
      if (getsearch_data.to !== undefined && getsearch_data.to[1] !== undefined) {
        to2 = getsearch_data.to[1];
      }

      if ((to1 !== undefined) && to1.type === 'dept') {
        this.memoSearchForm.patchValue({ memotodept: to1});
      }

      if ((to2 !== undefined) && to2.type === 'dept') {
        this.memoSearchForm.patchValue({ memotodept: to2});
      }
      // if (this.urlname === 'search') {
      //   this.SearchClick();
      // }
      if (get_apptypedata === 'search') {
        this.ApprovalType = "search"
        this.SearchClick();
      }

    } ///if (getsearchdata) {
  }  ///endof nginit
  
 
  idnumber:any
  OnSendReceiveChange(e) {
   
    if (e.isUserInput == true) {
      this.SpinnerService.show();
      this.SendReceiveTag = e.source.value;
     
      
      if (this.SendReceiveTag === 'Sent') {
        this.memotype1 = "_from_dept";
        this.ApprovalType = 'Sent';
        const filter2result = localStorage.getItem("filter2search")
        if(filter2result != null){
        let getsearch_filterdata = JSON.parse(filter2result);
        this.idnumber =getsearch_filterdata.filter2.id
       
        if (this.idnumber === undefined) {
          this.SpinnerService.hide();
           return false;
         
        }
        this.memourl = "memo?filter=" +  this.idnumber + this.memotype1 + "&mtype=iom";
      }else{
        if ( this.SendReceiveDept === undefined) {
          this.SpinnerService.hide();
          return false;
        }
        this.memourl = "memo?filter=" +  this.SendReceiveDept + this.memotype1 + "&mtype=iom";
      }
    }
      if (this.SendReceiveTag === 'Received') {
        this.memotype1 = "_to_dept";
        this.ApprovalType = 'Received';
        const filter2result = localStorage.getItem("filter2search")
        if(filter2result != null){
        let getsearch_filterdata = JSON.parse(filter2result);
        this.idnumber =getsearch_filterdata.filter2.id
       
        if (this.idnumber === undefined) {
          this.SpinnerService.hide();
          return false;
         
        }
        this.memourl = "memo?filter=" +  this.idnumber + this.memotype1 + "&mtype=iom";
      }else{
        if ( this.SendReceiveDept === undefined) {
          this.SpinnerService.hide();
          return false;
        }
        this.memourl = "memo?filter=" +  this.SendReceiveDept + this.memotype1 + "&mtype=iom";
      }
      }
      if (this.SendReceiveTag === 'Pending(For Approval)') {
        this.memotype1 = undefined;
        this.memourl = "memo?type=pending_approval&mtype=iom";
        this.ApprovalType = 'Pending(For Approval)';
      }
      if (this.SendReceiveTag === 'Pending(For Recommendation)') {
        this.memotype1 = undefined;
        this.memourl = "memo?type=pending_approval&mtype=iom&ttype=recommend";
        this.ApprovalType = 'Pending(For Recommendation)';
      }
      if (this.SendReceiveTag === 'Pending for Approver/Recommender') {
        this.memotype1 = undefined;
        this.memourl = "memo?type=pending_approval&mtype=iom&ttype=approver_recommender";
        this.ApprovalType = 'Pending for Approver/Recommender';
      }
      if (this.SendReceiveTag === 'BTo to me') {
        this.memotype1 = undefined;
        this.memourl = "memo?filter=" + this.sharedService.loginUserId + "_to_emp&mtype=iom&ttype=bto";
        this.ApprovalType = 'BTo to me';
      }

      if (this.SendReceiveTag === 'Sent by me') {
        this.memotype1 = undefined;
        this.memourl = "memo?filter=" + this.sharedService.loginUserId + "_from_emp&mtype=iom";
        this.ApprovalType = 'Sent by me';
      }
      if (this.SendReceiveTag === 'Received by me') {
        this.memotype1 = undefined;
        this.memourl = "memo?filter=" + this.sharedService.loginUserId + "_to_emp&mtype=iom";
        this.ApprovalType = 'Received by me';
      }

      if (this.SendReceiveTag === 'Draft') {
        this.memotype1 = undefined;
        this.memourl = 'memo?type=draft&mtype=iom';
        this.ApprovalType = 'Draft';
      }
      if (this.sort_field !== undefined) {
        this.memourl = this.memourl + '&sort_by=' + this.sort_by + '&sort_field=' + this.sort_field
      }
      if( this.filter1search != this.SendReceiveTag){
        this.loadMemoList1(this.finaljson, 'asc',1, 10, this.memourl);
      }
      
      localStorage.removeItem('memosearch_datas')
      localStorage.setItem("ls_approvaltypeiom",this.SendReceiveTag)
      this.loadMemoList1(this.finaljson, 'asc', this.pageno, 10, this.memourl);
    }
  }

  OnSendReceivedeptChange(id) {
    
    this.SpinnerService.show();
    this.SendReceiveDept = id;
   
   if (this.memotype1 === undefined) {
      this.SpinnerService.hide();
      return false;
    }
    this.memourl = "memo?filter=" + this.SendReceiveDept + this.memotype1 + "&mtype=iom";
    if (this.sort_field !== undefined) {
      this.memourl = this.memourl + '&sort_by=' + this.sort_by + '&sort_field=' + this.sort_field
    }
  
   
    let filter2dept:any=[];
    if (this.mydeptlist.length !== 0) {
      for(var i=0;i<this.mydeptlist.length;i++){
        let id = this.mydeptlist[i].id
        if( this.SendReceiveDept === id){
          this.filter2check=this.mydeptlist[i]
         }
    }
  let x = JSON.stringify(this.filter2check)
  filter2dept["filter2"] = JSON.parse(x)
  this.filter2jsons = JSON.stringify(Object.assign({}, filter2dept));
  localStorage.setItem("filter2search",  this.filter2jsons)
 
  
  this.loadMemoList1(this.finaljson, 'asc', this.pageno, 10, this.memourl);
  }
}

  OnSendReceiveChange1() {
    if (this.SendReceiveTag === 'Sent') {
      this.memotype1 = "_from_dept";
      this.ApprovalType = 'Sent';
      if (this.SendReceiveDept === undefined) {
        return false;
      }
     this.memourl = "memo?filter=" + this.SendReceiveDept + this.memotype1 + "&mtype=iom";
    }
    if (this.SendReceiveTag === 'Received') {
      this.memotype1 = "_to_dept";
      this.ApprovalType = 'Received';
      this.memourl = "memo?filter=" + this.SendReceiveDept + this.memotype1 + "&mtype=iom";
    }
    if (this.SendReceiveTag === 'Pending(For Approval)') {
      this.memotype1 = undefined;
      this.memourl = "memo?type=pending_approval&mtype=iom";
      this.ApprovalType = 'Pending(For Approval)';
    }
    if (this.SendReceiveTag === 'Pending(For Recommendation))') {
      this.memotype1 = undefined;
      this.memourl = "memo?type=pending_approval&mtype=iom&ttype=recommend";
      this.ApprovalType = 'Pending(For Recommendation)';
    }
    if (this.SendReceiveTag === 'Pending for Approver/Recommender') {
      this.memotype1 = undefined;
      this.memourl = "memo?type=pending_approval&mtype=iom&ttype=approver_recommender";
      this.ApprovalType = 'Pending for Approver/Recommender';
    }
    if (this.SendReceiveTag === 'BTo to me') {
      this.memotype1 = undefined;
      this.memourl = "memo?filter=" + this.sharedService.loginUserId + "_to_emp&mtype=iom&ttype=bto";
      this.ApprovalType = 'BTo to me';
    }
    if (this.SendReceiveTag === 'Sent by me') {
      this.memotype1 = undefined;
      this.memourl = "memo?filter=" + this.sharedService.loginUserId + "_from_emp&mtype=iom";
      this.ApprovalType = 'Sent by me';
    }
    if (this.SendReceiveTag === 'Received by me') {
      this.memotype1 = undefined;
      this.memourl = "memo?filter=" + this.sharedService.loginUserId + "_to_emp&mtype=iom";
      this.ApprovalType = 'Received by me';
    }
    if (this.SendReceiveTag === 'Draft') {
      this.memotype1 = undefined;
      this.memourl = 'memo?type=draft&mtype=iom';
      this.ApprovalType = 'Draft';
    }
    if (this.sort_field !== undefined) {
      this.memourl = this.memourl + '&sort_by=' + this.sort_by + '&sort_field=' + this.sort_field
    }
    this.loadMemoList1(this.finaljson, 'asc', 1, 10, this.memourl);
  }
  filter2jsons:any;
  filter2check:any;
  
  
  myDepartmentList() {
    this.memoService.get_empTodeptMapping1('all')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.mydeptlist = datas;
        for(var i=0;i< this.mydeptlist.length;i++){
          this.SendReceiveDept= this.mydeptlist[0].id
        
        }
        
      })
  }
  
    
   
  formatDate(obj) {
    return new Date(obj);
  }
  
  OnCategoryChange(e) {
    this.categoryID = e.source.value.id;
  }

  getPriority() {
    this.memoService.get_priority()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.priorityList = datas;
      })
  }
  getPriorityList() {
    this.getPriority();
  }
  filterlist(){
    this.myDepartmentList();
  }

  public displayFnPriority(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }

  get priority() {
    return this.memoSearchForm.value.get('memopriority');
  }


  public displayCategory(category?: Category): string | undefined {
    return category ? category.name : undefined;
  }
  get category() {
    return this.memoSearchForm.get('memocategory');
  }
  public displayFromDept(fromdepartment?: Department): string | undefined {
    return fromdepartment ? fromdepartment.name : undefined;
  }
  get fromdepartment() {
    return this.memoSearchForm.get('memofromdept');
  }
  public displayToDept(todepartment?: Department): string | undefined {
    return todepartment ? todepartment.name : undefined;
  }
  get todepartment() {
    return this.memoSearchForm.get('memotodept');
  }

  public displaysubCategory(subcategory?: subCategory): string | undefined {
    return subcategory ? subcategory.name : undefined;
  }
  get subcategory() {
    return this.memoSearchForm.get('memosubcategory');
  }
  public displayFnFilter(filterdata?: DeptfilterValue): string | undefined {
    // console.log("filterdata",filterdata);
    return filterdata ? filterdata.name : undefined;
  }
  get filterdata() {
    return this.memoSearchForm.get('mydept');
  }

  FromDeptChange() {
    this.memoService.get_empTodeptMapping1('all')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.mydeptlist = datas;
        if (this.fromDeptInput.nativeElement.value !== undefined) {
          this.mydeptlistexist = this.mydeptlist.filter(dept => dept.name === this.fromDeptInput.nativeElement.value);
          if (this.mydeptlistexist.length > 0) {
            this.mydept_from = true;
          } else {
            this.mydept_from = false;
          }
        }
      })
  }

  focusFromDept(e) {
    if (this.fromDeptInput.nativeElement.value === '') {
      this.memoService.getDepartmentPage('', 1, '')
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.departmentList = datas;
        });
    }
  }

  focusToDept(e) {
    if (this.toDeptInput.nativeElement.value === '') {
      this.memoService.getDepartmentPage('', 1, '')
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.departmentList = datas;
        });
    }
  }

  ToDeptChange() {
    this.memoService.get_empTodeptMapping1('all')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.mydeptlist = datas;
        if (this.toDeptInput.nativeElement.value !== undefined) {
          this.mydeptlistexist = this.mydeptlist.filter(dept => dept.name === this.toDeptInput.nativeElement.value);
          if (this.mydeptlistexist.length > 0) {
            this.mydept_from = true;
          } else {
            this.mydept_from = false;
          }
        }
      })
  }

  onMemoChange(ob) {
    this.selectedItem = ob.value;
    if (this.selectedItem) {
      this.loadMemoList(this.selectedItem, 'asc', 1, 10)
    }
  }


  department(id) {
    this.dataService.getCategory(id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;

      })
  }

  categoryChange(id) {
    this.dataService.getSubCategory(id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sub_categoryList = datas;
      })
  }

  private loadMemoList(filter = '2_to_emp', sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      if (pageNumber===0){
        return false;
      }
     

    this.memoService.findMemoList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datapagination = results["pagination"];
        this.memolist = results["data"];
        if (this.memolist !== undefined && this.memolist.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })
  }

  nextClick() {
    if (this.has_next === true) {
      this.loadMemoList1(this.finaljson, 'asc', this.currentpage + 1, 10, this.memourl)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.loadMemoList1(this.finaljson, 'asc', this.currentpage - 1, 10, this.memourl)
    }
  }
  selectRow(filterId) {
    localStorage.setItem("ls_approvaltypeiom", this.ApprovalType)
    this.router.navigate(["/ememo/memoView"], { queryParams: { mid: filterId, from: 'iom' }, skipLocationChange: isSkipLocationChange });
  }

  PrioritySort() {
    this.sort_field = "priority";
    if (this.sort_by === "ascending") {
      this.sort_by = "descending"
    } else {
      this.sort_by = "ascending"
    }
    this.SearchClick();
  }

  DateSort() {
    this.sort_field = "created_date";
    if (this.sort_by === "ascending") {
      this.sort_by = "descending"
    } else {
      this.sort_by = "ascending"
    }
    this.SearchClick();
  }

  DateSortAscending() {
    this.sort_field = "created_date";
    this.sort_by = "ascending"
    if (this.ApprovalType === 'search') {
      this.SearchClick();
    } else {
      this.OnSendReceiveChange1()
    }
    this.DateSortType = "ascending"
  }

  DateSortDescending() {
    this.sort_field = "created_date";
    this.sort_by = "descending"
    if (this.ApprovalType === 'search') {
      this.SearchClick();
    } else {
      this.OnSendReceiveChange1()
    }
    this.DateSortType = "descending"
  }
  PrioritySortAscending() {
    this.sort_field = "priority";
    this.sort_by = "ascending"
    if (this.ApprovalType === 'search') {
      this.SearchClick();
    } else {
      this.OnSendReceiveChange1()
    }
    this.PrioritySortType = "ascending"
  }
  PrioritySortDescending() {
    this.sort_field = "priority";
    this.sort_by = "descending"
    if (this.ApprovalType === 'search') {
      this.SearchClick();
    } else {
      this.OnSendReceiveChange1()
    }
    this.PrioritySortType = "descending"
  }

  CreateNew($event) {
    this.sharedService.Memofrom = "IOMEMO";
    this.router.navigate(['/ememo/memocreate'], { skipLocationChange: isSkipLocationChange });
  }

  Clear($event) {
    localStorage.removeItem("memosearch_datas")
    localStorage.removeItem("ls_approvaltypeiom");
    this.memoSearchForm.reset()
  }

  SearchClick() {
    this.SpinnerService.show();
    if (this.memoSearchForm.value.memodatefrom === null) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Summary', 'Please enter Date from value', { timeOut: 1500 });
      return;
    }
    if (this.memoSearchForm.value.memodateto === null) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Summary', 'Please enter Date to value', { timeOut: 1500 });
      return;
    }
    this.urlname = 'search'
    this.ApprovalType = 'search';

    if (this.DateSortType === 'NO') { this.DateSortType = '' }
    if (this.PrioritySortType === 'NO') { this.PrioritySortType = '' }

    let memojson: any = [];
    let senderjson: any = [];
    let tojson: any = [];
    let memoValue: any = [];

    if (this.memoSearchForm.value.memofromdept) {
      memoValue = {
        "id": this.memoSearchForm.value.memofromdept.id,
        "name": this.memoSearchForm.value.memofromdept.name,
        "type": "dept"
      }
      senderjson.push(memoValue)
    }

    if (Object.keys(senderjson).length !== 0) {
      let x = JSON.stringify(senderjson)
      memojson["sender"] = JSON.parse(x)
    }

    if (this.memoSearchForm.value.memotodept) {
      memoValue = {
        "id": this.memoSearchForm.value.memotodept.id,
        "name": this.memoSearchForm.value.memotodept.name,
        "type": "dept"
      }
      tojson.push(memoValue)
    }

    if (Object.keys(tojson).length !== 0) {
      let x = JSON.stringify(tojson)
      memojson["to"] = JSON.parse(x)
    }

    if(this.memoSearchForm.value.memocategory){
      memojson["searchcategory"] = this.memoSearchForm.value.memocategory 
    }

    if(this.memoSearchForm.value.memopriority){
      memojson["searchpriority"] = this.memoSearchForm.value.memopriority 
    }
    if (this.chipSelectedEmployeeApprover.length !== 0) {
      let x = JSON.stringify(this.chipSelectedEmployeeApprover)
       memojson["searchapprover"] = JSON.parse(x)
     }

    if (this.memoSearchForm.value.memopriority) {
      memojson["priority"] = this.memoSearchForm.value.memopriority.id;
    }
    if (this.sort_field !== undefined) {
      memojson["sort_field"] = this.sort_field;
      memojson["sort_by"] = this.sort_by;
    }
    if (this.memoSearchForm.value.memodatefrom) {
      memojson["from_date"] = this.datePipe.transform(new Date(this.memoSearchForm.value.memodatefrom), 'yyyy-MM-dd')
    }

    if (this.memoSearchForm.value.memodateto) {
      memojson["to_date"] = this.datePipe.transform(new Date(this.memoSearchForm.value.memodateto), 'yyyy-MM-dd')
    }

    if (this.memoSearchForm.value.memosubject) {
      memojson["subject"] = this.memoSearchForm.value.memosubject
    }

    if (this.chipSelectedEmployeeCCid.length !== 0) {
      let x = JSON.stringify(this.chipSelectedEmployeeCCid)
      memojson["cc"] = JSON.parse(x)
    }

    if (this.chipSelectedEmployeeApproverid.length !== 0) {
      let x = JSON.stringify(this.chipSelectedEmployeeApproverid)
      memojson["approver"] = JSON.parse(x)
    }

    if (this.categoryID) {
      memojson["category"] = this.categoryID;
    }

    if (this.memoSearchForm.value.memosubcategory) {
      memojson["subcategory"] = this.memoSearchForm.value.memosubcategory
    }
    memojson["type"] = 'iom'
    this.finaljson = JSON.stringify(Object.assign({}, memojson));
    localStorage.removeItem("ls_approvaltypeiom")
    localStorage.removeItem("filter2search")
    localStorage.setItem("memosearch_datas", this.finaljson)
    if (memojson) {
      this.memourl=this.urlname;
      this.loadMemoList1(this.finaljson, 'asc', 1, 10, this.memourl)
    }
  }
  pageno:any
  private loadMemoList1(filterjson, sortOrder = 'asc',
    pageNumber = 1, pageSize = 10, urlname1) {
      if (pageNumber===0){
        return false;
      }
      this.pageno=pageNumber;
      localStorage.setItem("iompagenumber",this.pageno)
    this.memoService.findMemoList1(filterjson, sortOrder, pageNumber, pageSize, urlname1)
      .subscribe((results: any[]) => {
        this.codes = results['code']
        let datapagination = results["pagination"];
        this.memolist = results["data"];
        this.sharedService.memoViews.next(this.memolist)
        if (this.memolist !== undefined && this.memolist.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        this.SpinnerService.hide();
      },
      error => {
        this.SpinnerService.hide();
      }
      )
  }

  public removeEmployeeCC(employeecc: iEmployeeList): void {
    const index = this.chipSelectedEmployeeCC.indexOf(employeecc);
    if (index >= 0) {
      this.chipSelectedEmployeeCC.splice(index, 1);
      this.chipSelectedEmployeeCCid.splice(index, 1);
      this.resetInputs();
    }
  }

  public employeeccSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeCCByName(event.option.value.full_name);
    this.resetInputs();
  }
  private selectEmployeeCCByName(employeeccName) {
    let foundEmployeeCC1 = this.chipSelectedEmployeeCC.filter(employeecc => employeecc.full_name == employeeccName);
    if (foundEmployeeCC1.length) {
      return;
    }
    let foundEmployeeCC = this.allEmployeeList.filter(employeecc => employeecc.full_name == employeeccName);
    if (foundEmployeeCC.length) {
      this.chipSelectedEmployeeCC.push(foundEmployeeCC[0]);
      this.chipSelectedEmployeeCCid.push(foundEmployeeCC[0].id)
    }
  }
  private resetInputs() {
    // clear input element
    this.employeeccInput.nativeElement.value = '';
    // clear control value and trigger employeeccControl.valueChanges event 
  }
  public removeEmployeeApprover(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployeeApprover.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedEmployeeApprover.splice(index, 1);
      this.chipSelectedEmployeeApproverid.splice(index, 1);
      this.employeeApproverInput.nativeElement.value = '';
    }
  }

  public employeeApproverSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeApproverByName(event.option.value.full_name);
    this.employeeApproverInput.nativeElement.value = '';
  }
  private selectEmployeeApproverByName(employee) {
    let foundEmployeeApprover1 = this.chipSelectedEmployeeApprover.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover1.length) {
      return;
    }
    let foundEmployeeApprover = this.allEmployeeList.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover.length) {
      // We found the employeecc name in the allEmployeeList list
      this.chipSelectedEmployeeApprover.push(foundEmployeeApprover[0]);
      this.chipSelectedEmployeeApproverid.push(foundEmployeeApprover[0].id)
    }
  }

  status(status) {
    if (status["memo_status"] === 1) {
      return "OPEN"
    } else if (status["memo_status"] === 0) {
      return "DRAFT"
    } else {
      return "CLOSED"
    }
  }

  memoStatus(memo_status, filterId) {
    if (memo_status === 1) {
      this.sharedService.fetchData.next(filterId)
      this.router.navigate(["/ememo/memoView"], { queryParams: { mid: filterId, MemoView: "YES" }, skipLocationChange: isSkipLocationChange });
    } else if (memo_status === 2) {
      this.sharedService.fetchData.next(filterId)
      this.router.navigate(["/ememo/memoView"], { queryParams: { mid: filterId, MemoView: "YES" }, skipLocationChange: isSkipLocationChange });
    } else if (memo_status === 0) {  //DRAFT
      this.sharedService.fetchData.next(filterId)
      this.router.navigate(["/ememo/memoRedraft"], { queryParams: { memofrom_rf: 'REDRAFT' }, skipLocationChange: isSkipLocationChange });
    }
  }

}
