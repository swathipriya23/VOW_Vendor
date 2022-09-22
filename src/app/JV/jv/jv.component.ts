import { Component, ComponentFactoryResolver, OnInit,ViewChild} from '@angular/core';
import { FormGroup,FormBuilder} from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import {JvService} from '../jv.service'
import {ShareService} from '../share.service'
import { NotificationService } from '../notification.service';
import {ExceptionHandlingService} from '../exception-handling.service';
import { NgxSpinnerService } from "ngx-spinner";

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}

export interface raiserlists {
  id: string;
  full_name: string;
  name: string
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
      return formatDate(date, 'dd/MM/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}



@Component({
  selector: 'app-jv',
  templateUrl: './jv.component.html',
  styleUrls: ['./jv.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class JVComponent implements OnInit {
  JV_Sub_Menu_List: any;
  sub_module_url:any;
  jvsummary:any;
  jvpprovalsummary:any;
  jvsummaryPath:any;
  jvapprovalPath:any;

  jvSearchForm:FormGroup
  jvapprovalSearchForm:FormGroup
  TypeList:any
  StatusList:any
  jvsummaryForm:boolean
  jvcreateForm:boolean
  jvapprovalsummaryForm:boolean
  jvuploadForm:boolean
  showjvapproverview:boolean
  showjvsummaryview:boolean
  

  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('raisertyperole') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserapptyperole') matappraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild('raiserappInput') raiserappInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  Raiserlist:any
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  Branchlist: Array<branchListss>;
  jvList:any
  jvappList:any

  has_pagenext = true;
  has_pageprevious = true;
  issummarypage: boolean = true;
  jvpresentpage: number = 1;
  jvpagesize = 10;

  has_apppagenext = true;
  has_apppageprevious = true;
  isappsummarypage: boolean = true;
  jvapppresentpage: number = 1;
  jvapppagesize = 10;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closeentry') closeentry;
  filedatas:any
  tranrecords:any
  entrylist:any



  constructor(private sharedService: SharedService,private fb:FormBuilder,private datePipe: DatePipe,
    private jvservice:JvService,private shareservice:ShareService,
    private notification:NotificationService,private errorHandler:ExceptionHandlingService,private spinnerservice:NgxSpinnerService) { }

  ngOnInit(): void {

    let datas = this.sharedService.menuUrlData;

    datas.forEach((element) => {
      let subModule = element?.submodule;
      if (element?.name === "JV") {
        this.JV_Sub_Menu_List = subModule;
      
      }
    });

    this.jvSearchForm = this.fb.group({

      crno:[''],
      type:[''],
      refno:[''],
      branch:[''],
      date:[''],
      amount:[''],
      status:[''],
      created_by:['']

    })


    this.jvapprovalSearchForm = this.fb.group({


      crno:[''],
      type:[''],
      refno:[''],
      branch:[''],
      date:[''],
      amount:[''],
      status:[''],
      raiser:[''],
      created_by:['']
      

    })

    this.getjvSummaryList()
    this.getjvappSummaryList()
    this.getjournaltype()
    this.getjournalstatus()

    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.jvSearchForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.jvservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
        // console.log("Branchlist", datas)
      })


      this.jvapprovalSearchForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.jvservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
        // console.log("Branchlist", datas)
      })


  }

