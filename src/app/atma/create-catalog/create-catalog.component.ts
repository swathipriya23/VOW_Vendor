import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AtmaService } from '../atma.service';
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { isBoolean } from 'util';
import { ShareService } from '../share.service'
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export interface productlistss {
  id: string;
  name: string;
}
export interface UOM {
  id: string;
  name: string;
}
export interface branchlistss{
  id:number,
  name:string
}
export interface ADlist{
  id:number,
  detailname:string,
  code:string;
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-create-catalog',
  templateUrl: './create-catalog.component.html',
  styleUrls: ['./create-catalog.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ]
})
export class CreateCatalogComponent implements OnInit {
  
  isLoading = false;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  catalogAddForm: FormGroup;
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  today = new Date();
  productID: number;
  subcategoryID: number;
  categoryID: number;
  uomlist: Array<UOM>;
  categorylist: Array<any>;
  subcategorylist: Array<any>;
  activityDetailId: number;
  productList: Array<productlistss>;
  product_name = new FormControl();
  catelogButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  select: any;
  catelogName: string;
  subCatelogName: string;
  branchViewId:any;

  @ViewChild('uomm') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('uomInput') uomInput: any;


   // activity dropdown
   @ViewChild('branchContactInput') branchContactInput:any;
   @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;


   
  // activity detail dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput:any;
  @ViewChild('primestype') matAutocompletepremise: MatAutocomplete;


