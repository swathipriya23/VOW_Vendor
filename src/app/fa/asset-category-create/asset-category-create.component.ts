import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faservice } from '../fa.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router'
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
;



export interface apcatlistss {
  id: string;
  name: string;
}

export interface subcatlistss {
  id: string;
  name: string;
}

@Component({
  selector: 'app-asset-category-create',
  templateUrl: './asset-category-create.component.html',
  styleUrls: ['./asset-category-create.component.scss']
})
export class AssetCategoryCreateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  assetcatform: FormGroup
  apcategoryList: Array<apcatlistss>;
  subcategoryList: Array<subcatlistss>;
  subcatidList: any
  Subcatid: number = 0;
  isLoading = false;
  depgl_mgmt_id:number=0;
  depresgl_mgmt_id:number=0;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  barcodelist = [{ 'id': '1', 'show': 'Yes', 'name': 'True' }, { 'id': '2', 'show': 'No', 'name': 'False' }]
  deptypelist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]
  constructor(private spinner:NgxSpinnerService,private errorhandler:ErrorHandlerService,private fb: FormBuilder, private router: Router,
    private notification: NotificationService, private toastr: ToastrService, private Faservice: faservice) { }
  ngOnInit(): void {
    this.assetcatform = this.fb.group({
      apcategory: ['', Validators.required],
      subcategory_id: ['', Validators.required],
      subcatname: ['', Validators.required],
      lifetime: ['', Validators.required],
      deptype: ['', Validators.required],
      deprate_itc: ['', Validators.required],
      deprate_ca: ['', Validators.required],
      deprate_mgmt: ['', Validators.required],
      barcoderequired: ['', Validators.required],
      apcatnodep_mgmt: ['', Validators.required],
      apscatnodep_mgmt: ['', Validators.required],
      depgl_mgmt: ['', Validators.required],
      apcatnodepres_mgmt: ['', Validators.required],
      apscatnodepres_mgmt: ['', Validators.required],
      depresgl_mgmt: ['', Validators.required],
      remarks: ['', Validators.required],
      itcatname:['',Validators.required],
      mgmtsubcat:[''],
      rstsubcat:['']

    });

    let apcatkeyvalue: String = "";
    this.getapcat(apcatkeyvalue);
    this.getsubcatid();


    this.assetcatform.get('apcategory').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getapcat(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;
        console.log("apcategory", datas)

      })


  }

  private getsubcatid() {
    this.Faservice.getsubcatid()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcatidList = datas;
        console.log("usage", datas)
      })

  }



  public displayapcat(autoapcat?: apcatlistss): string | undefined {
    return autoapcat ? autoapcat.name : undefined;
  }

  get autocit() {
    return this.assetcatform.get('apcategory');
  }

  private getapcat(apcatkeyvalue) {
    this.Faservice.getapcat(apcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;

      })



    let subcatkeyvalue: String = "";
    this.getsubcat(this.Subcatid, subcatkeyvalue);


    this.assetcatform.get('subcatname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getsubcat(this.Subcatid, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryList = datas;
        console.log("subcategory", datas)

      })




  }



  public displaysubcat(autosubcat?: subcatlistss): string | undefined {
    return autosubcat ? autosubcat.name : undefined;
  }

  get autosubcat() {
    return this.assetcatform.get('subcatname');
  }

  private getsubcat(id, subcatkeyvalue) {
    this.Faservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryList = datas;

      })


    let apcatkeyvalue: String = "";
    this.getapscat(apcatkeyvalue);


    this.assetcatform.get('apcatnodep_mgmt').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getapcat(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;
        console.log("apcategory", datas)

      })


  }



  public displayapscat(autoapcat?: apcatlistss): string | undefined {
    return autoapcat ? autoapcat.name : undefined;
  }

  get autocits() {
    return this.assetcatform.get('apcatnodep_mgmt');
  }

  private getapscat(apcatkeyvalue) {
    this.Faservice.getapcat(apcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;

      })



    let subcatkeyvalue: String = "";
    this.getsubscat(this.Subcatid, subcatkeyvalue);


    this.assetcatform.get('apscatnodep_mgmt').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getsubcat(this.Subcatid, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryList = datas;
        console.log("subcategory", datas)

      })




  }



  public displaysubscat(autosubcat?: subcatlistss): string | undefined {
    return autosubcat ? autosubcat.name : undefined;
  }

  get autosubcats() {
    return this.assetcatform.get('apscatnodep_mgmt');
  }

  private getsubscat(id, subcatkeyvalue) {
    this.Faservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryList = datas;

      })


    let apcatkeyvalue: String = "";
    this.getapsscat(apcatkeyvalue);


    this.assetcatform.get('apcatnodepres_mgmt').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getapcat(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;
        console.log("apcategory", datas)

      })


  }



  public displayapsscat(autoapcat?: apcatlistss): string | undefined {
    return autoapcat ? autoapcat.name : undefined;
  }

  get autocitss() {
    return this.assetcatform.get('apcatnodepres_mgmt');
  }

  private getapsscat(apcatkeyvalue) {
    this.Faservice.getapcat(apcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;

      })



    let subcatkeyvalue: String = "";
    this.getsubsscat(this.Subcatid, subcatkeyvalue);


    this.assetcatform.get('apscatnodepres_mgmt').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getsubcat(this.Subcatid, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryList = datas;
        console.log("subcategory", datas)

      })




  }



  public displaysubsscat(autosubcat?: subcatlistss): string | undefined {
    return autosubcat ? autosubcat.name : undefined;
  }

  get autosubcatss() {
    return this.assetcatform.get('apscatnodepres_mgmt');
  }

  private getsubsscat(id, subcatkeyvalue) {
    this.Faservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryList = datas;

      })




  }



  landlordbankbranchnames(data) {

    this.Subcatid = data.id;
    this.getsubcat(data.id, '')
    console.log('check', this.getsubcat(data.id, ''))
  }




  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


 

  depgl_mgmt(data){
    

    this.assetcatform.get('depgl_mgmt').setValue('');
    this.assetcatform.get('depgl_mgmt').setValue(data.glno);
    this.depgl_mgmt_id=data.id
  }
  depresgl_mgmt(data) {

  this.assetcatform.get('depresgl_mgmt').setValue('');
  this.assetcatform.get('depresgl_mgmt').setValue(data.glno);
  this.depresgl_mgmt_id=data.id

}
  assetcatCreateForm() {

    if(this.assetcatform.value.subcatname==undefined||this.assetcatform.value.subcatname==''){
      this.notification.showError("Choose a Valid subcategory")
      return false
    }
    if(this.assetcatform.value.apcategory==undefined||this.assetcatform.value.apcategory==''){
      this.notification.showError("Choose a Valid Apcategory")
      return false
    }
    if(this.assetcatform.value.apcatnodep_mgmt==undefined||this.assetcatform.value.apcatnodep_mgmt==''){
      this.notification.showError("Choose a Valid Apcategory")
      return false
    }
    if(this.assetcatform.value.apscatnodep_mgmt==undefined||this.assetcatform.value.apscatnodep_mgmt==''){
      this.notification.showError("Choose a Valid subcategory")
      return false
    }
    if(this.assetcatform.value.apcatnodepres_mgmt==undefined||this.assetcatform.value.apcatnodepres_mgmt==''){
      this.notification.showError("Choose a Valid Apcategory")
      return false
    }
    if(this.assetcatform.value.apscatnodepres_mgmt==undefined||this.assetcatform.value.apscatnodepres_mgmt==''){
      this.notification.showError("Choose a Valid subcategory")
      return false
    }

    let data = this.assetcatform.value.subcatname

    this.assetcatform.value.subcatname= data.name
    this.assetcatform.value.subcategory_id= data.id
    this.assetcatform.value.apcatnodep_mgmt= this.assetcatform.value.apcatnodep_mgmt.id
    this.assetcatform.value.apscatnodep_mgmt= this.assetcatform.value.apscatnodep_mgmt.id
    this.assetcatform.value.apcatnodepres_mgmt= this.assetcatform.value.apcatnodepres_mgmt.id
    this.assetcatform.value.apscatnodepres_mgmt= this.assetcatform.value.apscatnodepres_mgmt.id
   this.assetcatform.value.mgmtsubcat=this.assetcatform.value.apscatnodep_mgmt
   this.assetcatform.value.rstsubcat=this.assetcatform.value.apscatnodepres_mgmt
    this.assetcatform.value.depgl_mgmt= this.depgl_mgmt_id;
    this.assetcatform.value.depresgl_mgmt=this.depresgl_mgmt_id;
    this.spinner.show();
    this.Faservice.assetcatCreateForm(this.assetcatform.value)
      .subscribe(res => {
        this.spinner.hide();
        if(res['code'] !=undefined && res['code'] !=""){
          this.notification.showWarning(res['code']);
          this.notification.showWarning(res['description']);
        }
        else{
          if(res){
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
          this.router.navigate(['/fa/famaster'], { skipLocationChange: true })
          return true}
          else{
            this.notification.showError("Failed")
          }
      }

      },
      (error:HttpErrorResponse)=>{
        this.errorhandler.errorHandler(error,'');
        this.spinner.hide();
      }
      )
  }

  onCancelClick() {
    this.router.navigate(['/fa/famaster'], { skipLocationChange: true })

  }



  
}



