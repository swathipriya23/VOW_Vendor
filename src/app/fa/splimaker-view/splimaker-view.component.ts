import { Component, OnInit, Inject, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { faservice } from '../fa.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Fa2Service } from '../fa2.service';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, first } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { faShareService } from '../share.service';
import { ToastrService } from 'ngx-toastr';
import { isThisTypeNode } from 'typescript';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}


@Component({
  selector: 'app-splimaker-view',
  templateUrl: './splimaker-view.component.html',
  styleUrls: ['./splimaker-view.component.scss']
})
export class SplimakerViewComponent implements OnInit {
  assetcatlist: Array<any>
  isassetmaker: boolean
  isassetbuk: boolean
  isinvoice: boolean
  isassetwbuk: boolean
  a: number
  ischecks: boolean = true;

  view: String = "sa"
  ismakerCheckerButton: boolean;
  has_nextwbuk = true;
  has_previouswbuk = true;
  presentpagewbuk: number = 1;
  count: number = 0;

  has_nextbuk = true;
  has_previousbuk = true;
  presentpagebuk: number = 1;
  pageSize = 10;

  values: number[] = [];
  isin: boolean = false;

  countlist:Array<any>=[{'no':1},{'no':2},{'no':3},{'no':4},{'no':5},{'no':6},{'no':7},{'no':8},{'no':9},{'no':10},{'no':11},{'no':12}];
  Assettotal: number = 0;
  AssetID: number = 0;
  AssetBranch: number = 0;
  myForm:any= FormGroup;
  barcode:any;
  sum1:any=0;
  date:any=new Date();
  split_details_negative_data:any;
  constructor(private errorHandler:ErrorHandlerService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, private fb: FormBuilder,
    private toastr: ToastrService, private shareservice: faShareService, private datePipe: DatePipe, public Faservice2: Fa2Service,) { }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  DynamicId: any
  ngOnInit(): void {
    let data: any = this.shareservice.splitData.value;
    this.barcode=data['barcode'];
    console.log("share data", data)

    this.Assettotal = data.assetdetails_value
    this.AssetID = data.assetdetails_id
    this.AssetBranch = data.branch_id.name
    this.DynamicId = data.id

    this.myForm = this.fb.group(
      {
        split_detail: this.fb.array([
          this.split_detailValues(),
          // this.split_detailValues()
        ]),
        reason: "",
        assetdetailsid: this.AssetID,
        date: new Date(),
        assetdetails_value: this.Assettotal,
        count:new FormControl()
      },
    );
    for(let i=0;i<(this.myForm.get('split_detail') as FormArray).length;i++){
      (this.myForm.get('split_detail') as FormArray).removeAt(i);
    };
    // console.log(this.myForm.controls);
    // this.getSplitBarcodeId();
  }
  counteddata(){
    console.log(this.myForm.value);
    console.log((this.myForm.get('split_detail') as FormArray).length);
    for(let i=0;i<(this.myForm.get('split_detail') as FormArray).length;i++){
      (this.myForm.get('split_detail') as FormArray).removeAt(i);
    };
    for(let i=0;i<(this.myForm.get('split_detail') as FormArray).length;i++){
      (this.myForm.get('split_detail') as FormArray).removeAt(i);
    };
    console.log((this.myForm.get('split_detail') as FormArray).length);
    console.log(this.myForm.value);
    this.getSplitBarcodeId();
  }

  get formsArray() {
    return this.myForm.get("split_detail") as FormArray;
  }


  IDlists: any
  getSplitBarcodeId() {
    for(let i=0;i<(this.myForm.get('split_detail') as FormArray).length;i++){
      (this.myForm.get('split_detail') as FormArray).removeAt(i);
    };
    let IDData: any = this.DynamicId//this.myForm.get('count').value;
    this.Faservice2.getSplitBarcodeId(IDData,Number(this.myForm.get('count').value)-1)
      .subscribe(results => {
        this.split_details_negative_data=results['assetdetails_id_negative'];
        let data = results["id"] ;
        this.IDlists = data;
        if(results){
          // for( let i in data  ){
          //   console.log("data check", data[i]);

          //   this.myForm.get('split_detail')['controls'][i].get('newassetdetailid').setValue(data[i])
          //   // this.myForm.get("split_detail")["controls"][i].get("newassetdetailid").setValue(results[i])
          // } 
         
          for(let i=0;i<results["id"].length;i++){
            (this.myForm.get('split_detail') as FormArray).push(this.fb.group({
              newassetdetailid:new FormControl(),
              value:new FormControl()
            }));
            ((this.myForm.get('split_detail') as FormArray).at(i) as FormGroup).patchValue({'newassetdetailid':results["id"][i],'value':0});
            
          }
          for(let i=0;i<results["id"].length;i++){
            // (this.myForm.get('split_detail') as FormArray).push(this.fb.group({
            //   newassetdetailid:new FormControl(),
            //   value:new FormControl()
            // }));
            ((this.myForm.get('split_detail') as FormArray).at(i) as FormGroup).patchValue({'newassetdetailid':results["id"][i],'value':0});
            
          }
         
          
          
        }
      })
  }

  @Output() linesChange = new EventEmitter<any>();

