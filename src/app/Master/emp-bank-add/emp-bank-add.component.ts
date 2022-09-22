// import { E } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';

export interface empcode{
  id:string;
  name:string;
  code:string;
}
export interface emppaymode{
  id:string;
  name:string;
}
export interface empbank{
  id:string;
  name:string;
}
export interface empbranch{
  id:string;
  name:string;
}
@Component({
  selector: 'app-emp-bank-add',
  templateUrl: './emp-bank-add.component.html',
  styleUrls: ['./emp-bank-add.component.scss']
})
export class EmpBankAddComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('codeemp') matCode:MatAutocomplete;
  @ViewChild('codeinput') codeInput;
  @ViewChild('payemp') matPay:MatAutocomplete;
  @ViewChild('payinput') payInput;
  @ViewChild('bankemp') matBank:MatAutocomplete;
  @ViewChild('bankinput') bankInput;
  @ViewChild('branchemp') matBranch:MatAutocomplete;
  @ViewChild('branchinput') branchInput;
  empformadd:any=FormGroup;
  empcodelist:Array<any>=[];
  emppaycodelist:Array<any>=[];
  banknamelist:Array<any>=[];
  branchnamelist:Array<any>=[];
  empsummarylist:Array<any>=[];
  has_next:boolean=false;
  has_pre:boolean=false;
  presentPage:number=1;
  pageSize:number=1;
  isLoading:boolean=false;
  has_codenxt:boolean=true;
  has_codepre:boolean=false;
  has_codepage:number=1;
  has_paynxt:boolean=true;
  has_paypre:boolean=false;
  has_paypage:number=1;
  has_banknxt:boolean=true;
  has_bankpre:boolean=false;
  has_bankpage:number=1;
  has_branchnxt:boolean=true;
  has_branchpre:boolean=false;
  has_branchpage:number=1;
  constructor(private fb:FormBuilder,private notification:NotificationService,private masterservice:masterService,private router:Router,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.empformadd=this.fb.group({
      'empcode':new FormControl(''),
      'paymode':new FormControl(''),
      'bankname':new FormControl(''),
      'branchname':new FormControl(''),
      'accountno':new FormControl(''),
      'benifiencyname':new FormControl(''),

    });
    this.empformadd.get('empcode').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.masterservice.getempcodedropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.empcodelist=data['data'];
    })
    this.empformadd.get('paymode').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.masterservice.getemppaydropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.emppaycodelist=data['data'];
    })
    this.empformadd.get('bankname').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.masterservice.getempbankdropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.banknamelist=data['data'];
    })
     this.empformadd.get('branchname').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.masterservice.getempbranchdropdown( this.empformadd.get('bankname').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchnamelist=data['data'];
    });
    this.getsummary(this.presentPage);
  }
  getsummary(presentpage:any){
    this.masterservice.getempbankaddsummarys(presentpage).subscribe(dta=>{
      this.empsummarylist=dta['data'];
      let pagination:any=dta['pagination'];
      this.has_next=pagination.has_next;
      this.has_pre=pagination.has_pre;
      this.presentPage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  public getempcodeinterface(data?:empcode):string | undefined{
    return data?data.code:undefined;
  }
  public getemppaymodeinterface(data?:emppaymode):string | undefined{
    return data?data.name:undefined;
  }
  public getempbanknameinterface(data?:empbank):string | undefined{
    return data?data.name:undefined;
  }
  public getempbranchinterface(data?:empbranch):string | undefined{
    return data?data.name:undefined;
  }
  getcodedata(){
    let d:any;
    if(this.empformadd.get('empcode').value==null || this.empformadd.get('empcode').value==undefined || this.empformadd.get('empcode').value=='' || this.empformadd.get('empcode').value==""){
      d='';
    }
    else{
      d=this.empformadd.get('empcode').value;
    }
    this.masterservice.getempcodedropdown(d,1).subscribe(data=>{
      this.empcodelist=data['data'];
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  getpayadata(){
    let d:any;
    if(this.empformadd.get('paymode').value==null || this.empformadd.get('paymode').value==undefined || this.empformadd.get('paymode').value=='' || this.empformadd.get('paymode').value==""){
      d='';
    }
    else{
      d=this.empformadd.get('paymode').value;
    }
    this.masterservice.getemppaydropdown(d,1).subscribe(data=>{
      this.emppaycodelist=data['data'];
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  getbankdata(){
    let d:any;
    if(this.empformadd.get('bankname').value==null || this.empformadd.get('bankname').value==undefined || this.empformadd.get('bankname').value=='' || this.empformadd.get('bankname').value==""){
      d='';
    }
    else{
      d=this.empformadd.get('bankname').value;
    }
    this.masterservice.getempbankdropdown(d,1).subscribe(data=>{
      this.banknamelist=data['data'];
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  getbranchdata(){
    if( this.empformadd.get('bankname').value.id==undefined ||  this.empformadd.get('bankname').value=='' ||  this.empformadd.get('bankname').value==null){
      this.notification.showError('Plaese Select The Bank Name');
      return false;
    }
    let d:any;
    if(this.empformadd.get('branchname').value==null || this.empformadd.get('branchname').value==undefined || this.empformadd.get('branchname').value=='' || this.empformadd.get('branchname').value==""){
      d='';
    }
    else{
      d=this.empformadd.get('branchname').value;
    }
    this.masterservice.getempbranchdropdown(this.empformadd.get('bankname').value.id,d,1).subscribe(data=>{
      this.branchnamelist=data['data'];
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  submitempform(){
    if(this.empformadd.get('bankname').value.name=='KARUR VYSYA BANK'){
      if(this.empformadd.get('accountno').value.toString().length==15){
        console.log(this.empformadd.get('accountno').value);
      }
      else{
        this.notification.showError('Please Enter The Account Number 15 Digits');
        return false;
      }
    }
    else{
      if(this.empformadd.get('accountno').value.toString().length==18){
        console.log(this.empformadd.get('accountno').value);
      }
      else{
        this.notification.showError('Please Enter The Account Number 18 Digits');
        return false;
      }
    }
    console.log(this.empformadd.value);
    if(this.empformadd.get('empcode').value.id==undefined || this.empformadd.get('empcode').value==undefined || this.empformadd.get('empcode').value==null || this.empformadd.get('empcode').value==""){
      this.notification.showError('Please Enter The Employee Code');
      return false;
    }
    if(this.empformadd.get('paymode').value.id==undefined || this.empformadd.get('paymode').value==undefined || this.empformadd.get('paymode').value==null || this.empformadd.get('paymode').value==""){
      this.notification.showError('Please Enter The Pay Mode');
      return false;
    }
    if(this.empformadd.get('bankname').value.id==undefined || this.empformadd.get('bankname').value==undefined || this.empformadd.get('bankname').value==null || this.empformadd.get('bankname').value==""){
      this.notification.showError('Please Enter The Bank Name');
      return false;
    }
    if(this.empformadd.get('branchname').value.id==undefined || this.empformadd.get('branchname').value==undefined || this.empformadd.get('branchname').value==null || this.empformadd.get('branchname').value==""){
      this.notification.showError('Please Enter The Branch Name');
      return false;
    }
    if(this.empformadd.get('benifiencyname').value.toString().trim()==undefined || this.empformadd.get('benifiencyname').value==undefined || this.empformadd.get('benifiencyname').value==null || this.empformadd.get('benifiencyname').value==""){
      this.notification.showError('Please Enter The Benifiency Name');
      return false;
    }
    let d:any={
      "account_number":this.empformadd.get('accountno').value,
      "bank": this.empformadd.get('bankname').value.id,
      "bankbranch": this.empformadd.get('branchname').value.id,
      "beneficiary_name": this.empformadd.get('benifiencyname').value,
      "employee": this.empformadd.get('empcode').value.id,
      "paymode": this.empformadd.get('paymode').value.id
  }
  this.spinner.show();
  this.masterservice.getempbankcreate(d).subscribe(data=>{
    this.spinner.hide();
    if(data['status']=='success'){
      this.notification.showSuccess(data['message']);
      this.router.navigate(['master/empbank']);
    }
    else{
      this.notification.showError(data['code']);
      this.notification.showError(data['description']);
    }
  },
  (error)=>{
    this.spinner.hide();
    this.notification.showError(error.status+error.statusText);
  }
  )

  }
  keypressd(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode ==64 || charCode ==94 || charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<58 || charCode>126)) {
      return false;
    }
    return true;
  }
  keypressdd(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode==64 || charCode ==94 || charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<58 || charCode>123)) {
      return false;
    }
    return true;
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
                    this.empcodelist = this.empcodelist.concat(datas);
                    if (this.emppaycodelist.length >= 0) {
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
 autocompleteDeptScrollpay() {
  setTimeout(() => {
    if (
      this.matPay &&
      this.autocompletetrigger &&
      this.matPay.panel
    ) {
      fromEvent(this.matPay.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matPay.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matPay.panel.nativeElement.scrollTop;
          const scrollHeight = this.matPay.panel.nativeElement.scrollHeight;
          const elementHeight = this.matPay.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_paynxt === true) {
              this.masterservice.getemppaydropdown(this.payInput.nativeElement.value,this.has_paypage+1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.emppaycodelist = this.emppaycodelist.concat(datas);
                  if (this.emppaycodelist.length >= 0) {
                    this.has_paynxt = datapagination.has_next;
                    this.has_paypre = datapagination.has_previous;
                    this.has_paypage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });

}
autocompleteDeptScrollBank() {
  setTimeout(() => {
    if (
      this.matBank &&
      this.autocompletetrigger &&
      this.matBank.panel
    ) {
      fromEvent(this.matBank.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matBank.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matBank.panel.nativeElement.scrollTop;
          const scrollHeight = this.matBank.panel.nativeElement.scrollHeight;
          const elementHeight = this.matBank.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_banknxt === true) {
              this.masterservice.getempbankdropdown(this.bankInput,this.has_bankpage+1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.banknamelist = this.banknamelist.concat(datas);
                  if (this.banknamelist.length >= 0) {
                    this.has_banknxt = datapagination.has_next;
                    this.has_bankpre = datapagination.has_previous;
                    this.has_bankpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });

}
autocompleteDeptScrollBranch() {
  setTimeout(() => {
    if (
      this.matBranch &&
      this.autocompletetrigger &&
      this.matBranch.panel
    ) {
      fromEvent(this.matBranch.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matBranch.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matBranch.panel.nativeElement.scrollTop;
          const scrollHeight = this.matBranch.panel.nativeElement.scrollHeight;
          const elementHeight = this.matBranch.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_branchnxt === true) {
              this.masterservice.getempbranchdropdown( this.empformadd.get('bankname').value.id,this.branchInput.nativeElement.value,this.has_branchpage+1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.branchnamelist = this.branchnamelist.concat(datas);
                  if (this.branchnamelist.length >= 0) {
                    this.has_branchnxt = datapagination.has_next;
                    this.has_branchpre = datapagination.has_previous;
                    this.has_branchpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });

}
  empactiveinactivedata(data:any){
    let dta:any={'id':data.id,'status':data.status};
    this.masterservice.getactiveinsctiveempbank(dta).subscribe(result=>{
      if(result['status']=='success'){
        this.notification.showSuccess(result['message']);
        this.getsummary(1);
      }
      else{
        this.notification.showError(result['code']);
        this.notification.showError(result['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
}
