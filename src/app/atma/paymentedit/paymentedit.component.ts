import { Component, OnInit ,EventEmitter,Input,Output,ViewChild} from '@angular/core';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize,map,takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export interface paymode {
  id: string;
  name: string;
}
export interface bank {
  ifsccode: string;
  id: string;
  name: string;
}
export interface branch {
  id: string;
  name: string;
  ifsccode:string;
}
@Component({
  selector: 'app-paymentedit',
  templateUrl: './paymentedit.component.html',
  styleUrls: ['./paymentedit.component.scss'],
  providers:[
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },]
})
export class PaymenteditComponent implements OnInit {
  @ViewChild('branch_id') branch_id;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  mainbranch:any;
  branchPayment: FormGroup;
  getBankbranchList:Array<branch>;
  account_type=[];
  branchrefid=0;
  bankList:Array<bank>;
  getPaymodeList: Array<paymode>;
  isLoading = false;
  subtax_btn=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  payment_btn=false;

  @ViewChild('bankdata') matbankAutocomplete: MatAutocomplete;
  @ViewChild('bankInput') bankInput: any;
  @ViewChild('paymodedata') matpaymodeAutocomplete: MatAutocomplete;
  @ViewChild('paymodeInput') paymodeInput: any;
  @ViewChild('branchdata') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  paymode_ddflag=false;
  ifsccode: any;
  ifsccodename: string;
  maxlength=18;
  constructor(private fb: FormBuilder,private shareService: ShareService,
    private atmaService: AtmaService,private notification: NotificationService,
    private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService) { }
  ngOnInit(): void {
    this.branchPayment = this.fb.group({
      supplier: ['', Validators.required],
      paymode_id: ['', Validators.required],
      bank_id: ['', Validators.required],
      branch_id: ['', Validators.required],
      account_type: ['', Validators.required],
      beneficiary: [''],
      account_no: ['', Validators.required],
      remarks: ['', Validators.required],
      id:['',],
      bname:[''],
      bankname:['']

    })
    this.branchdetails();
      
  }
  getpayname(){
    let query: String = "";
    this.getPaymode(query);

    this.branchPayment.get('paymode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
         

        }),
        switchMap(value => this.atmaService.get_paymodeScroll(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.getPaymodeList = datas;
      

      })
  }
  getbanknames(){
    let query1: String = "";
    this.getBank(query1);

    this.branchPayment.get('bank_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;   

        }),
        switchMap(value => this.atmaService.get_bankScroll(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bankList = datas;
      

      })
  }
  getbranchnames(){
    let q: String = "";
    this.getBankbranch(this.branchrefid,q);

    this.branchPayment.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          

        }),
        switchMap(value => this.atmaService.branchdropdown(this.branchrefid,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.getBankbranchList = datas;
      

      })

  }


  onCancelClick(){
    this.onCancel.emit()
  }
  private getBank(q) {
    this.atmaService.bankdropdown(q)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bankList = datas;
       
  
      })
  }
  branchPaymentCreate() {
    this.SpinnerService.show();
    if (this.branchPayment.value.supplier ===""){
      this.toastr.error('Please Enter Supplier Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchPayment.value.paymode_id ===""||this.branchPayment.value.paymode_id.id ===undefined){
      this.toastr.error('Please Select Valid Paymode');
      this.SpinnerService.hide();
      return false;
      
    }if(!this.paymode_ddflag){
    if (this.branchPayment.value.account_type ===""||this.branchPayment.value.account_type ===undefined){
      this.toastr.error('Please Select Any One Account Type');
      this.SpinnerService.hide();
      return false;
      
    }
    if (this.branchPayment.value.bank_id ==="" ||this.branchPayment.value.bank_id.id ===undefined){
      this.toastr.error('Please Select Valid Bank');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchPayment.value.branch_id === null ||this.branchPayment.value.branch_id ==="" ||this.branchPayment.value.branch_id.id===undefined){
      this.toastr.error('Please Select Valid IFSC');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchPayment.value.account_no ===""){
      this.toastr.error('Please Enter Account No');
      this.SpinnerService.hide();
      return false;
    }
  
    if(this.branchPayment.value.bankname=="KARUR VYSYA BANK"){
      if(this.branchPayment.value.account_no.length!=16){
        this.toastr.error('Account No Must be 16 digits  ');
      this.SpinnerService.hide();
      return false;
      }
    }
  }
    else{
    //   this.branchPayment.value.account_no='';
    //   this.branchPayment.value.bank_id='';
    //   this.branchPayment.value.branch_id ='';
    //   this.branchPayment.value.account_type ='';
      this.branchPayment.get('bank_id').setValue('')
      this.branchPayment.get('branch_id').setValue('')
      this.branchPayment.get('bankname').setValue('')
       this.branchPayment.get('bname').setValue('')
       this.branchPayment.get('account_no').setValue('')
      this.branchPayment.get('account_type').setValue('')
            
  
  
    }
    // if (this.branchPayment.value.beneficiary ===""){
    //   this.toastr.error('Please Enter Benificiary Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    if (this.branchPayment.value.beneficiary ===""){
      this.branchPayment.value.beneficiary= null
    }
    
  

    this.branchPayment.value.paymode_id=this.branchPayment.value.paymode_id.id;
    this.branchPayment.value.branch_id=this.branchPayment.value.branch_id.id;
    this.branchPayment.value.bank_id=this.branchPayment.value.bank_id.id;

    var str = this.branchPayment.value.account_no
    var cleanStr_accnum=str.trim();//trim() returns string with outer spaces removed
    this.branchPayment.value.account_no = cleanStr_accnum

    if(this.branchPayment.value.beneficiary !=null){
    var str = this.branchPayment.value.beneficiary
    var cleanStr_bene=str.trim();//trim() returns string with outer spaces removed
    this.branchPayment.value.beneficiary = cleanStr_bene
  }

    var str = this.branchPayment.value.remarks
    var cleanStr_rm=str.trim();//trim() returns string with outer spaces removed
    this.branchPayment.value.remarks = cleanStr_rm




    this.atmaService.branchPayMentCreate(this.branchPayment.value,this.mainbranch)
      .subscribe(res => {
        console.log("payment update",res)
        if(res.id === undefined){
          this.notification.showError(res.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("Updated Successfully!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
          this.ngOnInit();
        }
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  bankScroll() {
    setTimeout(() => {
    if (
    this.matbankAutocomplete &&
    this.autocompleteTrigger &&
    this.matbankAutocomplete.panel
    ) {
    fromEvent(this.matbankAutocomplete.panel.nativeElement, 'scroll')
    .pipe(
    map(x => this.matbankAutocomplete.panel.nativeElement.scrollTop),
    takeUntil(this.autocompleteTrigger.panelClosingActions)
    )
    .subscribe(x => {
    const scrollTop = this.matbankAutocomplete.panel.nativeElement.scrollTop;
    const scrollHeight = this.matbankAutocomplete.panel.nativeElement.scrollHeight;
    const elementHeight = this.matbankAutocomplete.panel.nativeElement.clientHeight;
    const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    if (atBottom) {
    if (this.has_next === true) {
    this.atmaService.get_bankScroll(this.bankInput.nativeElement.value, this.currentpage + 1)
    .subscribe((results: any[]) => {
    let datas = results["data"];
    let datapagination = results["pagination"];
    this.bankList = this.bankList.concat(datas);
    if (this.bankList.length >= 0) {
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

    branchScroll() {
      setTimeout(() => {
      if (
      this.matbranchAutocomplete &&
      this.autocompleteTrigger &&
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
      this.atmaService.branchdropdown(this.branchrefid,this.branchInput.nativeElement.value, this.currentpage + 1)
      .subscribe((results: any[]) => {
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.getBankbranchList = this.getBankbranchList.concat(datas);
      if (this.getBankbranchList.length >= 0) {
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
    
    
    paymodeScroll() {
      setTimeout(() => {
      if (
      this.matpaymodeAutocomplete &&
      this.autocompleteTrigger &&
      this.matpaymodeAutocomplete.panel
      ) {
      fromEvent(this.matpaymodeAutocomplete.panel.nativeElement, 'scroll')
      .pipe(
      map(x => this.matpaymodeAutocomplete.panel.nativeElement.scrollTop),
      takeUntil(this.autocompleteTrigger.panelClosingActions)
      )
      .subscribe(x => {
      const scrollTop = this.matpaymodeAutocomplete.panel.nativeElement.scrollTop;
      const scrollHeight = this.matpaymodeAutocomplete.panel.nativeElement.scrollHeight;
      const elementHeight = this.matpaymodeAutocomplete.panel.nativeElement.clientHeight;
      const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
      if (atBottom) {
      if (this.has_next === true) {
      this.atmaService.get_paymodeScroll(this.paymodeInput.nativeElement.value, this.currentpage + 1)
      .subscribe((results: any[]) => {
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.getPaymodeList = this.getPaymodeList.concat(datas);
      if (this.getPaymodeList.length >= 0) {
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
      
  

  getPaymode(q) {
    this.atmaService.paymodedropdown(q)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.getPaymodeList = datas;
        let datapagination = results["pagination"];
        this.getPaymodeList = datas;
       
      })
  }
  // ---paymode
  public displayPaymode(paymodeget?: paymode): string | undefined {
    return paymodeget ? paymodeget.name : undefined;
  }

  get paymodeget() {
    return this.branchPayment.get('paymode_id');
  }
// ------

// ---bank
public displayBank(bankget?: bank): string | undefined {  
  return bankget ? bankget.name : undefined;
}

get bankget() {
  return this.branchPayment.get('bank_id');
}
// ------

// ---bankbranch
public displayBranch(bankbranchget?: bank): string | undefined {
  return bankbranchget ? bankbranchget.ifsccode : undefined;
}

get bankbranchget() {
  return this.branchPayment.get('branch_id');
}
// ------


getBankbranch(id,query) {
    this.atmaService.branchdropdown(id,query,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.getBankbranchList = datas;
       
        let datapagination = results["pagination"];
        this.getBankbranchList = datas;
        
      })
  }
  clear(){
    this.branch_id.nativeElement.value = ' ';
  
  }

  getbranch(data){
    this.branchPayment.get('branch_id').setValue(null);
    this.branchPayment.get('bname').setValue(null);
    this.displayBranch(null)
    this.branchrefid=data.id;
    this.getBankbranch(data.id,'')
  }

    getbranchname(data){
      // this.branchPayment.get('bname').setValue(data.name);
      
        let ifsccode = data.ifsccode
        if(data.id!=undefined){
          this.SpinnerService.show();
          this.branchPayment.get('bank_id').setValue(data.bank)
          this.branchPayment.get('bankname').setValue(data.bank.name)
          this.branchPayment.get('bname').setValue(data.name)
          if(this.branchPayment.value.bankname=="KARUR VYSYA BANK"){
            this.maxlength=16
          }else{
            this.maxlength=18
          }
          
        // this.atmaService.ifscodevalidation(ifsccode).then(res => {
        //     let result = res.validation_status
        //     this.ifsccode = result
        //     if (result.bpms_error_msg !="Success") {
        //       this.notification.showWarning("Please Choose a Valid IFSC Code")
        //       this.ifsccodename='';
        //       // this.user$=
        //       this.branchPayment.get('bank_id').setValue('')
        //       this.branchPayment.get('bankname').setValue('')
        //       this.branchPayment.get('bname').setValue('')
             
        //       this.SpinnerService.hide();
        //       return false;
              
        //     } if (result.bpms_error_msg === "Success") {
        //       this.notification.showSuccess("IFSC  validated...")
              
        //       if(result.out_msg.Bank_Name==data.bank.name){
        //         this.branchPayment.get('bank_id').setValue(data.bank)
        //         this.branchPayment.get('bankname').setValue(data.bank.name)
            
        
        //      } 
        //      if(result.out_msg.Branch_Name==data.name){
        //       this.branchPayment.get('bname').setValue(data.name)
          
      
        //    } 
             this.SpinnerService.hide();
            }else{
              this.notification.showWarning("Please Choose a Valid IFSC Code")
              this.ifsccodename='';
              this.SpinnerService.hide();
              this.branchPayment.get('bank_id').setValue('')
              this.branchPayment.get('bankname').setValue('')
              this.branchPayment.get('bname').setValue('')
             
            }
    
        //   },
        //   error => {
        //     this.notification.showWarning("IFSC validation failure")
        //     this.branchPayment.get('bank_id').setValue('')
        //     this.branchPayment.get('bankname').setValue('')
        //     this.branchPayment.get('bname').setValue('')
           
        //     this.SpinnerService.hide();
        //     return false;
        //   }
          // )}
    
      
    
  
      
    }
    
  
  branchdetails() {
    let data :any= this.shareService.paymenteditid.value;
   this.mainbranch=data.supplierbranch_id.id;
    
    

   
  this.branchPayment.patchValue({
    account_no:data.account_no,
    supplier:data.supplier,
    account_type:data.account_type,
    bank_id:data.bank_id,
    beneficiary:data.beneficiary,
    branch_id:data.branch_id,
    id:data.id,
    remarks:data.remarks,
    paymode_id:data.paymode_id,
    bname:data.branch_id.name,
    bankname:data.bank_id.name

  
  })
  this.branchrefid=data.bank_id.id
  this.paymodetype(data.paymode_id)
  
  // this.branchPayment.get('bname').setValue(data.branch_id.name);
}
omit_special_char(event) {
  var k;
  k = event.charCode;
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}
namevalidation(event){
    
  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z0-9-/  ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

addressvalidation(event){
  
  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
paymodetype(event){
  if(event.name=="DD"){
  this.paymode_ddflag=true

  this.branchPayment.get('branch_id').setValue('')
  this.branchPayment.get('bank_id').setValue('')
      this.branchPayment.get('bankname').setValue('')
       this.branchPayment.get('bname').setValue('')
       this.branchPayment.get('account_no').setValue('')
      this.branchPayment.get('account_type').setValue('')
      
            
  
  
}
  else{
  this.paymode_ddflag=false;
  }}
}
