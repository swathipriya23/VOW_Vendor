import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { fromEvent, Observable } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
export interface explistss {
  id: string;
  head: string;
}
@Component({
  selector: 'app-apcategory',
  templateUrl: './apcategory.component.html',
  styleUrls: ['./apcategory.component.scss']
})
export class ApcategoryComponent implements OnInit {
@Output() onCancel = new EventEmitter<any>();
@Output() onSubmit = new EventEmitter<any>();
@ViewChild('exp') matexpAutocomplete: MatAutocomplete;
@ViewChild('expInput') expInput: any;
@ViewChild(MatAutocompleteTrigger) autocompleteTrigger:MatAutocompleteTrigger;
isLoading:boolean;
apCategoryForm: FormGroup
oditList:Array<any>;
expenseList:Array<any>=[];
has_next:boolean = true;
has_previous:boolean = false;
currentpage:number = 1;
filtersiasset:any={'1':'Y','0':'N'};
assetlist=[    {'id':'1', 'name':'1','show':'Yes'},
               {'id':'2', 'name':'0','show':'No'}    ]
  constructor(private fb: FormBuilder, private router: Router,private spinner:NgxSpinnerService,
    private atmaService: AtmaService, private notification: NotificationService, private toastr: ToastrService) { }
ngOnInit(): void {
    this.apCategoryForm = this.fb.group({
      name: ['', Validators.required],
      no: ['', Validators.required],
      glno: ['', Validators.required],
      isasset: ['', Validators.required],
      isodit:['',Validators.required],
      code:['',Validators.required],
      expense_id:['',Validators.required]
    });
    this.apCategoryForm.get('expense_id').valueChanges
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
    this.getODIT();
  }
  getODIT(){
    this.atmaService.getODIT()
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.oditList = datas;
          console.log("oditList", datas)
        })
  }
  public displayFnexp(exp?: explistss): string | undefined {
    return exp ? exp.head : undefined;
    }
  apcategoryCreateForm(){
    // if(this.apCategoryForm.value.glno.toString().trim().length==9 || this.apCategoryForm.value.glno.toString().trim().length==16){
    //   console.log('1');
    // }
    // else{
    //   this.notification.showError('Please Enter The GlNo 9 or 16 Digits');
    //   return false;
    // }
    if (this.apCategoryForm.value.name===""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }if (this.apCategoryForm.value.name.trim()===""){
      this.toastr.error('Add name Field',' WhiteSpace Not Allowed',{timeOut: 1500});
      return false;
    }
    // if (this.apCategoryForm.value.name.trim().length > 20){
    //   this.toastr.error('Not more than 20 characters','Enter valid name' ,{timeOut: 1500});
    //   return false;
    // }
    if (this.apCategoryForm.value.no===""){
      this.toastr.error('Add no Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.apCategoryForm.value.glno===""){
      this.toastr.error('Add glno Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.apCategoryForm.value.isasset===""){
      this.toastr.error('Add isasset Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    // if (this.apCategoryForm.value.code===""){
    //   this.toastr.error('Add code Field','Empty value inserted' ,{timeOut: 1500});
    //   return false;
    // }
    if(this.apCategoryForm.get('expense_id').value.id==undefined || this.apCategoryForm.get('expense_id').value.id==''){
      this.toastr.error('Please Select The Expence');
      return false;
    }
    // let data = this.apCategoryForm.value;

    let data:any={
     
      "no":this.apCategoryForm.value.no,
      "name": this.apCategoryForm.value.name,
      "glno":this.apCategoryForm.value.glno,
      "isasset":this.filtersiasset[this.apCategoryForm.value.isasset],
      // "code":this.apCategoryForm.value.code,
      'isodit':this.apCategoryForm.value.isodit,
      'expense_id':this.apCategoryForm.value.expense_id.id
  }
    console.log(data);
    this.spinner.show();
    this.atmaService.apcategoryCreateForm(data)
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
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
        return true;
        },
        (error)=>{
          this.spinner.hide();
          this.notification.showWarning(error.status+error.statusText);
        }
        )
  }
omit_special_num(event)
  {   
    var k;  
    k = event.charCode;  
    return((k == 188) ||(k == 46) || (k >= 48 && k <= 57)); 
  } 
onCancelClick() {
  this.onCancel.emit()
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
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
}