  split_detailValues() {
    let group = new FormGroup({
      newassetdetailid: new FormControl(''),
      value:new FormControl(0)
      // assetsplitdetail_value: new FormControl(''),
      // disabled: new FormControl(false)
    })
    // group.get('assetsplitdetail_value').valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    // ).subscribe(value => {


      // let a = group.indexOf()






      // this.myForm.get('split_detail')['controls'][1].get('assetsplitdetail_value').setValue((this.Assettotal) - (this.myForm.get('split_detail')['controls'][0].get('assetsplitdetail_value').value))


      // this.formsArray.controls.forEach((data) => {
      //   this.formsArray.controls.indexOf(control)
      //   this.ValueChangeAssetTotal(data);
      // });
      // this.ValueChangeAssetTotal()
      // let checkValid = this.checkTotal();
      // if (!checkValid) this.showError();

      // if (this.Assettotal <= this.sum) {
      //   this.isin = !this.isin
      // }
      // this.linesChange.emit(this.myForm.value['split_detail']);
    // }
    // )
    return group

  }


  DelBtn(index) {
    const control = <FormArray>this.myForm.get('split_detail');
    control.removeAt(index)
    this.checkTotal()
  }


  add = () => {
    let checkValid = this.checkTotal();
    if (!checkValid) this.showError();
    else {
      const control = <FormArray>this.myForm.get('split_detail');
      control.push(this.split_detailValues());
    }
  };

  sum: number
  showError() {
    this.toastr.error(`Your Values Sum is greater than your total ${this.Assettotal}`, "Total Error",
      {
        timeOut: 3000
      }
    );
  }



  checkTotal() {
    let isValid = true;

    let numbers = this.formsArray.controls.map(x => {
      return Number(x.value.assetsplitdetail_value);
    });
    let sum = numbers.reduce(function (a, b) {
      return a + b;
    }, 0);
    if (this.Assettotal <= sum) {
      this.isin = !this.isin
    }
    this.sum = sum
    if (sum > this.Assettotal) {
      isValid = false;
    } else {
      isValid = true;
      this.isin = false
    }
    return isValid;
  }


  onCancelClick() {
    this.onCancel.emit()
  }

  SubmitAssetSplit() {
    if (this.myForm.value.reason == '' || this.myForm.value.reason == null || this.myForm.value.reason == undefined) {
      this.notification.showWarning("Please fill Reason")
      return false
    }

    if (this.myForm.value.date == '' || this.myForm.value.date == null || this.myForm.value.date == undefined) {
      this.notification.showWarning("Please fill Date")
      return false
    }

    for(let i=0;i< (this.myForm.get('split_detail') as FormArray).length;i++){
      if(((this.myForm.get('split_detail') as FormArray).at(i) as FormGroup).get('value').value==null || ((this.myForm.get('split_detail') as FormArray).at(i) as FormGroup).get('value').value=='' ){
        this.notification.showWarning('Please Fill The Value Of '+((this.myForm.get('split_detail') as FormArray).at(i) as FormGroup).get('newassetdetailid').value);
        return false;
      }
    }
    if(this.Assettotal !=this.sum1){
      this.notification.showWarning('Total Mismatch');
      return false;
    }
    let datadetails = this.myForm.value.split_detail
    // for (let detail in datadetails) {
    //   let datadetailsnewassetdetailid = datadetails[detail].newassetdetailid
    //   let datadetailsassetsplitdetail_value = datadetails[detail].assetsplitdetail_value
    //   let detailIndex = Number(detail)
    //   if ((datadetailsnewassetdetailid == "") || (datadetailsnewassetdetailid == null) || (datadetailsnewassetdetailid == undefined)) {
    //     this.notification.showWarning("Please fill New Asset ID at line " + (detailIndex + 1))
    //     return false
    //   }
    //   if ((datadetailsassetsplitdetail_value == "") || (datadetailsassetsplitdetail_value == null) || (datadetailsassetsplitdetail_value == undefined)) {
    //     this.notification.showWarning("Please fill Asset value at line " + (detailIndex + 1))
    //     return false
    //   }
    // }
    if (this.Assettotal < this.sum || this.Assettotal > this.sum) {
      this.notification.showWarning("Required Split Asset value must be equal to Asset Value")
      return false
    }
    let currentDate = this.myForm.value.date
    currentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.myForm.value.date = currentDate
    let data:any = this.myForm.value;
    data['assetdetails_id_negative']=this.split_details_negative_data;
    data['barcode']=this.barcode;
    console.log(data)
    
    this.Faservice2.SplitSubmit(data)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.onSubmit.emit();
        }
        console.log(" Form SUBMIT", res)
        return true
      },
      (error:HttpErrorResponse)=>{
        this.errorHandler.errorHandler(error,'');
      }
       )
  }


  ValueChangeAssetTotal(data, index) {
    // data.valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    // ).subscribe(value => {
    //   let checkValid = this.checkTotal();
    //   if (!checkValid) this.showError();
    //   if (index == 0) {
    //     this.myForm.get('split_detail')['controls'][index + 1].get('assetsplitdetail_value').setValue((this.Assettotal) - (this.myForm.get('split_detail')['controls'][index].get('assetsplitdetail_value').value))
    //   }
    //   if (index == 1) {
    //     this.myForm.get('split_detail')['controls'][index - 1].get('assetsplitdetail_value').setValue((this.Assettotal) - (this.myForm.get('split_detail')['controls'][index].get('assetsplitdetail_value').value))
    //   }

    // })
    this.sum1=0;
    for(let i=0;i<(this.myForm.get('split_detail') as FormArray).length;i++){
      this.sum1=this.sum1 + Number(((this.myForm.get('split_detail') as FormArray).at(i) as FormGroup).get('value').value);
    }
    console.log(this.sum1);
    if(this.Assettotal<this.sum1){
      ((this.myForm.get('split_detail') as FormArray).at(index) as FormGroup).get('value').reset('');
      this.notification.showWarning('Amount MisMatched:');
    }
  }




}





