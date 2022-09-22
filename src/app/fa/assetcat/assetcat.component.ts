import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
export interface subcatListss {
  name: string;
  id: number;
}
@Component({
  selector: 'app-assetcat',
  templateUrl: './assetcat.component.html',
  styleUrls: ['./assetcat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetcatComponent implements OnInit {
  // @ViewChild('opendialog') opendialog:TemplateRef<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  assetcatlist: Array<any>
  list: string[] = [];

  assetloclist: Array<any>
  subcatList: Array<subcatListss>;
  a: Array<any>
  submitdata:any;
  subcategorys = new FormControl();
  SubcatSearchForm: FormGroup;
  updateForm:FormGroup;
  // depype="";
  locationdata=false
  // aa:boolean=false;
  has_next = true;
  has_previous = true;
  isassetcategory: boolean
  isassetcategoryEditForm: boolean
  isassetcategorys: boolean
  isDepsetting: boolean
  ismakerCheckerButton: boolean;
  has_nextasset = true;
  has_previousasset = true;
  // currentpage: number = 1;
  presentpageasset: number = 1;
  pageSize = 10;
  depform: FormGroup
  assetlocationform: FormGroup
  deptypelist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]
  deptypeslist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  branchdata: any;
  myControl = new FormControl();
  data2: any;

  constructor(private spinner:NgxSpinnerService,private errorhandler:ErrorHandlerService,private matdialog:MatDialog,private fb: FormBuilder, private notification: NotificationService, private router: Router
    , private Faservice: faservice, private FaShareService: faShareService,
    private toastr: ToastrService) { }

    ngOnInit(): void {
      this.depform = this.fb.group({
        doctype: ['', Validators.required],
        depgl: ['', Validators.required],
  
        depreservegl: ['', Validators.required],
  
      })
      this.SubcatSearchForm = this.fb.group({
  
        subcategorys: "",
        deptype: ""
      })
  
  
      this.updateForm=this.fb.group({
        depgl_mgmt: ['', Validators.required],
        'itcatname':[''],
        depresgl_mgmt: ['', Validators.required],
  
      })
  
     
      
      this.getassetcategorysummary();
      // this.getassetlocationsummary();
      let ssubcatkeyvalue: String = "";
      this.getapsubcatsearch(ssubcatkeyvalue);
      this.SubcatSearchForm.get('subcategorys').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
  
          switchMap(value => this.Faservice.getapsubcatsearch(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.subcatList = datas;
          console.log("subcatList", datas)
  
        })
  
    }
  
    public displayFn(subcattype?: subcatListss): string | undefined {
          return subcattype ? subcattype.name : undefined;
    }
  
    get subcattype() {
      return this.SubcatSearchForm.get('subcategorys');
    }
  
  
    private getapsubcatsearch(ssubcatkeyvalue) {
      this.Faservice.getapsubcatsearch(ssubcatkeyvalue)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.subcatList = datas;
          console.log("subcatList subcatList subcatList", datas)
          return true
        })
    }
  
  
    nextClick() {

      if (this.has_nextasset === true) {
  
        this.getassetcategorysummary(this.presentpageasset + 1, 10)
  
      }
    }
  
    previousClick() {
  
      if (this.has_previousasset === true) {
  
        this.getassetcategorysummary(this.presentpageasset - 1, 10)
  
      }
    }

  createFormate() {
    let data = this.SubcatSearchForm.controls;
    let subSearchclass = new subclassSearchtype();
    subSearchclass.subcategorys = data['subcategorys'].value.id;
    subSearchclass.deptype = data['deptype'].value
    return subSearchclass;
  }

  j: any
  k: any
  summarycreateForm() {
    let search = this.createFormate();
    console.log('search=',search);
    for (let i in search) {
      if (!search[i]) {
        delete search[i];
      }
    }


    let b = this.SubcatSearchForm.get('deptype').value
    this.j = this.SubcatSearchForm.get('subcategorys').value.name




    this.Faservice.getsummarySearch(this.j, b)
      .subscribe(result => {
        console.log(" search result", result)
        this.assetcatlist = result['data']
        if (search.deptype === '') {
          this.getassetcategorysummary();
        }
      })
  }
  reset() {
    this.getassetcategorysummary();
  }
  getassetcategorysummary(pageNumber = 1, pageSize = 10) {
    this.Faservice.getassetcategorysummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("landlord-1", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        console.log("landlord", this.assetcatlist)
        if (this.assetcatlist.length >= 0) {
          this.has_nextasset = datapagination.has_next;
          this.has_previousasset = datapagination.has_previous;
          this.presentpageasset = datapagination.index;
        }

      })

  }

  depCreateForm() {
    if (this.depform.value.doctype === "") {
      this.toastr.error('Add Depreciation type Field', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    // if (this.depform.value.depgl === "") {
    //   this.toastr.error('Add GL Number  Field', 'Empty value inserted', { timeOut: 1500 });
    //   return false;
    // }
    // if (this.depform.value.depreservegl === "") {
    //   this.toastr.error('Add Gl Ref No Field', 'Empty value inserted', { timeOut: 1500 });
    //   return false;
    // }



    let data = this.depform.value;
    this.spinner.show();
    this.Faservice.depCreateForm(data)
      .subscribe(res => {
        this.spinner.hide();
        if(res)
{
        this.notification.showSuccess("Saved Successfully!...")
        this.onSubmit.emit();
        this.router.navigate(['/fa/famaster'], { skipLocationChange: true })

}else{
  this.toastr.error('failed','', { timeOut: 1500 });
  return false
}

       
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorhandler.errorHandler(error,'');
      }
      )


  }


  mobile_popu(asst){
    this.updateForm.get('depgl_mgmt').setValue(asst.depgl_mgmt);
    this.updateForm.get('depresgl_mgmt').setValue(asst.depresgl_mgmt);      
    this.updateForm.get('itcatname').setValue(asst.itcatname);      
  }
  opendialognew(opendialog,data:any){
    this.submitdata=data.id;
    this.updateForm.get('depgl_mgmt').setValue(data.depgl_mgmt);
    this.updateForm.get('depresgl_mgmt').setValue(data.depresgl_mgmt);      
    this.updateForm.get('itcatname').setValue(data.itcatname);     
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.position = {
        top:  '0'  ,
        // right: '0'
      };
      dialogConfig.width = '60%' ;
      dialogConfig.height = '300px' ;
      this.matdialog.open(opendialog,{width :'60%',height :'300px',position:{top:'0'}  });
  }
  closedialgogdata(){
    this.matdialog.closeAll();
  }
  savedata(){
    if(this.updateForm.get('depgl_mgmt').value ==undefined || this.updateForm.get('depgl_mgmt').value=='' || this.updateForm.get('depgl_mgmt').value==null){
      this.notification.showError('Please Select The depgl_mgmt Type');
      return false;
    }
    if(this.updateForm.get('depresgl_mgmt').value ==undefined || this.updateForm.get('depresgl_mgmt').value=='' || this.updateForm.get('depresgl_mgmt').value==null){
      this.notification.showError('Please Select The Depreciation Type');
      return false;
    }
    if(this.updateForm.get('itcatname').value ==undefined || this.updateForm.get('itcatname').value=='' || this.updateForm.get('itcatname').value==null){
      this.notification.showError('Please Enter The Itcatname');
      return false;
    }
    let d:any={
      'id':this.submitdata,
      "deptype":this.updateForm.get('depgl_mgmt').value,
      "depgl_mgmt":this.updateForm.get('depresgl_mgmt').value,
      "itcatname":this.updateForm.get('itcatname').value
     };
     this.spinner.show();
     this.Faservice.assetcatCreateForm(d)
      .subscribe(res => {
        this.spinner.hide();
        if(res){
        this.notification.showSuccess("Saved Successfully!...");
        this.getassetcategorysummary();
        // this.onSubmit.emit();
        // this.router.navigate(['/fa/famaster'], { skipLocationChange: true })
        return true;
      }
        else{
          this.notification.showError("Failed")
        }

      },
      (error)=>{
        this.spinner.hide();
        this.errorhandler.errorHandler(error,'');
      }
      )
  }
}
class subclassSearchtype {
  subcategorys: string;
  deptype: any;
  id: number;
}