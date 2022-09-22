import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
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
  selector: 'app-catalog-edit',
  templateUrl: './catalog-edit.component.html',
  styleUrls: ['./catalog-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ]
})
export class CatalogEditComponent implements OnInit {
  isLoading = false;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter();
  catalogEditForm: FormGroup;
  catalogEditId: number;
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  today = new Date();
  uomlist: Array<UOM>;
  productlist: Array<any>;
  categorylist: Array<any>;
  subcategorylist: Array<any>;
  activityDetailId: number;
  productList: Array<productlistss>;
  product_name = new FormControl();
  subcategoryID: number;
  categoryID: number;
  productID: number;
  catelogEditButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  select: any;
  catelogName: string;
  subCatelogName: string;
  category: any;
  subcategory: any;

  @ViewChild('uomm') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('uomInput') uomInput: any;

  constructor(private fb: FormBuilder,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
     private shareService: ShareService, private toastr: ToastrService,private atmaService: AtmaService, private notification: NotificationService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    // let data: any = this.shareService.testingvalue.value;
    // this.activityDetailId = data.id
   
    this.catalogEditForm = this.fb.group({
      detail_name: ['', Validators.required],
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      name: [''],
      specification: [''],
      size: [''],
      remarks: [''],
      uom: [''],
      unitprice: [''],
      from_date: [''],
      to_date: [''],
      packing_price: [''],
      delivery_date: [''],
      capacity: [''],
      direct_to: ['', Validators.required]

    })

    this.getCatalogEdit();
    // this.getProductValue();
    // this.getcatagoryValue();
    // this.getsubcatagoryValue();
    // let prokeyvalue: String = "";
    // this.getProducts(prokeyvalue);
    // this.catalogEditForm.get('product_name').valueChanges
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

    // this.catalogEditForm.get('uom').valueChanges
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
  categorynames(){
    this.getcatagoryValue();
  }
  subcategorynames(){
    this.getsubcatagoryValue();
  }
  productname(){
    let prokeyvalue: String = "";
    this.getProducts(prokeyvalue);
    this.catalogEditForm.get('product_name').valueChanges
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
  uomname(){
    let uomkeyvalue: String = "";
    this.getuomValue(uomkeyvalue);

    this.catalogEditForm.get('uom').valueChanges
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
    return this.catalogEditForm.get('product_name');
  }
  public displayFnUOM(uomm?: UOM): string | undefined {
    console.log('id', uomm.id);
    console.log('name', uomm.name);
    return uomm ? uomm.name : undefined;
  }

  prod(data) {
    this.productID = data
    // this.categoryID = data.category
     // this.subcategoryID = data.subcategory
    let catelog = data["category"];
    let catid = catelog['id'];
    this.category = catid
    this.catelogName = catelog['name']
    let subcatelog = data["subcategory"];
    let subcatid = subcatelog['id'];
    this.subcategory =  subcatid
    this.subCatelogName = subcatelog['name']
    this.catalogEditForm.patchValue({
      product_name: this.productID,
      category: this.catelogName,
      subcategory: this.subCatelogName
      // category: this.categoryID,
      // subcategory: this.subcategoryID
    })
  }

  get uomm() {
    return this.catalogEditForm.value.get('uom');
  }

  private getProducts(prokeyvalue) {
    this.atmaService.getProducts(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;

      })
  }
  getProductValue() {
    this.atmaService.getProductList()
      .subscribe(result => {
        this.productlist = result['data']
        console.log("product", this.productlist)
      })
  }

  getcatagoryValue() {
    this.atmaService.getapcat()
      .subscribe(result => {
        this.categorylist = result['data']
        console.log("category", this.categorylist)
      })
  }
  getsubcatagoryValue() {
    this.atmaService.getapsubcatsummary()
      .subscribe(result => {
        this.subcategorylist = result['data']
        console.log("subcategory", this.subcategorylist)
      })
  }
  private getuomValue(uomkeyvalue) {
    this.atmaService.getuom_Search(uomkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomlist = datas;
      })
  }

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
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);
  
    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  createFormate() {
    let data = this.catalogEditForm.controls;
    // let datas: any = this.shareService.catalogEdit.value;
    // this.catalogEditId = datas.id;
    let objCatalog = new Catalog();

    objCatalog.detail_name = data['detail_name'].value;
    objCatalog.product_name = data['product_name'].value.id;
    objCatalog.category = this.category
    objCatalog.subcategory = this.subcategory;
    // objCatalog.name = data['name'].value;
    // objCatalog.specification = data['specification'].value;
    objCatalog.size = data['size'].value;
    // objCatalog.remarks = data['remarks'].value;
    // objCatalog.uom = data['uom'].value.id;
    if(data['uom'].value === ""  || data['uom'].value === null){
      objCatalog.uom = null
    } else {
      objCatalog.uom = data['uom'].value.id;
    }
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
    let dateValue = this.catalogEditForm.value;
    
    if(this.catalogEditForm.value.from_date != "None"){
      objCatalog.from_date = this.datePipe.transform(dateValue.from_date, 'yyyy-MM-dd');
    }
     else {
      this.catalogEditForm.value.from_date = null
     }
     if(this.catalogEditForm.value.to_date != "None"){
      objCatalog.to_date = this.datePipe.transform(dateValue.from_date, 'yyyy-MM-dd');
    }
     else {
      this.catalogEditForm.value.to_date = null
     }


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
  fromDateSelection(event: string) {
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  }

  getCatalogEdit() {
    let dataa: any = this.shareService.catalogEdit.value;
    console.log(dataa)
    this.catalogEditId = dataa.id;
    this.activityDetailId=dataa.activitydetail_id.id;
    this.atmaService.getSingleCatalog(this.activityDetailId, this.catalogEditId)
      .subscribe(data => {
        console.log("c---", data)
        let detailname = data.detailname;
        let product_name = data["productname"];
        let productid = product_name['id'];
        let product = productid
        let category = data["category"];
        let cname = category["name"];
        let categoryid = category['id'];
        let cat = categoryid
        this.category = cat
        let subcategory = data["subcategory"];
        let scname = subcategory["name"];
        let subcategoryid = subcategory['id'];
        let sub = subcategoryid
        this.subcategory =  sub
        let name = data.name;
        let specification = data.specification;
        let size = data.size;
        let remarks = data.remarks;
        let uom = data.uom;
        let unitprice = data.unitprice;
        let fromdate = data.fromdate;
        let todate = data.todate;
        let packing_price = data.packing_price;
        let delivery_date = data.delivery_date;
        let capacity = data.capacity;
        let direct_to = data.direct_to;

        this.catalogEditForm.patchValue({
          detail_name: detailname,
          product_name: product_name,
          category: cname,
          subcategory: scname,
          name: name,
          specification: specification,
          size: size,
          remarks: remarks,
          uom: uom,
          unitprice: unitprice,
          from_date: fromdate,
          to_date: todate,
          packing_price: packing_price,
          delivery_date: delivery_date,
          capacity: capacity,
          direct_to: direct_to

        })
      })
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
  catalogEditCreateForm() {
    this.SpinnerService.show();
   
    
      if (this.catalogEditForm.value.product_name === "") {
        this.toastr.error('Please Select Any One Product');
        this.SpinnerService.hide();
        return false;
      }
      // if (this.catalogEditForm.value.name === "") {
      //   this.toastr.error('Please Enter Catelog Name');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.catalogEditForm.value.uom === "") {
      //   this.toastr.error('Please Select Any One UOM');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.catalogEditForm.value.unitprice === "") {
      //   this.toastr.error('Please Enter UnitPrice');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.catalogEditForm.value.from_date === "") {
      //   this.toastr.error('Please Choose From date');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.catalogEditForm.value.to_date === "") {
      //   this.toastr.error('Please Choose To Date');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.catalogEditForm.value.packing_price === "") {
      //   this.toastr.error('Please Enter Packing Price');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // if (this.catalogEditForm.value.delivery_date === "") {
      //   this.toastr.error('Please Enter Delivery Date');
      //   this.SpinnerService.hide();
      //   return false;
      // }
     
      if (this.catalogEditForm.value.direct_to === "") {
        this.toastr.error('Please Enter Direct To');
        this.SpinnerService.hide();
        return false;
      }
      // if (this.catalogEditForm.value.uom.id === undefined) {
      //   this.toastr.error('Please Select Valid UOM');
      //   this.SpinnerService.hide();
      //   return false;
      // }
  
      if (this.catalogEditForm.value.product_name.id === undefined) {
        this.toastr.error('Please Select Valid Product');
        this.SpinnerService.hide();
        return false;
      }
     
    
      let dateValue = this.catalogEditForm.value;
      dateValue.from_date = this.datePipe.transform(dateValue.from_date, 'yyyy-MM-dd');
      dateValue.to_date = this.datePipe.transform(dateValue.to_date, 'yyyy-MM-dd');

      this.atmaService.catalogEditCreateForm(this.catalogEditId, this.createFormate(), this.activityDetailId)
        .subscribe(result => {
          if(result.id === undefined){
            this.notification.showError(result.description);
            this.SpinnerService.hide();
            return false;
          }
          
          else {
            this.notification.showSuccess("updated Successfully....")
            this.SpinnerService.hide();
            this.onSubmit.emit();
            console.log("Catalogedit", result)
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