  getjournaltype(){
    this.jvservice.getjournaltype()
    .subscribe(result =>{
      if(result){
      let TypeList = result['data']
      this.TypeList = TypeList.filter(x=>x.id != 4)
      
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  getjournalstatus(){
    this.jvservice.getjournalstatus()
    .subscribe(result =>{
      if(result){
      this.StatusList = result['data']
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  getbranchdropdown(){
    this.branchdropdown('');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;

  }

  get branchtyperole() {
    return this.jvSearchForm.get('branch');
  }
  

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? +branchtype.code + "-" + branchtype.name : undefined;

  }

  get branchtype() {
    return this.jvapprovalSearchForm.get('created_by');
  }

  branchdropdown(branchkeyvalue) {
    this.jvservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.Branchlist = datas;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  getraiserdropdown() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.jvSearchForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.jvservice.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })



  }

  getraiserappdropdown(){

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.jvapprovalSearchForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.jvservice.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })




  }


  public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
    return raisertyperole ? raisertyperole.full_name : undefined;
  }

  get raisertyperole() {
    return this.jvSearchForm.get('created_by');
  }
  public displayFnappraiserrole(raiserapptyperole?: raiserlists): string | undefined {
    return raiserapptyperole ? raiserapptyperole.full_name : undefined;
  }

  get raiserapptyperole() {
    return this.jvapprovalSearchForm.get('created_by');
  }

  getrm(rmkeyvalue) {
    this.jvservice.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if(results){
        let datas = results["data"];
        this.Raiserlist = datas;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  raiserScroll() {
    setTimeout(() => {
      if (
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete.panel
      ) {
        fromEvent(this.matraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  raiserappScroll() {
    setTimeout(() => {
      if (
        this.matappraiserAutocomplete &&
        this.matappraiserAutocomplete &&
        this.matappraiserAutocomplete.panel
      ) {
        fromEvent(this.matappraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getrmscroll(this.raiserappInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }








  JVSubModule(data){
    this.sub_module_url = data.url;
    
    this.jvsummary = "/jvcreate"
    this.jvpprovalsummary = "/jvapproval"

    this.jvsummaryPath = this.jvsummary === this.sub_module_url ? true : false;
    this.jvapprovalPath = this.jvpprovalsummary === this.sub_module_url ? true : false;

    if(this.jvsummaryPath){
      this.jvsummaryForm = true
      this.jvcreateForm = false
      this.jvapprovalsummaryForm = false
      this.jvuploadForm = false
      this.showjvapproverview = false
      this.showjvsummaryview = false
      this.getjvSummaryList()
    }

    if(this.jvapprovalPath){
      this.jvsummaryForm = false
      this.jvcreateForm = false
      this.jvapprovalsummaryForm = true
      this.jvuploadForm = false
      this.showjvapproverview = false
      this.showjvsummaryview  = false
      this.getjvappSummaryList()
    }
  }

  jvsummarysearch(){

    let data = this.jvSearchForm?.value
    let branchid:any
    let raiserid:any
    if(data.branch != ""){
      branchid = data?.branch?.id
    }else{
      branchid = ""
    }
    if(data.created_by != ""){
      raiserid = data?.created_by?.id
    }else{
      raiserid = ""
    }
    this.spinnerservice.show()
    this.jvservice.jvsummarySearch(data?.crno,data?.status,data?.amount,data?.refno,data?.type,branchid,raiserid)
    .subscribe(res =>{
     if(res['data'] != undefined){
      this.jvList = res['data']
      this.spinnerservice.hide()
     }else{
       this.notification.showError(res?.description)
       this.spinnerservice.hide()
       return false
     }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  jvreset(){
    this.jvSearchForm.controls['crno'].reset(""),
    this.jvSearchForm.controls['type'].reset(""),
    this.jvSearchForm.controls['refno'].reset(""),
    this.jvSearchForm.controls['branch'].reset(""),
    this.jvSearchForm.controls['created_by'].reset(""),
    this.jvSearchForm.controls['date'].reset(""),
    this.jvSearchForm.controls['amount'].reset(""),
    this.jvSearchForm.controls['status'].reset(""),
    this.getjvSummaryList()

  }

  searchjvapprover(){

    let data = this.jvapprovalSearchForm?.value
    let appbranchid:any
    let appraiserid:any
    if(data.branch != ""){
      appbranchid = data?.branch?.id
    }else{
      appbranchid = ""
    }
    if(data.created_by != ""){
      appraiserid = data?.created_by?.id
    }else{
      appraiserid = ""
    }
    this.spinnerservice.show()
    this.jvservice.jvsummarySearch(data?.crno,data?.status,data?.amount,data?.refno,data?.type,appbranchid,appraiserid)
    .subscribe(res =>{
     if(res['data'] != undefined){
      this.jvappList = res['data']
      this.spinnerservice.hide()
     }else{
       this.notification.showError(res?.description)
       this.spinnerservice.hide()
       return false
     }

    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })

  }

  clearjvapprover(){
    this.jvapprovalSearchForm.controls['crno'].reset(""),
    this.jvapprovalSearchForm.controls['type'].reset(""),
    this.jvapprovalSearchForm.controls['refno'].reset(""),
    this.jvapprovalSearchForm.controls['branch'].reset(""),
    this.jvapprovalSearchForm.controls['created_by'].reset(""),
    this.jvapprovalSearchForm.controls['date'].reset(""),
    this.jvapprovalSearchForm.controls['amount'].reset(""),
    this.jvapprovalSearchForm.controls['status'].reset(""),
    this.getjvappSummaryList() 
  }

  createjv(){
    this.jvcreateForm = true
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false


  }

  uploadjv(){
    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = true
    this.showjvapproverview = false
    this.showjvsummaryview  = false
  }

  jvcreatesubmit(){
    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvSummaryList()
  }

  jvcreatecancel(){
    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvSummaryList()
    

  }


  getjvSummaryList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.spinnerservice.show()
    this.jvservice.getjournalsummary(filter, sortOrder, pageNumber, pageSize)
      .subscribe(results => {
        if(results["data"] != undefined){
        let datas = results["data"];
        this.jvList = datas;
        let datapagination = results["pagination"];
        if (this.jvList?.length === 0) {
          this.issummarypage = false
        }
        if (this.jvList?.length > 0) {
          this.has_pagenext = datapagination?.has_next;
          this.has_pageprevious = datapagination?.has_previous;
          this.jvpresentpage = datapagination?.index;
          this.issummarypage = true
          
        }
        this.spinnerservice.hide()
      }else{
        this.notification.showError(results?.description)
        this.spinnerservice.hide()
        return false
      }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  nextClickjv() {
    if (this.has_pagenext === true) {
      this.getjvSummaryList("", 'asc', this.jvpresentpage + 1, 10)
    }
  }

  previousClickjv() {
    if (this.has_pageprevious === true) {
      this.getjvSummaryList("", 'asc', this.jvpresentpage - 1, 10)
    }
  }

  getjvappSummaryList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.spinnerservice.show()
    this.jvservice.getjournalappsummary(filter, sortOrder, pageNumber, pageSize)
      .subscribe(results => {
       if(results["data"] != undefined){
        let datas = results["data"];
        this.jvappList = datas;
        let datapagination = results["pagination"];
        if (this.jvappList?.length === 0) {
          this.isappsummarypage = false
        }
        if (this.jvappList?.length > 0) {
          this.has_apppagenext = datapagination?.has_next;
          this.has_apppageprevious = datapagination?.has_previous;
          this.jvapppresentpage = datapagination?.index;
          this.isappsummarypage = true
        }
        this.spinnerservice.hide()
      }else{
        this.notification.showError(results?.description)
        this.spinnerservice.hide()
        return false
      }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  nextClickjvapp() {
    if (this.has_pagenext === true) {
      this.getjvappSummaryList("", 'asc', this.jvapppresentpage + 1, 10)
    }
  }

  previousClickjvapp() {
    if (this.has_pageprevious === true) {
      this.getjvappSummaryList("", 'asc', this.jvapppresentpage - 1, 10)
    }
  }

  showjvview(list){
    this.shareservice.jvlist.next(list.id)
    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = true
    this.showjvsummaryview  = false

    
  }

  showjvsummaryviews(data){
    this.shareservice.jvlist.next(data.id)
    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = true
  }

  jvapprovesubmit(){

    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = true
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvappSummaryList()

  }

  jvapprovecancel(){

    this.jvcreateForm = false
    this.jvsummaryForm = false
    this.jvapprovalsummaryForm = true
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvappSummaryList()


  }

  jvsummarysubmit(){

    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvSummaryList()

  }

  jvsummarycancel(){

    this.jvcreateForm = false
    this.jvsummaryForm = true
    this.jvapprovalsummaryForm = false
    this.jvuploadForm = false
    this.showjvapproverview = false
    this.showjvsummaryview  = false
    this.getjvSummaryList()


  }

  delete(id){
    
    var answer = window.confirm("Are you sure to delete?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.spinnerservice.show()
    this.jvservice.jvheaderdelete(id)
    .subscribe(result =>{
     
      if(result.status == "success"){
      this.notification.showSuccess("Deleted Successfully")
      this.getjvSummaryList()
      this.spinnerservice.hide()
      }else{
        this.notification.showError(result.description)
        this.spinnerservice.hide()
        return false;
      }
    })
  }

  fileback(){
    this.closedbuttons.nativeElement.click();
  }
  jvcrno:any
  ofdate:any
  transactiondate:any
  debitsum:any
  creditsum:any
  totalentrycount:any

  getjvcrno(data){

    let crno = data?.jecrno
    this.jvcrno = data?.jecrno
    this.spinnerservice.show()
    this.jvservice.getentrydetail(crno)
    .subscribe(result=>{
      if(result){
      this.entrylist = result['data']
      this.totalentrycount = this.entrylist?.length;
      let debitdata = this.entrylist?.filter(x=>x.type == 'DEBIT')
      let debitamt = debitdata?.map(y=>Number(y.amount))
      this.debitsum = debitamt?.reduce((a, b) => a + b)
      let creditdata = this.entrylist?.filter(i=>i.type == 'CREDIT')
      let creditamt = creditdata?.map(j=>Number(j.amount))
      this.creditsum = creditamt?.reduce((a, b) => a + b)
      this.ofdate = this.entrylist[0]?.cbsdate
      this.transactiondate = this.entrylist[0]?.transactiondate
      this.spinnerservice.hide()
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })

  }

  entryback(){
     this.closeentry.nativeElement.click()
  }

   numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  
}
