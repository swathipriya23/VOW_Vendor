import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AtmaService } from '../atma.service'
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize} from 'rxjs/operators';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
// export interface ApCategory {
//   id: string;
//   name: string;
// }
export interface catlistss {
  id: string;
  name: string;
}

export interface explistss {
  id: string;
  head: string;
}
@Component({
  selector: 'app-apsubcategory',
  templateUrl: './apsubcategory.component.html',
  styleUrls: ['./apsubcategory.component.scss']
})
export class ApsubcategoryComponent implements OnInit {
//   isLoading = false;
//   readonly separatorKeysCodes: number[] = [ENTER, COMMA];
//   @Output() onCancel = new EventEmitter<any>();
//   @Output() onSubmit = new EventEmitter<any>();
//   apSubCategoryForm: FormGroup
//   disableSubmit = true;
//   categoryList: Array<ApCategory>;
//   categoryID: any;
//   category_id = new FormControl();

//   gstblockedlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]
//   gstrcmlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]

//   constructor(private fb: FormBuilder, private router: Router,
//     private atmaService: AtmaService, private notification: NotificationService,
//     private toastr: ToastrService) { }

//   ngOnInit(): void {
//     this.apSubCategoryForm = this.fb.group({
//       category_id: ['', Validators.required],
//       expense: ['', Validators.required],
//       glno: ['', Validators.required],
//       gstblocked: ['', Validators.required],
//       gstrcm: ['', Validators.required],
//       name: ['', Validators.required],
//       no: ['', Validators.required],

//     })
//     let apcatkeyvalue: String = "";
//     this.getcategory(apcatkeyvalue);
//     this.apSubCategoryForm.get('category_id').valueChanges
//       .pipe(
//         debounceTime(100),
//         distinctUntilChanged(),
//         tap(() => {
//           this.isLoading = true;
//         }),
//         switchMap(value => this.atmaService.getcategory(value)
//           .pipe(
//             finalize(() => {
//               this.isLoading = false
//             }),
//           )
//         )
//       )
//       .subscribe((results: any[]) => {
//         let datas = results["data"];
//         this.categoryList = datas;
//         console.log("category", datas)

//       })

//   }

//   public displayapcat(apcatname?: ApCategory): string | undefined {
//     return apcatname ? apcatname.name : undefined;
//   }
//   get apcatname() {
//     return this.apSubCategoryForm.get('category_id');
//   }

//   private getcategory(apcatkeyvalue) {
//     this.atmaService.getcategory(apcatkeyvalue)
//       .subscribe((results: any[]) => {
//         let datas = results["data"];
//         this.categoryList = datas;

//       })
//   }
//   createFormate() {
//     let data = this.apSubCategoryForm.controls;
//     let apatclass = new apcatsubtype();
//     apatclass.category_id = data['category_id'].value.id;
//     apatclass.expense = data['expense'].value;
//     apatclass.glno = data['glno'].value;
//     apatclass.gstblocked = data['gstblocked'].value;
//     apatclass.gstrcm = data['gstrcm'].value;
//     apatclass.name = data['name'].value;
//     apatclass.no = data['no'].value;
//     return apatclass;
//   }

//   apsubcategoryCreateForm() {
//     this.disableSubmit = true;
//     if (this.apSubCategoryForm.valid) {
//       this.atmaService.apSubCategoryCreateForm(this.createFormate())
//         .subscribe(res => {
//           console.log("res", res)
//           if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
//             this.notification.showWarning("Duplicate! Code Or Name ...")
//             this.disableSubmit = false;

//           } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
//             this.notification.showError("INVALID_DATA!...")
//             this.disableSubmit = false;

//           } else {
//             this.notification.showSuccess("saved Successfully!...")
//             this.onSubmit.emit();
//           }
//         }
//         )
//     } else {
//       this.notification.showError(("INVALID_DATA..."))
//       this.disableSubmit = false;
//     }
//   }

//   onCancelClick() {
//     this.onCancel.emit()
//   }

// }


// class apcatsubtype {
//   category_id: any;
//   expense: string;
//   glno: string;
//   gstblocked: string;
//   gstrcm: string;
//   name: string;
//   no: string;

// }



@Output() onCancel = new EventEmitter<any>();
@Output() onSubmit = new EventEmitter<any>();
apSubCategoryForm: FormGroup


categoryList: Array<catlistss>;
category_id     = new FormControl();


expenseList: Array<catlistss>;
expense_id     = new FormControl();
isLoading = false;
has_next = true;
has_previous = true;
currentpage: number = 1;
assetcodeenb:boolean=false;
@ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

@ViewChild('cat') matcatAutocomplete: MatAutocomplete;
@ViewChild('catInput') catInput: any;

@ViewChild('exp') matexpAutocomplete: MatAutocomplete;
@ViewChild('expInput') expInput: any;

gstblockedlist=[{'id':'1', 'show':'Yes', 'name':'1'},{'id':'2', 'show':'No', 'name':'0'}]
gstrcmlist=[{'id':'1','show':'Yes', 'name':'1'},{'id':'2','show':'No', 'name':'0'}]

