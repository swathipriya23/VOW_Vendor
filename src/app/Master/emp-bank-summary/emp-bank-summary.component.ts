import { Component, OnInit,Output,EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
export interface empname{
  name:string;
  id:string;
}
export interface empcode{
  name:string;
  id:string;
  code:string;
}
@Component({
  selector: 'app-emp-bank-summary',
  templateUrl: './emp-bank-summary.component.html',
  styleUrls: ['./emp-bank-summary.component.scss']
})
export class EmpBankSummaryComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('codeemp') matCode:MatAutocomplete;
  @ViewChild('codeinput') codeInput;
  @Output() onSubmit=new EventEmitter<any>();
  empform:any=FormGroup;
  pageSize:number=10;
  presentPage:number=1;
  has_next:boolean=false;
  has_pre:boolean=false;
  empnamelist:Array<any>=[];
  empcodelist:Array<any>=[];
  empdatalist:Array<any>=[];
  isLoading:boolean=false;
  has_codenxt:boolean=true;
  has_codepre:boolean=false;
  has_codepage:number=1;
  constructor(private spinner:NgxSpinnerService,private router:Router,private fb:FormBuilder,private masterservice:masterService,private notification:NotificationService) { }

  ngOnInit(): void {
    this.empform=this.fb.group({
      'name':new FormControl(''),
      'code':new FormControl('')
    });
    this.empform.get('name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.masterservice.getempcodedropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.empnamelist=data['data'];
    })
    this.getsummarydata(this.presentPage);
  }
  getsummarydata(page:any){
    let pages=''+page;
    // if(this.empform.get('name').value !=undefined && this.empform.get('name').value !='' && this.empform.get('name').value !=""){
    //   pages=pages+'&data='+this.empform.get('name').value;
    //   console.log(pages)
    // }
    console.log(pages)
    this.masterservice.getempbankaddsummarys(pages).subscribe(data=>{
      if(data['code'] !=undefined && data['code'] !=null ){
        this.notification.showError(data['code']);
        this.notification.showError(data['description']);
        this.empdatalist=[];
      }
      else{
        this.empdatalist=data['data'];
        let pagination=data['pagination'];
        this.has_next=pagination.has_next;
        this.has_pre=pagination.has_previous;
        this.presentPage=pagination.index;
      }
     
    });
  }
  getsummarydata_new(page:any){
    let pages=''+page;
    if(this.empform.get('name').value.id !=undefined && this.empform.get('name').value !='' && this.empform.get('name').value !=""){
      pages=pages+'&data='+this.empform.get('name').value.id;
      console.log(pages)
    }
    if(this.empform.get('code').value !=undefined && this.empform.get('code').value !='' && this.empform.get('code').value !=""){
      pages=pages+'&code='+this.empform.get('code').value;
      console.log(pages)
    }
    console.log(pages)
    this.masterservice.getempbankaddsummarys_new(pages).subscribe(data=>{
      this.empdatalist=data['data'];
      // let pagination=data['pagination'];
      // this.has_next=pagination.has_next;
      // this.has_pre=pagination.has_previous;
    });
  }
  getcodedata(){
    let d:any;
    if(this.empform.get('name').value==null || this.empform.get('name').value==undefined || this.empform.get('name').value=='' || this.empform.get('name').value==""){
      d='';
    }
    else{
      d=this.empform.get('name').value;
    }
    this.masterservice.getempcodedropdown(d,1).subscribe(data=>{
      this.empcodelist=data['data'];
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  getsummarysearch(){
    this.getsummarydata(this.presentPage);
  }
  getsummarysearch_new(){
    this.getsummarydata_new(1);
  }
  resetempaccountdetails(){
    this.empform.reset('');
    this.getsummarydata(this.presentPage);
  }
  hasnext(){
    if(this.has_next){
      this.getsummarydata(this.presentPage+1);
    }
  }
  has_previous(){
    if(this.has_pre){
      this.getsummarydata(this.presentPage-1);
    }
  }
  clicktoback(){
      this.onSubmit.emit();
      this.router.navigate(['master/master']);
    
  }
  empactiveinactivedata(data:any){
    this.spinner.show();
    let dta:any={'id':data.id,'status':data.status};
    this.masterservice.getactiveinsctiveempbank(dta).subscribe(result=>{
      if(result['status']=='success'){
        this.notification.showSuccess(result['message']);
        this.getsummarydata(this.presentPage);
        this.spinner.hide();
      }
      else{
        this.spinner.hide();
        this.notification.showError(result['code']);
        this.notification.showError(result['description']);
      }
      this.spinner.hide();
    },
    (error)=>{
      this.spinner.hide();
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  public getempcodeinterface(data?:empcode):string | undefined{
    return data?data.code:undefined;
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
      return false;
    }
    return true;
  }
  autocompleteDeptScrollcode() {
    setTimeout(() => {
      if (
        this.matCode &&
        this.autocompletetrigger &&
        this.matCode.panel
      ) {
        fromEvent(this.matCode.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matCode.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matCode.panel.nativeElement.scrollTop;
            const scrollHeight = this.matCode.panel.nativeElement.scrollHeight;
            const elementHeight = this.matCode.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_codenxt === true) {
                this.masterservice.getempcodedropdown(this.codeInput.nativeElement.value,this.has_codepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empnamelist = this.empnamelist.concat(datas);
                    if (this.empnamelist.length >= 0) {
                      this.has_codenxt = datapagination.has_next;
                      this.has_codepre = datapagination.has_previous;
                      this.has_codepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  
 }
}
