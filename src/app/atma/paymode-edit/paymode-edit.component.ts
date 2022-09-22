import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { finalize, switchMap, tap } from 'rxjs/operators';

export interface category{
  id:string;
  name:string
}
export interface subcategory{
  id:string;
  name:string
}

@Component({
  selector: 'app-paymode-edit',
  templateUrl: './paymode-edit.component.html',
  styleUrls: ['./paymode-edit.component.scss']
})
export class PaymodeEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('modalclose') modalClosed:ElementRef;
  paymodeEditForm: FormGroup;
  paymodeaddform:any=FormGroup;
  disableSubmit = true;
  pageSize:number=10;
  page:number=1;
  has_next:boolean=false;
  has_previous:boolean=false;
  paymodeSummary: Array<any>=[];
  categoryList: Array<any>=[];
  subcategoryList: Array<any>=[];
  isLoading:boolean;
  name:string='';
  constructor(private fb: FormBuilder, private router: Router, private notification: NotificationService,
    private atmaService: AtmaService, private shareService: ShareService) { }

  ngOnInit(): void {
    this.paymodeEditForm = this.fb.group({
      code:['',Validators.required],
      name: ['', Validators.required]
    });
    this.paymodeaddform=this.fb.group({
      category:['',Validators.required],
      subcategory:['',Validators.required],
      glno:['',Validators.required],
      paymodedetail:['',Validators.required],
      drop:['',Validators.required]
    });
    this.atmaService.getapcat_LoadMore('',1).subscribe(data=>{
      this.categoryList=data['data'];
    });
    this.paymodeaddform.get('category').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.getapcat_LoadMore(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.categoryList=data['data'];
    });
    this.getPaymodeEdit();
    this.getpaymodesummary(this.page);
  }
  public getdisplaycategory(data?:category):string | undefined{
    return data?data.name:undefined;
  }
  public getdisplaysubcategory(data?:subcategory):string | undefined{
    return data?data.name:undefined;
  }
  getpaymodesummary(page:any){
    let data:any=this.shareService.paymodeEditValue.value;
    this.atmaService.getpaymodeeditsummary(data.id,page,'','',2).subscribe(dta=>{
      this.paymodeSummary=dta['data'];
      let Pagination=dta['pagination'];
      this.has_next=Pagination.has_next;
      this.has_previous=Pagination.has_previous;
      this.page=Pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  getpaymodesummarysearch(page:any){
    let d:any={'ACTIVE':1,'INACTIVE':0,'ALL':2};
    let data:any=this.shareService.paymodeEditValue.value;
    let code:any=this.paymodeEditForm.get('code').value?this.paymodeEditForm.get('code').value:'';
    let name:any=this.paymodeEditForm.get('name').value?this.paymodeEditForm.get('name').value:'';
    let status:any=d[this.paymodeEditForm.get('drop').value?this.paymodeEditForm.get('name').value:'ALL'];

    this.atmaService.getpaymodeeditsummary(data.id,page,code,name,status).subscribe(dta=>{
      this.paymodeSummary=dta['data'];
      let Pagination=dta['pagination'];
      // this.has_next=Pagination.has_next;
      // this.has_previous=Pagination.has_previous;
      // this.page=Pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  getactiveinactive(data:any){
    let senddata:any={'status':data.status,'id':data.id};
    this.atmaService.getpaymodeactiveinactive(senddata).subscribe(result=>{
      if(result['status']=='success'){
        this.notification.showSuccess(result['message']);
        this.getpaymodesummary(1);
      }
      else{
        this.notification.showError(result['code']);
        this.notification.showError(result['description']);
      }
    })
  }
  getsubcategorydata(){
    console.log(this.paymodeaddform.value);
    if(this.paymodeaddform.get('category').value.id==undefined || this.paymodeaddform.get('category').value=='' || this.paymodeaddform.get('category').value==null){
      this.notification.showError('Please Select The category');
      return false;
    }
    this.atmaService.getapsubcat(this.paymodeaddform.get('category').value.id).subscribe(data=>{
      this.subcategoryList=data['data'];
    });
    this.paymodeaddform.get('category').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.getapsubcat(this.paymodeaddform.get('category').value.id).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.subcategoryList=data['data'];
    });
  }
  focusoutdatasub(dta:any){
    console.log(this.paymodeaddform.value);
    console.log(dta);
    this.paymodeaddform.get('glno').patchValue(dta.glno);
  }
  getPaymodeEdit() {
    let data: any = this.shareService.paymodeEditValue.value;
    console.log("paymodeEDITvAUE", data)
    this.name=data.name;
    let Name = data.name
    let Code:any=data.code;
    this.paymodeEditForm.patchValue({
      code:Code,
      name: Name
    });

  }
  submitForm() {
    this.disableSubmit = true;
    if(this.paymodeEditForm.get('name').value.toString().trim()=="" || this.paymodeEditForm.get('name').value.toString().trim()=='' || this.paymodeEditForm.get('name').value==undefined || this.paymodeEditForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
      let data: any = this.shareService.paymodeEditValue.value
      this.atmaService.paymodeEditForm(this.paymodeEditForm.value, data.id)
        .subscribe(res => {
          console.log("res", res)
          let code = res.code
          if (code === "INVALID_DATA") {
            this.notification.showError("INVALID_DATA...")
            this.disableSubmit = false;
          } else {
            this.notification.showSuccess("Updated Successfully!...")
            this.onSubmit.emit();
            console.log("paymodeEditForm", res);
          }
        },
        (error)=>{
          this.notification.showError(error.status+error.stattusText);
        }
        );
  
  }
  onCancelClick() {
    this.onCancel.emit()
  }
  paymode_previousClick(){
    if(this.has_previous){
      this.getpaymodesummary(this.page-1);
    }
  }
  paymode_nextClick(){
    if(this.has_next){
      this.getpaymodesummary(this.page+1);
    }
  }
  submitpaymodeadd(){
    console.log(this.paymodeaddform.value);
    if(this.paymodeaddform.get('category').value.id==undefined || this.paymodeaddform.get('category').value=="" || this.paymodeaddform.get('category').value=='' || this.paymodeaddform.get('category').value==null){
      this.notification.showError('Please Select The Category');
      return false;
    }
    if(this.paymodeaddform.get('subcategory').value.id==undefined || this.paymodeaddform.get('subcategory').value=="" || this.paymodeaddform.get('subcategory').value=='' || this.paymodeaddform.get('subcategory').value==null){
      this.notification.showError('Please Select The SubCategory');
      return false;
    }
    if(this.paymodeaddform.get('glno').value==undefined || this.paymodeaddform.get('glno').value=="" || this.paymodeaddform.get('glno').value=='' || this.paymodeaddform.get('glno').value==null){
      this.notification.showError('Please Select The GlNo');
      return false;
    }
    if(this.paymodeaddform.get('paymodedetail').value.toString().trim()==undefined || this.paymodeaddform.get('paymodedetail').value=="" || this.paymodeaddform.get('paymodedetail').value=='' || this.paymodeaddform.get('paymodedetail').value==null){
      this.notification.showError('Please Select The GlNo');
      return false;
    }
    let dta:any=this.shareService.paymodeEditValue.value;
    let data:any={
      "name":this.paymodeaddform.get('paymodedetail').value.toString().trim(),
      "paymode_id":dta.id,
      "category_id":this.paymodeaddform.get('category').value.id,
      "sub_category_id":this.paymodeaddform.get('subcategory').value.id,
      "glno":this.paymodeaddform.get('subcategory').value.glno
    };
    console.log(data);
    this.atmaService.getpaymodecreate(data).subscribe((res:any)=> {
      console.log("res", res)
      let code = res.code
      if (code === "INVALID_DATA") {
        this.notification.showError("INVALID_DATA...")
        this.disableSubmit = false;
      } else {
        this.notification.showSuccess("Updated Successfully!...")
        this.modalClosed.nativeElement.click();
        this.paymodeaddform.reset('');
        this.getpaymodesummary(this.page=1);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.stattusText);
    }
    );
  }

}