  constructor(private fb: FormBuilder, private router: Router,
    private atmaService: AtmaService, private notification: NotificationService,
    private toastr: ToastrService,private spinner:NgxSpinnerService) { }
  
  
  ngOnInit(): void {
    this.apSubCategoryForm = this.fb.group({
      category_id: ['', this.SelectionValidator],
      name: ['', Validators.required],
      no: ['', Validators.required],
      expense_id: ['', Validators.required],
      glno: ['', Validators.required],
      gstblocked: ['', Validators.required],
      gstrcm: ['', Validators.required],
      assetcode: ['',Validators.required],
      category_no:['',Validators.required],
      blocked_rcm:['',Validators.required]
    })


    let apcatkeyvalue: String = "";
    this.getcategory(apcatkeyvalue);
    this.apSubCategoryForm.get('category_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getcategoryFKdd(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.categoryList = datas;

    })
    let expkeyvalue: String = "";
    this.getexp(expkeyvalue);
    this.apSubCategoryForm.get('expense_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getexpen(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.expenseList = datas;

    })


}
dataevent(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

autocompletecatScroll() {
setTimeout(() => {
  if (
    this.matcatAutocomplete &&
    this.autocompleteTrigger &&
    this.matcatAutocomplete.panel
  ) {
    fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
      .pipe(
        map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      )
      .subscribe(x => {
        const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
        const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
        const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
        const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
        if (atBottom) {
          if (this.has_next === true) {
            this.atmaService.getcategoryFKdd(this.catInput.nativeElement.value, this.currentpage + 1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let datapagination = results["pagination"];
                this.categoryList = this.categoryList.concat(datas);
                // console.log("emp", datas)
                if (this.categoryList.length >= 0) {
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

public displayFncat(cat?: catlistss): string | undefined {
return cat ? cat.name : undefined;
}

get cat() {
return this.apSubCategoryForm.get('category_id');
}


private getcategory(apcatkeyvalue) {
this.atmaService.getcategorydd(apcatkeyvalue)
.subscribe((results: any[]) => {
let datas = results["data"];
this.categoryList = datas;
})
}


autocompleteexpScroll() {
setTimeout(() => {
  if (
    this.matexpAutocomplete &&
    this.autocompleteTrigger &&
    this.matexpAutocomplete.panel
  ) {
    fromEvent(this.matexpAutocomplete.panel.nativeElement, 'scroll')
      .pipe(
        map(x => this.matexpAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      )
      .subscribe(x => {
        const scrollTop = this.matexpAutocomplete.panel.nativeElement.scrollTop;
        const scrollHeight = this.matexpAutocomplete.panel.nativeElement.scrollHeight;
        const elementHeight = this.matexpAutocomplete.panel.nativeElement.clientHeight;
        const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
        if (atBottom) {
          if (this.has_next === true) {
            this.atmaService.getexpen(this.expInput.nativeElement.value, this.currentpage + 1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let datapagination = results["pagination"];
                this.expenseList = this.expenseList.concat(datas);
                // console.log("emp", datas)
                if (this.expenseList.length >= 0) {
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

public displayFnexp(exp?: explistss): string | undefined {
return exp ? exp.head : undefined;
}

get exp() {
return this.apSubCategoryForm.get('expense_id');
}


private getexp(expkeyvalue) {
this.atmaService.getexp(expkeyvalue)
.subscribe((results: any[]) => {
let datas = results["data"];
this.expenseList = datas;
})
}

private SelectionValidator(fcvalue: FormControl) {
if (typeof fcvalue.value === 'string') {
  return { incorrectValue: `Selected value only Allowed` }
}
return null;
}
apsubcategoryCreateForm(){
  // if(this.apSubCategoryForm.value.glno.trim().toString().length==9 || this.apSubCategoryForm.value.glno.trim().toString().length==16){
  //  console.log('1');
  // }
  // else{
  //   this.notification.showError("Please Enter The GlNo 9 or 16 digits");
  //   return false;
  // }
if (this.apSubCategoryForm.value.category_id===""){
  this.toastr.error('Add Category Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}
if (this.apSubCategoryForm.value.name===""){
  this.toastr.error('Add Name Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}if (this.apSubCategoryForm.value.name.trim()===""){
  this.toastr.error('Add Name Field',' WhiteSpace Not Allowed',{timeOut: 1500});
  return false;
}
// if (this.apSubCategoryForm.value.name.trim().length > 20){
//   this.toastr.error('Not more than 20 characters','Enter valid Name' ,{timeOut: 1500});
//   return false;
// }
if (this.apSubCategoryForm.value.no===""){
  this.toastr.error('Add No Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}if (this.apSubCategoryForm.value.no.trim()===""){
  this.toastr.error('Add No Field',' WhiteSpace Not Allowed',{timeOut: 1500});
  return false;
}
// if (this.apSubCategoryForm.value.no.trim().length > 20){
//   this.toastr.error('Not more than 20 characters','Enter valid No' ,{timeOut: 1500});
//   return false;
// }
// if (this.apSubCategoryForm.value.expense_id===""){
//   this.toastr.error('Add Expense Field','Empty value inserted' ,{timeOut: 1500});
//   return false;
// }
// if (this.apSubCategoryForm.value.expense.trim()===""){
//   this.toastr.error('Add Expense Field',' WhiteSpace Not Allowed',{timeOut: 1500});
//   return false;
// }
// if (this.apSubCategoryForm.value.expense.trim().length > 20){
//   this.toastr.error('Not more than 20 characters','Enter valid Expense' ,{timeOut: 1500});
//   return false;}
if (this.apSubCategoryForm.value.glno===""){
  this.toastr.error('Add GL NO Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}if (this.apSubCategoryForm.value.glno.trim()===""){
  this.toastr.error('Add GL NO Field',' WhiteSpace Not Allowed',{timeOut: 1500});
  return false;
}
// if (this.apSubCategoryForm.value.glno.trim().length > 20){
//   this.toastr.error('Not more than 20 characters','Enter valid GL NO' ,{timeOut: 1500});
//   return false;
// }
if (this.apSubCategoryForm.value.gstblocked===""){
  this.toastr.error('Add Gst Blocked Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}if (this.apSubCategoryForm.value.gstrcm===""){
  this.toastr.error('Add GST RCM Field','Empty value inserted' ,{timeOut: 1500});
  return false;
}
if(this.assetcodeenb==true){
  if(this.apSubCategoryForm.value.assetcode.toString().length==1){
    console.log('Done');
    }
    else{
      this.notification.showError('Please Enter The Asset Code 1 Character');
      return false;
    }
}


this.apSubCategoryForm.value.category_id=this.apSubCategoryForm.value.category_id.id;
this.apSubCategoryForm.value.expense_id=this.apSubCategoryForm.value.expense_id.id;

// let data = this.apSubCategoryForm.value;
let data:any={
  "no":this.apSubCategoryForm.value.no,
  "name":this.apSubCategoryForm.value.name.trim(),
  "category_id": this.apSubCategoryForm.value.category_id,
  "glno":this.apSubCategoryForm.value.glno.trim(),
  // "expense_id":this.apSubCategoryForm.value.expense_id,
  "gstblocked":this.apSubCategoryForm.value.gstblocked,
  "gstrcm":this.apSubCategoryForm.value.gstrcm,
  //"code":this.apSubCategoryForm.value.assetcode.toString().toUpperCase()
  
};
if(this.assetcodeenb==true){
  data['code']=this.apSubCategoryForm.value.assetcode.toString().toUpperCase();
}
console.log(data);


this.spinner.show();
this.atmaService.apSubCategoryCreateForm(data)
.subscribe(res => {
 this.spinner.hide();
    if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
      this.notification.showError("Duplicate Data! ...[INVALID_DATA! ...]")
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.notification.showWarning("Duplicate Data! ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.notification.showError("INVALID_DATA!...")
    } else {
    this.notification.showSuccess("saved Successfully!...")
    this.onSubmit.emit();
    }
  }
),
(error)=>{
  this.spinner.hide();
  this.notification.showWarning(error.status+error.statusText);
}
}
onCancelClick() {
this.onCancel.emit()
}
getcategotydata(data){
  console.log('1')
  console.log(this.apSubCategoryForm.get('category_id').value.id);
  this.apSubCategoryForm.get('category_no').patchValue(this.apSubCategoryForm.get('category_id').value.no);
  if (data['isasset']=="Y" || data['isasset']==1 || data['isasset']=='1'){
    this.assetcodeenb=true;
  }
  else{
    this.assetcodeenb=false;
  }

}
kyenbdata(event:any){
  let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
  console.log(d.test(event.key))
  if(d.test(event.key)==true){
    return false;
  }
  return true;
}
kyenbdata_new(event:any){
  let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
  console.log(d.test(event.key))
  if(d.test(event.key)==true){
    return false;
  }
  return true;
}
}