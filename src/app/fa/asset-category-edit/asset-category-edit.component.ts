import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faservice } from '../fa.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { faShareService } from '../share.service';

import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';


export interface apcatlistss {
  id: string;
  name: string;
}

export interface subcatlistss {
  id: string;
  name: string;
}

@Component({
  selector: 'app-asset-category-edit',
  templateUrl: './asset-category-edit.component.html',
  styleUrls: ['./asset-category-edit.component.scss']
})
export class AssetCategoryEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  assetcateditform: FormGroup
  apcategoryList: Array<apcatlistss>;
  subcategoryList: Array<subcatlistss>;

  apcategory = new FormControl();
  subcatname = new FormControl();
  apcatnodep_mgmt = new FormControl();
  apscatnodep_mgmt = new FormControl();
  apcatnodepres_mgmt = new FormControl();
  apscatnodepres_mgmt = new FormControl();
  Subcatid: number = 0;
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  barcodelist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]
  deptypelist = [{ 'id': '1', 'show': 'WDV', 'name': 'WDV' }, { 'id': '2', 'show': 'SLM', 'name': 'SLM' }]



  constructor(private fb: FormBuilder, private router: Router,
    private notification: NotificationService, private toastr: ToastrService,
    private Faservice: faservice, private shareservice: faShareService) { }

  ngOnInit(): void {
    this.assetcateditform = this.fb.group({
      // apcategory: ['', Validators.required],
      // subcategory_id: ['', Validators.required],

      // subcatname: ['', Validators.required],
      // lifetime: ['', Validators.required],
      // deptype: ['', Validators.required],
      // deprate_itc: ['', Validators.required],
      // deprate_ca: ['', Validators.required],
      // deprate_mgmt: ['', Validators.required],
      // barcoderequired: ['', Validators.required],
      // apcatnodep_mgmt: ['', Validators.required],
      // apscatnodep_mgmt: ['', Validators.required],
      depgl_mgmt: ['', Validators.required],
      // apcatnodepres_mgmt: ['', Validators.required],
      // apscatnodepres_mgmt: ['', Validators.required],
      depresgl_mgmt: ['', Validators.required],

      // remarks: ['', Validators.required],
    })
    this.getLandLordBankEdit();


    //     let apcatkeyvalue : String="";
    //     this.getapcat(apcatkeyvalue);


    //     this.assetcateditform.get('apcategory').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.Faservice.getapcat(value)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.apcategoryList = datas;
    //       console.log("apcategory", datas)

    //     })


    //   }



    //   public displayapcat(autoapcat?: apcatlistss): string | undefined {
    //     return autoapcat ? autoapcat.name : undefined;
    //   }

    //   get autocit() {
    //     return this.assetcateditform.get('apcategory');
    //   }

    //     private getapcat(apcatkeyvalue) {
    //       this.Faservice.getapcat(apcatkeyvalue)
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.apcategoryList = datas;

    //     })



    //   let subcatkeyvalue : String="";
    //   this.getsubcat(this.Subcatid,subcatkeyvalue);


    //   this.assetcateditform.get('subcatname').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.Faservice.getsubcat(this.Subcatid,value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;
    //     console.log("subcategory", datas)

    //   })




    // }



    // public displaysubcat(autosubcat?: subcatlistss): string | undefined {
    //   return autosubcat ? autosubcat.name : undefined;
    // }

    // get autosubcat() {
    //   return this.assetcateditform.get('subcatname');
    // }

    //   private getsubcat(id,subcatkeyvalue) {
    //     this.Faservice.getsubcat(id,subcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;

    //   })


    //   let apcatkeyvalue : String="";
    //   this.getapscat(apcatkeyvalue);


    //   this.assetcateditform.get('apcatnodep_mgmt').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.Faservice.getapcat(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.apcategoryList = datas;
    //     console.log("apcategory", datas)

    //   })


    // }



    // public displayapscat(autoapcat?: apcatlistss): string | undefined {
    //   return autoapcat ? autoapcat.name : undefined;
    // }

    // get autocits() {
    //   return this.assetcateditform.get('apcatnodep_mgmt');
    // }

    //   private getapscat(apcatkeyvalue) {
    //     this.Faservice.getapcat(apcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.apcategoryList = datas;

    //   })



    //   let subcatkeyvalue : String="";
    //   this.getsubscat(this.Subcatid,subcatkeyvalue);


    //   this.assetcateditform.get('apscatnodep_mgmt').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.Faservice.getsubcat(this.Subcatid,value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;
    //     console.log("subcategory", datas)

    //   })




    // }



    // public displaysubscat(autosubcat?: subcatlistss): string | undefined {
    //   return autosubcat ? autosubcat.name : undefined;
    // }

    // get autosubcats() {
    //   return this.assetcateditform.get('apscatnodep_mgmt');
    // }

    //   private getsubscat(id,subcatkeyvalue) {
    //     this.Faservice.getsubcat(id,subcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;

    //   })


    //   let apcatkeyvalue : String="";
    //   this.getapsscat(apcatkeyvalue);


    //   this.assetcateditform.get('apcatnodepres_mgmt').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.Faservice.getapcat(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.apcategoryList = datas;
    //     console.log("apcategory", datas)

    //   })


    // }



    // public displayapsscat(autoapcat?: apcatlistss): string | undefined {
    //   return autoapcat ? autoapcat.name : undefined;
    // }

    // get autocitss() {
    //   return this.assetcateditform.get('apcatnodepres_mgmt');
    // }

    //   private getapsscat(apcatkeyvalue) {
    //     this.Faservice.getapcat(apcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.apcategoryList = datas;

    //   })



    //   let subcatkeyvalue : String="";
    //   this.getsubsscat(this.Subcatid,subcatkeyvalue);


    //   this.assetcateditform.get('apscatnodepres_mgmt').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.Faservice.getsubcat(this.Subcatid,value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;
    //     console.log("subcategory", datas)

    //   })




    // }



    // public displaysubsscat(autosubcat?: subcatlistss): string | undefined {
    //   return autosubcat ? autosubcat.name : undefined;
    // }

    // get autosubcatss() {
    //   return this.assetcateditform.get('apscatnodepres_mgmt');
    // }

    //   private getsubsscat(id,subcatkeyvalue) {
    //     this.Faservice.getsubcat(id,subcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;

    //   })

  }

  getLandLordBankEdit() {
    let data: any = this.shareservice.assetcategoryedit.value;
    console.log("EDit.............", data)
    let apcategory = data.apcategory
    //     let Subcategory_id = data.subcategory_id
    //     let Subcatname = data.subcatname.id
    //     let Lifetime = data.lifetime
    //     let Deptype = data.deptype
    //     let Deprate_itc = data.deprate_itc
    //     let Deprate_ca = data.deprate_ca
    //     let Deprate_mgmt= data.deprate_mgmt
    // let Barcoderequired = data.barcoderequired
    // let Apcatnodep_mgmt = data.apcatnodep_mgmt
    //  let Apscatnodep_mgmt = data.apscatnodep_mgmt
    //   let Apcatnodepres_mgmt = data.apcatnodepres_mgmt
    // let Apscatnodepres_mgmt = data.apscatnodepres_mgmt
    let Depgl_mgmt = data.depgl_mgmt
    let Depresgl_mgmt = data.depresgl_mgmt
    // let Remarks = data.remarks
    this.assetcateditform.patchValue({
      // apcategory:apcategory,
      // subcategory_id:Subcategory_id,
      // subcatname:Subcatname,
      // lifetime:Lifetime,
      // deptype:Deptype,
      // deprate_itc:Deprate_itc,
      // deprate_ca:Deprate_ca,
      // deprate_mgmt:Deprate_mgmt,   
      // barcoderequired:Barcoderequired,
      // apcatnodep_mgmt:Apcatnodep_mgmt,
      // apscatnodep_mgmt:Apscatnodep_mgmt,
      // apcatnodepres_mgmt:Apcatnodepres_mgmt,
      // apscatnodepres_mgmt:Apscatnodepres_mgmt,
      depgl_mgmt: Depgl_mgmt,
      depresgl_mgmt: Depresgl_mgmt,
      // remarks:Remarks





    })


  }
  assetcateditForm() {

    let idValue: any = this.shareservice.assetcategoryedit.value
    let data = this.assetcateditform.value
    this.Faservice.getsubcat(data, idValue.id)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }

        return true
      })
  }




  onCancelClick() {
    this.router.navigate(['/fa/famastersummary'], { skipLocationChange: true })

  }

}