  constructor(private formBuilder: FormBuilder, private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private atmaService: AtmaService, private notification: NotificationService, private datePipe: DatePipe, 
    private toastr: ToastrService,private shareService: ShareService) { }
  ngOnInit(): void {

    this.catalogAddForm = this.formBuilder.group({
      detail_name: [{ value: "", disabled: isBoolean }],
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      name: ['', Validators.pattern('^[a-zA-Z ]*$')],
      specification: [''],
      activity_id: [''],
      activitydetail_id: [''],
      size: [''],
      remarks: [''],
      uom: [''],
      unitprice: [''],
      from_date: [''],
      to_date: [''],
      packing_price: [''],
      delivery_date: [''],
      capacity: [''],
      direct_to: false

    })
    // this.getActivityDetailname();
    this.branchViewId =  this.shareService.pre_branch.value
    // this.getPre_Activity();
    // this.getcatagoryValue();
    // this.getsubcatagoryValue();

    // let prokeyvalue: String = "";
    // this.getProducts(prokeyvalue);
    // this.catalogAddForm.get('product_name').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.getProducts(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.productList = datas;
    //     console.log("product", datas)

    //   })
    // let uomkeyvalue: String = "";
    // this.getuomValue(uomkeyvalue);

    // this.catalogAddForm.get('uom').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.getuom_LoadMore(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.uomlist = datas;

    //   })

  }
productname(){
  let prokeyvalue: String = "";
    this.getProducts(prokeyvalue);
    this.catalogAddForm.get('product_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.atmaService.getProducts(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;
        console.log("product", datas)

      })

}
keyPressAlphaNumeric(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
uomname(){
  let uomkeyvalue: String = "";
  this.getuomValue(uomkeyvalue);

  this.catalogAddForm.get('uom').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),

      switchMap(value => this.atmaService.getuom_LoadMore(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.uomlist = datas;

    })

}



  getActivityDetailname() {
    let data: any = this.shareService.testingvalue.value;
    console.log("ttt", data)
    let det = data.detailname
    this.activityDetailId = data.id
    this.catalogAddForm.patchValue({
      detail_name: det

    })

  }

  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log("Datttee   " + this.currentDate)

    return this.currentDate;
  }
  public displaydis(producttype?: productlistss): string | undefined {
    console.log('id', producttype.id);
    console.log('name', producttype.name);
    return producttype ? producttype.name : undefined;
  }

  get producttype() {
    return this.catalogAddForm.get('product_name');
  }
  public displayFnUOM(uomm?: UOM): string | undefined {
    console.log('id', uomm.id);
    console.log('name', uomm.name);
    return uomm ? uomm.name : undefined;
  }

  get uomm() {
    return this.catalogAddForm.value.get('uom');
  }

  prod(data) {
    this.productID = data
    // this.categoryID = data.category
     // this.subcategoryID = data.subcategory
    let catelog = data["category"];
    let catid = catelog['id'];
    this.catelogName = catelog['name']
    let subcatelog = data["subcategory"];
    let subcatid = subcatelog['id'];
    this.subCatelogName = subcatelog['name']
    this.catalogAddForm.patchValue({
      product_name: this.productID,
      category: this.catelogName,
      subcategory: this.subCatelogName
      // category: this.categoryID,
      // subcategory: this.subcategoryID
    })
  }


  private getProducts(prokeyvalue) {
    this.atmaService.getProducts(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;

      })
  }
  createFormate() {
    let date = this.setDate(this.currentDate);

    let data = this.catalogAddForm.controls;
    let objCatalog = new Catalog();

    objCatalog.detail_name = data['detail_name'].value;
    objCatalog.product_name = data['product_name'].value.id;
    objCatalog.category = data['product_name'].value['category']['id'];
    objCatalog.subcategory = data['product_name'].value['subcategory']['id'];
    // objCatalog.name = data['name'].value;
    // objCatalog.specification = data['specification'].value;
    objCatalog.size = data['size'].value;
    // objCatalog.remarks = data['remarks'].value;
    if(data['uom'].value === ""){
      objCatalog.uom = null
    } else {
      objCatalog.uom = data['uom'].value.id;
    }
    // objCatalog.uom = data['uom'].value.id;
    // objCatalog.unitprice = data['unitprice'].value;
    if (data['unitprice'].value === "") {
      objCatalog.unitprice = null
    } else {
      objCatalog.unitprice = data['unitprice'].value;
    }
    objCatalog.from_date = data['from_date'].value;
    objCatalog.to_date = data['to_date'].value;
    // objCatalog.packing_price = data['packing_price'].value;
    // objCatalog.delivery_date = data['delivery_date'].value;
    if (data['packing_price'].value === "") {
      objCatalog.packing_price = null
    } else {
      objCatalog.packing_price = data['packing_price'].value;
    }
    if (data['delivery_date'].value === "") {
      objCatalog.delivery_date = null
    } else {
      objCatalog.delivery_date = data['delivery_date'].value;
    }
    // objCatalog.capacity = data['capacity'].value;
    objCatalog.direct_to = data['direct_to'].value;
    let dateValue = this.catalogAddForm.value;
    objCatalog.from_date = this.datePipe.transform(dateValue.from_date, 'yyyy-MM-dd');
    objCatalog.to_date = this.datePipe.transform(dateValue.to_date, 'yyyy-MM-dd');

    var str = data['name'].value
    var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
    objCatalog.name = cleanStr_name

    var str = data['specification'].value
    var cleanStr_spe=str.trim();//trim() returns string with outer spaces removed
    objCatalog.specification = cleanStr_spe

    var str = data['remarks'].value
    var cleanStr_rk=str.trim();//trim() returns string with outer spaces removed
    objCatalog.remarks = cleanStr_rk
    
    var str = data['capacity'].value
    var cleanStr_cp=str.trim();//trim() returns string with outer spaces removed
    objCatalog.capacity = cleanStr_cp

    console.log(" objCatalog", objCatalog)
    return objCatalog;
  }

  private getuomValue(uomkeyvalue) {
    this.atmaService.getuom_Search(uomkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomlist = datas;
      })
  }


  // getcatagoryValue() {
  //   this.atmaService.getapcat()
  //     .subscribe(result => {
  //       this.categorylist = result['data']
  //       console.log("category", this.categorylist)
  //     })
  // }
  // getsubcatagoryValue() {
  //   this.atmaService.getapsubcatsummary()
  //     .subscribe(result => {
  //       this.subcategorylist = result['data']
  //       console.log("subcategory", this.subcategorylist)
  //     })
  // }
  UOMScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.getuom_LoadMore(this.uomInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.uomlist = this.uomlist.concat(datas);
                    if (this.uomlist.length >= 0) {
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
  fromDateSelection(event: string) {
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  }
  // Only Numbers with Decimals
  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  submitForm() {
    this.SpinnerService.show();
   

    if (this.catalogAddForm.value.activity_id == "" || this.catalogAddForm.value.activity_id.id == undefined ) {
      this.toastr.error('Invalid  Activity Name');
      this.SpinnerService.hide();
      return false;
    }

    if (this.catalogAddForm.value.activitydetail_id == "" || this.catalogAddForm.value.activitydetail_id.id == undefined)  {
      this.toastr.error('Invalid Activity Detail Name');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.catalogAddForm.value.name === "") {
    //   this.toastr.error('Please Enter Catelog Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
   
    // if (this.catalogAddForm.value.uom === "") {
    //   this.toastr.error('Please Select Any One UOM');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.catalogAddForm.value.unitprice === "") {
    //   this.toastr.error('Please Enter UnitPrice');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.catalogAddForm.value.from_date === "") {
    //   this.toastr.error('Please Choose From date');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.catalogAddForm.value.to_date === "") {
    //   this.toastr.error('Please Choose To Date');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.catalogAddForm.value.packing_price === "") {
    //   this.toastr.error('Please Enter Packing Price');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.catalogAddForm.value.delivery_date === "") {
    //   this.toastr.error('Please Enter Delivery Date');
    //   this.SpinnerService.hide();
    //   return false;
    // }
   
    if (this.catalogAddForm.value.direct_to === "") {
      this.toastr.error('Please Enter Direct To');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.catalogAddForm.value.uom.id === undefined) {
    //   this.toastr.error('Please Select Valid UOM');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.catalogAddForm.value.product_name.id === undefined) {
      this.toastr.error('Please Select Valid Product');
      this.SpinnerService.hide();
      return false;
    }
   
      this.atmaService.createCatalogForm(this.createFormate(), this.activityDetailId)
      
        .subscribe(res => {
         
          if(res.id === undefined){
            this.notification.showError(res.description);
            this.SpinnerService.hide();
            return false;
          }
          else {
            this.notification.showSuccess("saved Successfully....")
            console.log("res", res)
            this.SpinnerService.hide();
            this.shareService.add_submit_preActivityDetailID.next(this.activityDetailId)
            this.onSubmit.emit();
            return true
          }
        },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    
  }
  onCancelClick() {
    this.onCancel.emit()
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


  activityList:any
  getPre_Activity(pageNumber = 1, pageSize = 10) {
    this.atmaService.getActivityList(this.branchViewId, pageNumber, pageSize)
      .subscribe(result => {
        console.log("activity-dropdown", result)
        let datas = result['data'];
        this.activityList = datas;
        // let datapagination = result["pagination"];
        // this.activityList = datas;
        // if (this.activityList.length >= 0) {
        //   this.has_next = datapagination.has_next;
        //   this.has_previous = datapagination.has_previous;
        //   this.presentpage = datapagination.index;
        //   this.isActivityPagination = true;
        // } if (this.activityList <= 0) {
        //   this.isActivityPagination = false;
        // }
      })

    // if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' ||this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
    //   this.getmodification_vender();
    //   this.activity_modify = true;

    // }

  }

  activityId:any
  select_preActivity(data){
    // let data = this.sharedService.activityView.value;
    this.activityId = data.id
    this.getPre_ActivityDetail();
    // let activityName = data.name
    
    // this.ActivityDetailAddForm.patchValue({
    //   "name": activityName,
    // });
  }

  activityDetailList:any;
  getPre_ActivityDetail(pageNumber = 1, pageSize = 10) {
    this.atmaService.getActivityDetailList(this.activityId, pageNumber, pageSize)
      .subscribe(result => {
        console.log("activitydetail-dropdown", result)
        let datas = result['data'];
        // this.totalData = datas;
        // console.log("ss", this.totalData)
        this.activityDetailList = datas;
        // let datapagination = result["pagination"];
        // this.activityDetailList = datas;
        // if (this.activityDetailList.length >= 0) {
        //   this.has_next = datapagination.has_next;
        //   this.has_previous = datapagination.has_previous;
        //   this.presentpage = datapagination.index;
        //   this.isActivityDetailPagination = true;
        // } if (this.activityDetailList <= 0) {
        //   this.isActivityDetailPagination = false;
        // }
        // if(this.totalData.length>0){
        //   this.getcatsummary();
        //   }
       
      })

    // if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
    //   this.getmodificationactivitydetail_vender();
    //   this.activitydetail_modify = true;

    // }
    
  }

  select_preActivityDetail(data){
    let det = data.detailname
    this.activityDetailId = data.id
    this.catalogAddForm.patchValue({
      detail_name: det
    })

  }




  // activity list---activity id
  branchlist:any
  isLoadingbranch=false

  brachname(){
    let prokeyvalue: String = "";
      this.getbranch(prokeyvalue);
      this.catalogAddForm.get('activity_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoadingbranch = true;
          }),
          switchMap(value => this.atmaService.getActivityList_(this.branchViewId,value)
            .pipe(
              finalize(() => {
                this.isLoadingbranch = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist= datas;
          console.log("activity dropdown", datas)

        })

  }
  private getbranch(prokeyvalue)
  {
    this.atmaService.getActivityList_(this.branchViewId,prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaybranch(producttype?: branchlistss): string | undefined {
    return producttype ? producttype.name : undefined;
    
  }


  
  FocusOut_select_preActivity(data){
    this.activityId = data.id
    this.getbrancg();
  }



  // activitydetail list---activitydetail id
  primeslist:any
  isLoadingprimes=false

  primiesname(){
    let prokeyvalue: String = "";
      this.getbrancg();
      this.catalogAddForm.get('activitydetail_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoadingprimes = true;
          }),
          switchMap(value => this.atmaService.getActivityDetailList_(this.activityId,value)
            .pipe(
              finalize(() => {
                this.isLoadingprimes = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.primeslist= datas;
          console.log("activitydetail dropdown", datas)

        })

  }
  getbrancg()
  {
    this.atmaService.getActivityDetailList_(this.activityId,"")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;

      })
  }

  public displayprimes(producttype?: ADlist): string | undefined {
    return producttype ? "("+producttype.code +") "+producttype.detailname : undefined;
    
  }


  Focusout_select_preActivityDetail(data){
    let det =  "("+data.code +") "+data.detailname
    this.activityDetailId = data.id
    this.catalogAddForm.patchValue({
      detail_name: det
    })

  }

}
class Catalog {
  detail_name: string;
  product_name: string;
  category: string;
  subcategory: string;
  name: string;
  specification: string;
  size: string;
  remarks: string;
  uom: string;
  unitprice: string;
  from_date: string;
  to_date: string;
  packing_price: string;
  delivery_date: string;
  capacity: string;
  direct_to: string;
}