import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LocalStorage } from '@ng-idle/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TaService } from '../ta.service';

@Component({
  selector: 'app-ta-recovery',
  templateUrl: './ta-recovery.component.html',
  styleUrls: ['./ta-recovery.component.scss']
})
export class TaRecoveryComponent implements OnInit {

  @ViewChild('assetid') matassetidauto: any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('empc') matemp:any;
  @ViewChild('emp') emp:any;
  recoveryform:FormGroup
  page: any = 1;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: any = 1
  branchlist: any;
  branchid: any=null;
  currentpage = 1;
  pagesize = 10;
  employeelist: any;
  isLoading: boolean;
  summarylist: any;
  has_next = false;
  has_previous= false;
  isTourChecker: boolean=true;
  branchcode: any=null;
  payload: { Employee_code: string; Employee_gid: string; Branch_code: string; Branch_gid: string; Invoice_No: string; };
  empid: any =null;
  empcode: any=null;
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousemps = false;

  constructor(private fb:FormBuilder, public taservice :TaService) {
   }

  ngOnInit(): void {
    this.recoveryform = this.fb.group({
      invoiceno:[''],
      branch:[''],
      employee:['']
    })

    let employee = JSON.parse(localStorage.getItem('sessionData'))
    let empid = employee.employee_id;
    // this.taservice.getemployeedetail().s
    this.payload ={ "Employee_code": "", "Employee_gid": "", "Branch_code":
    "", "Branch_gid": "", "Invoice_No": "" }
    this.recoverysummary(this.payload);
    this.branchslist();

    this.recoveryform.get('branch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          
          console.log("Branch List", this.branchlist)
        });
 
        this.recoveryform.get('employee').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getemployeevaluechanges(this.branchid ? this.branchid:'0',value?value:''))
        )
        .subscribe((results: any[]) => {
          let datas = results['data'];
          this.employeelist = datas;
          if(this.branchid==null){
            this.employeelist  = []
          }
          console.log("Employee List", this.employeelist)
        });
      
  }

  omit_special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k == 46) || (k == 44) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e.id
    this.branchid = branchvalue
    this.branchcode =  e.code;
    this.recoveryform.patchValue({
      "employee": undefined
    })
  }

  displayFn(subject) {
    return subject ?subject.full_name : undefined;
  }

  brclear(event){
   (<HTMLInputElement>document.getElementById("inputassetid")).value=null;
   (<HTMLInputElement>document.getElementById("emplid")).value=null;
   this.branchid = null;
   this.branchcode= null;
   this.empid = null;
   this.empcode = null;
   this.employeelist=[]

  }
  empclear(){
    (<HTMLInputElement>document.getElementById("emplid")).value=null
    this.empid = null;
    this.empcode = null;
  }
  selectemployee(emp){
    this.empid = emp.id
    this.empcode = emp.code
  }
  recoverysearch(){
    this.payload.Branch_code = this.branchcode;
    this.payload.Employee_code=this.empcode
    this.payload.Branch_gid = this.branchid;
    this.payload.Employee_gid= this.empid
    this.payload.Invoice_No = this.recoveryform.value.invoiceno
    this.recoverysummary(this.payload);
  }

  recoverysummary(payload){
    this.taservice.recoverysum(payload).subscribe(results =>{
      let data = results;
      this.summarylist = results['DATA']
    })
  }

  jventry(){
    let payload ={
      
    }
    
  }

  branchslist(){
    this.taservice.getUsageCode('', 1).subscribe(result =>{
      let data = result['data'];
      this.branchlist = data;
    })
  }

  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextemp) {
              this.taservice.getbranchvalues(this.has_presentemp).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextemp = pagination.has_next;
                  this.has_previousemp = pagination.has_previous;
                  this.has_presentemp = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }

  autocompleteemps() {
    setTimeout(() => {
      if (this.matemp && this.autocompletetrigger && this.matemp.panel) {
        fromEvent(this.matemp.panel.nativeElement, 'scroll').pipe(
          map(x => this.matemp.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matemp.panel.nativeElement.scrollTop;
          const scrollHeight = this.matemp.panel.nativeElement.scrollHeight;
          const elementHeight = this.matemp.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextid) {
              this.taservice.getonbehalfemployeepage(this.branchid, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                let pagination = data['pagination'];
                this.employeelist = this.employeelist.concat(dts);

                if (this.employeelist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_previousemps = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }

  nextpage(){

  }

  previouspage(){

  }

  reset(){
    this.recoveryform.patchValue({
      "invoiceno":null,
      "branch":null,
      "employee":null
    })
    this.branchcode=null;
    this.branchid =null;
    this.empid = null;
    this.empcode = null;
  }
}
