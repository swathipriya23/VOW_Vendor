import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Fa2Service } from '../fa2.service';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, first } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
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
export interface cgunamelistss {
  id: any;
  code: string;
  name: string;
}
@Component({
  selector: 'app-impairment-add',
  templateUrl: './impairment-add.component.html',
  styleUrls: ['./impairment-add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ImpairmentAddComponent implements OnInit {
  impairmentSearchForm: FormGroup;
  impairmentAdd: FormGroup
  impairmentlist: Array<any>
  has_next = true;
  has_previous = true;
  isimpmakeradd: boolean;
  ismakerCheckerButton: boolean;
  // ischeck:boolean=false;
  pageSize = 10;
  has_nextimp = true;
  has_previousimp = true;
  presentpageimp: number = 1;
  checkedValues: boolean[]



  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild('cguname') matcguAutocomplete: MatAutocomplete;
  @ViewChild('cgunameInput') cgunameInput: any;
  isLoading = false;
  currentpage: number = 1;
  cgunameList: Array<cgunamelistss>;

  constructor(private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,
    private fb: FormBuilder, public Faservice2: Fa2Service, public activatedRoute: ActivatedRoute, private spinner:NgxSpinnerService) { }


  ngOnInit(): void {
    this.impairmentSearchForm = this.fb.group({
      cgu_name: ''
    })

    this.impairmentAdd = this.fb.group({
      reason: '',
      date: new Date(),
      reversed_value: '',
      oldtotal_value:'',
      cgu_id: '',
      barcode: ''
    })

    this.impairmentSearchForm.get('cgu_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice2.getcgunamedata(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cgunameList = datas;
      })

      this.serviceCallImparmentSummary({},1,10);

  }

  ////// reset  
  resetImpairment() {
    this.impairmentSearchForm.reset('');
    this.getassetImpairmentsummary('reset');
    return false
  }

  ////// summary
  serviceCallImparmentSummary(searchimpairment, pageno, pageSize) {
    this.spinner.show();
    this.Faservice2.getassetImpairAddSummarySearch(searchimpairment, pageno)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("asset impairment", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.impairmentlist = datass;
        console.log("asset impairment", this.impairmentlist)
        if (this.impairmentlist.length >= 0) {
          this.has_nextimp = datapagination.has_next;
          this.has_previousimp = datapagination.has_previous;
          this.presentpageimp = datapagination.index;
        }
        this.GettingBarcodeData()
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }
CGUidValue: any
  getassetImpairmentsummary(hint) {
    let searchimpairment = this.impairmentSearchForm.value
    if (this.impairmentSearchForm.value.cgu_name.name == undefined) {
      this.impairmentSearchForm.value.cgu_name = this.impairmentSearchForm.value.cgu_name
    }
    else {
      this.impairmentSearchForm.value.cgu_name = this.impairmentSearchForm.value.cgu_name.name
    }
    // searchimpairment.cgu_name = this.impairmentSearchForm.value.cgu_name.name
    // this.CGUidValue = this.impairmentSearchForm.value.cgu_name.id
    for (let i in searchimpairment) {
      if (searchimpairment[i] == null || searchimpairment[i] == "" || searchimpairment[i] == undefined) {
        delete searchimpairment[i];
      }
    }
    if (hint == 'next') {
      this.serviceCallImparmentSummary(searchimpairment, this.presentpageimp + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallImparmentSummary(searchimpairment, this.presentpageimp - 1, 10)
    }
    else {
      this.serviceCallImparmentSummary(searchimpairment, 1, 10)
    }

  }

  BarCodeDataArray = []
  TotalCGUAssetValue: any
  GettingBarcodeData() {
    let data = this.impairmentlist
    let barcodeData = data.map(x => x.barcode)
    this.BarCodeDataArray = barcodeData

    let CGUidValueData = data.map(x => x.cgu_id)
    this.CGUidValue = CGUidValueData

    let total = data.map(y => Number(y.assetdetails_value))
    let totalCalculation = total.reduce((a, b) => a + b, 0);
    this.TotalCGUAssetValue = totalCalculation


  }



  resetDataImpairment() {
    this.impairmentAdd.reset('')
    // this.impairmentAdd.patchValue({
    //   data: new Date()
    // })
  }

  dataIdImpair(data){
    // this.CGUidValue = data.id
  }


  ImpairmentAddSubmit() {
    let SubmitData = this.impairmentAdd.value

    if (SubmitData.reversed_value == '' || SubmitData.reversed_value == null || SubmitData.reversed_value == undefined) {
      this.notification.showWarning("Please Fill Revised value")
      return false
    }
    if (SubmitData.reason == '' || SubmitData.reason == null || SubmitData.reason == undefined) {
      this.notification.showWarning("Please Fill Reason")
      return false
    }
    if (this.impairmentSearchForm.value.cgu_name == '' || this.impairmentSearchForm.value.cgu_name == null || this.impairmentSearchForm.value.cgu_name == undefined) {
      this.notification.showWarning("Please Choose CGU Name")
      return false
    }
    let datedata = SubmitData.date 
      let dates = this.datePipe.transform(datedata, 'yyyy-MM-dd');
      SubmitData.date = dates
    this.impairmentAdd.value.cgu_id = this.CGUidValue
    this.impairmentAdd.value.barcode = this.BarCodeDataArray
    this.impairmentAdd.value.oldtotal_value = this.TotalCGUAssetValue
    console.log("Submit data", SubmitData)
    this.spinner.show();
    this.Faservice2.ImpairCreate(SubmitData)
      .subscribe(res => {
        this.spinner.hide();
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("[INVALID_DATA! ...]")
          this.spinner.hide();
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.spinner.hide();
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.spinner.hide();
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.spinner.hide();
          this.onSubmit.emit();
        }
        console.log(" Form SUBMIT", res)
        return true
      })

  }





  onCancelClick() {
    this.onCancel.emit()
   }














  /////  cgu name

  currentpagecgu: number = 1;
  has_nextcgu = true;
  has_previouscgu = true;
  autocompletecguScroll() {
    setTimeout(() => {
      if (
        this.matcguAutocomplete &&
        this.autocompleteTrigger &&
        this.matcguAutocomplete.panel
      ) {
        fromEvent(this.matcguAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcguAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcguAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcguAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcguAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcgu === true) {
                this.Faservice2.getcgunamedata(this.cgunameInput.nativeElement.value, this.currentpagecgu + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cgunameList = this.cgunameList.concat(datas);
                    if (this.cgunameList.length >= 0) {
                      this.has_nextcgu = datapagination.has_next;
                      this.has_previouscgu = datapagination.has_previous;
                      this.currentpagecgu = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }



  // public displayFncguname(cgu?: any){
    public displayFncguname(cgu?: cgunamelistss): string | undefined {
      return cgu ? cgu.name : undefined;
    // return cgu ? this.cgunameList.find(_ => _.name == cgu).name : undefined;

  }



  getCGUNameFK() {
    let keyvalue = '';
    this.Faservice2.getcgunamedata(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cgunameList = datas;
        console.log("cgunameList", datas)
      })
  }








}

