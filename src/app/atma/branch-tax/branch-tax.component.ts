import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  AtmaService
} from '../atma.service'
import {
  NotificationService
} from '../notification.service'
import {
  DatePipe,
  formatDate
} from '@angular/common'
import {
  ShareService
} from '../share.service'
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material/core';
import {
  Router
} from '@angular/router'
import {
  fromEvent
} from 'rxjs';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import {
  finalize,
  switchMap,
  tap,
  distinctUntilChanged,
  debounceTime,
  map,
  takeUntil
} from 'rxjs/operators';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl
} from '@angular/platform-browser';
import {
  ToastrService
} from 'ngx-toastr';
export interface productlistss {
  id: string;
  name: string;
}
export interface taxListss {
  name: string;
  id: number;
}
export interface subtaxListss {
  name: string;
  id: number;
}
export interface taxrateListss {
  name: string;
  id: number;
  rate: string;
}
export const PICK_FORMATS = {
  parse: {
    dateInput: {
      month: 'short',
      year: 'numeric',
      day: 'numeric'
    }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: {
      year: 'numeric',
      month: 'short'
    },
    dateA11yLabel: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    monthYearA11yLabel: {
      year: 'numeric',
      month: 'long'
    }
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
  selector: 'app-branch-tax',
  templateUrl: './branch-tax.component.html',
  styleUrls: ['./branch-tax.component.scss'],
  providers: [{
      provide: DateAdapter,
      useClass: PickDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: PICK_FORMATS
    },
    DatePipe
  ]

})

// 
export class BranchTaxComponent implements OnInit {
  @ViewChild('tax') taxx;
  @ViewChild('subtax') subtax;
  @ViewChild('taxrate') taxrate;
  keyword = 'name';
  isLoading = false;
  keyword_rate = 'rate'
  taxid = 0;
  subtaxid = 0;
  taxrateid = 0;
  taxdata: [];
  taxarray: any;
  tax = new FormControl();
  taxform: FormGroup;
  subtaxdata: [];
  taxratedata: any;
  query = ''
  file = [];
  attachment = []
  isexcempted: string
  exmpt_flag = false;
  msme_flag = false;
  taxedit: boolean;
  btaxid = '';
  msme = 'False';
  taxratefield=true;
  branchid: Number;
  taxButton = false;
  excemfrom = '';
  selectedPdf: string = '';
  files: FileList;
  show_file = false;
  panno = '';
  branch = '';
  excemto = '';
  select: any;
  taxlist: Array < taxListss > ;
  subtaxlist: Array < subtaxListss > ;
  taxratelist: Array < taxrateListss >
    totTaxDetail: any;
  taxData: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  @ViewChild('taxtype') mattaxAutocomplete: MatAutocomplete;
  @ViewChild('taxInput') taxInput: any;
  @ViewChild('subtaxtype') matsubtaxAutocomplete: MatAutocomplete;
  @ViewChild('subtaxInput') subtaxInput: any;
  @ViewChild('taxratetype') mattaxrateAutocomplete: MatAutocomplete;
  @ViewChild('taxrateInput') taxrateInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCancel = new EventEmitter < any > ();
  @Output() onSubmit = new EventEmitter < any > ();
  vendordata:any;
  modificationdata:any;
  fileToUpload: FormData = new FormData();
  constructor(private fb: FormBuilder, public dialog: MatDialog, public sanitizer: DomSanitizer,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private shareService: ShareService, private router: Router, private toastr: ToastrService, private atmaService: AtmaService, public datepipe: DatePipe, private notification: NotificationService) {}

  ngOnInit(): void {
    this.vendordata=this.shareService.vendorView.value
    this.modificationdata = this.shareService.taxdata.value;
    console.log("modfi",this.modificationdata)

    this.taxform = this.fb.group({
      supplier_branch: [{
        'value': this.vendordata.name,
        disabled: true
      }],
      msme: ['', ],
      msme_reg_no: [''],
      tax: ['', Validators.required],
      taxrate: ['', Validators.required],
      subtax: ['', Validators.required],
      // pan: [{
      //   'value': this.vendordata.panno,
      //   disabled: true
      // }],
      vendor_code:[this.vendordata.code],
      vendor_id:[this.vendordata.id],

      panno: [''],
      branch_name: [this.branch],
      isexcempted: [this.isexcempted],
      excemrate: ['', Validators.required],
      excemfrom:['', Validators.required],
      excemto: ['', Validators.required],
      excemthrosold: ['', Validators.required],
      file: [null],

      branchid: this.branchid

    })
  //   if(this.taxform.value.tax.name==="GST"){
  //     this.taxratefield=false;
  //  }

    this.isexcemptedcheck({
      "checked": false
    })
    this.Msmecheck({
      "checked": false
    })
    let data: any = this.shareService.branchTaxtEdit.value;
    if (data != " ") {
      this.taxedit = true;
      this.brantax_datalink()

    }

// if(this.modificationdata.length){
//     for(let i=0;i<this.modificationdata.length;i++){
//       if(this.modificationdata[i].type_name== 1){
//         let pan = this.modificationdata[i].new_data.panno
//         this.taxform.patchValue({
//           "panno": pan,
    
//         })
//     }
  
//     }
//   }
//      else {
    
//           this.taxform.patchValue({
//             "panno": this.vendordata.panno,
      
//           })
//         }

    this.branchdetails();
  //   if(this.modificationdata.type_name== 1){
  //     // this.pan = this.modificationdata.new_data.panno
  //     this.taxform.patchValue({
  //       "panno": this.modificationdata.new_data.panno,
  
  //     })
  // } else {
  //   this.taxform.patchValue({
  //     "panno": this.vendordata.panno,

  //   })
  // }


  // this.taxform.patchValue({
  //       "panno": this.vendordata.panno,
  
  //     })

  if(this.modificationdata.length){
    for(let i=0;i<this.modificationdata.length;i++){
      if(this.modificationdata[i].type_name== 1){
        let pan = this.modificationdata[i].new_data.panno
        this.taxform.patchValue({
          "panno": pan,
    
        })
    }
  
    }
  }
     else {
    
          this.taxform.patchValue({
            "panno": this.vendordata.panno,
      
          })
        }

   


  }

  onKeypressEvent(tax) {
    var k = 10;

  }
  taxdroplists() {
   
    let prokeyvalue: String = "";
    this.gettax(prokeyvalue);
    this.taxform.get('tax').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.atmaService.Tax_dropdownsearchST(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxlist = datas;
        if(this.taxform.value.tax.name==="GST"){
          this.taxratefield=false;
       }


      })

  }
  subtaxlists() {
    let subtaxkeyvalue: String = "";
    this.SubTax_dropdownget(this.taxid, subtaxkeyvalue);
    this.taxform.get('subtax').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),

        switchMap(value => this.atmaService.subTax_dropdownscroll(this.taxid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subtaxlist = datas;

      })
  }
  taxrates() {
 
    let taxratekeyvalue: String = "";
    this.Taxrate_dropdownget(this.subtaxid, taxratekeyvalue);
    this.taxform.get('taxrate').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.atmaService.Taxrate_dropdownscroll(this.subtaxid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxratelist = datas;
      })

  }




  fromDateSelection(event: string) {

    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  }

  public displayFntax(taxtype ? : taxListss): string | undefined {

    return taxtype ? taxtype.name : undefined;
  }

  get taxtype() {
    return this.taxform.get('tax');
  }

  private gettax(prokeyvalue) {
    this.atmaService.Tax_dropdownsearchST(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxlist = datas;

        this.taxData = datas.id;


      })
  }

  taxScroll() {
    setTimeout(() => {
      if (
        this.mattaxAutocomplete &&
        this.mattaxAutocomplete &&
        this.mattaxAutocomplete.panel
      ) {
        fromEvent(this.mattaxAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaxAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaxAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaxAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaxAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.Tax_dropdownsearchST(this.taxInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.taxlist.length >= 0) {
                      this.taxlist = this.taxlist.concat(datas);
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


  public displayFnsubtax(subtaxtype ? : subtaxListss): string | undefined {

    return subtaxtype ? subtaxtype.name : undefined;
  }

  get subtaxtype() {
    return this.taxform.get('subtax');
  }

  private SubTax_dropdownget(id, subtaxkeyvalue) {
    this.atmaService.subTax_dropdownscroll(id, subtaxkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subtaxlist = datas;

      })
  }



  subtaxScroll() {
    setTimeout(() => {
      if (
        this.matsubtaxAutocomplete &&
        this.matsubtaxAutocomplete &&
        this.matsubtaxAutocomplete.panel
      ) {
        fromEvent(this.matsubtaxAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubtaxAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubtaxAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubtaxAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubtaxAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.subTax_dropdownscroll(this.taxid, this.subtaxInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subtaxlist.length >= 0) {
                      this.subtaxlist = this.taxlist.concat(datas);
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

  public displayFntaxrate(taxratetype ? : taxrateListss): string | undefined {

    return taxratetype ? taxratetype.rate : undefined;
  }

  get taxratetype() {
    return this.taxform.get('taxrate');
  }

  private Taxrate_dropdownget(id, taxratekeyvalue) {
    this.atmaService.Taxrate_dropdownscroll(id, taxratekeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxratelist = datas;



      })
  }

  taxrateScroll() {
    setTimeout(() => {
      if (
        this.mattaxrateAutocomplete &&
        this.mattaxrateAutocomplete &&
        this.mattaxrateAutocomplete.panel
      ) {
        fromEvent(this.mattaxrateAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaxrateAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaxrateAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaxrateAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaxrateAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.Taxrate_dropdownscroll(this.subtaxid, this.taxrateInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.taxratelist.length >= 0) {
                      this.taxratelist = this.taxratelist.concat(datas);
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



  onFileSelected(event) {
    if (event.target.files) {
      this.show_file = true;
      for (let i = 0; i < event.target.files.length; i++) {
        this.file.push(event.target.files[i])
        // this.fileToUpload.append('file',event.target.files[i])

      }

    }

  }

  onCancelClick() {
    this.onCancel.emit()
  }
  
    numberOnlyandDot(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if ((charCode < 46 || charCode >47)  && (charCode < 48 || charCode > 57) ){
      return false;
      }
      return true;
    }


  isexcemptedcheck(e) {


    if (e.checked) {
      this.isexcempted = 'Y'

      this.exmpt_flag = true
    } else {
      this.isexcempted = 'N'


      this.exmpt_flag = false
    }
  }

  Msmecheck(e) {
    if (e.checked) {
      this.msme = 'True'
      this.msme_flag = true;
    } else {
      this.msme = 'False'
      this.msme_flag = false;
      this.taxform.value.msme_reg_no = ""
    }

  }


  // Only AlphaNumeric
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  removeFile(e, index, msg) {
    if (msg == 'delete') {
      this.atmaService.deletefile(e.id).subscribe(result => {
        this.notification.showSuccess("Deleted....")
        this.attachment.splice(index, 1);

      })
    } else {
      this.file.forEach((e, i) => {
        if (index === i) {
          this.file.splice(index, 1)

        }
      })
    }
  }


  brantax_datalink() {
    let data: any = this.shareService.branchTaxtEdit.value;

    this.btaxid = data.id;


    this.taxform = this.fb.group({
      supplier_branch: [{
        'value': this.vendordata.name,
        disabled: true
      }],
      msme: ['', ],
      msme_reg_no: [''],
      tax: ['', Validators.required],
      taxrate: ['', Validators.required],
      subtax: ['', Validators.required],
      pan: [{
        'value':this.vendordata.panno,
        disabled: true
      }],
      panno: [this.vendordata.panno],
      branch_name: [this.branch],
      isexcempted: [this.isexcempted],
      excemrate: ['',Validators.required],
      excemfrom: ['',Validators.required],
      vendor_code:[this.vendordata.code],
      vendor_id:[this.vendordata.id],
      excemto: ['',Validators.required],
      excemthrosold: ['',Validators.required],
      file: [null],
      id: [this.btaxid],

      branchid: this.branchid

    })
    this.atmaService.Branchtaxeditget(data.id, this.vendordata.id).subscribe(res => {
      let msme = res.msme
      // this.isexcemptedcheck({"checked":false})
      this.Msmecheck({
        "checked": res.msme
      })
      if (res.isexcempted == 'Y') {
        this.exmpt_flag = true;
        this.attachment = res.attachment
      } else {
        this.exmpt_flag = false;
      }
      if (res.msme == true) {
        this.msme_flag = true;
      } else {
        this.msme_flag = false;
      }
      this.taxform.patchValue({
        excemfrom: res.excemfrom,
        excemthrosold: res.excemthrosold,
        excemto: res.excemto,
        isexcempted: this.exmpt_flag,
        msme: res.msme,
        supplier_branch:this.vendordata.name,
        panno: this.vendordata.panno,
        id: data.id,
        tax: res.tax,
        subtax: res.subtax,
        taxrate: res.taxrate,
        excemrate: res.excemrate,
        vendor_code:this.vendordata.code,
      vendor_id:this.vendordata.id,
      msme_reg_no: res.msme_reg_no

      })
      // this.selectsubtax(res.subtax)
      // this.SubTax_dropdownget(this.taxform.value.tax.id, '')
      // this.Taxrate_dropdownget(this.taxform.value.subtax.id, '')
      this.taxid=res.tax.id;
      this.subtaxid=res.subtax.id;
      if(res.tax.name=="GST"){
        this.taxratefield=false
        this.exmpt_flag=false;
      }

    })
    
    

  }
  branchtax_create1() {
    this.SpinnerService.show();
    if (this.taxform.value.tax == 0 || '' ||this.taxform.value.tax==null || this.taxform.value.tax.id == undefined) {
      this.toastr.error("Invalid  Tax  ")
      this.SpinnerService.hide();
      
      
      return false

    }
    
  
    if (this.taxform.value.subtax == 0 || '' || this.taxform.value.subtax==null || this.taxform.value.subtax.id == undefined) {
      this.toastr.error("Invalid  Subtax")
      this.SpinnerService.hide();
      return false

    }
   if(this.taxratefield){
    if (this.taxform.value.taxrate == "" ||  this.taxform.value.taxrate==null || this.taxform.value.taxrate.id == undefined ) {
      this.toastr.error("Invalid Tax Rate ")
      this.SpinnerService.hide();
      return false


    }
   


      if(this.taxform.value.isexcempted === true) {
      if (this.taxform.value.excemfrom === "" || this.taxform.value.excemfrom === "None")  {
        this.toastr.error("Please Choose Valid FromDate ")
        this.SpinnerService.hide();
        return false

      }
      if (this.taxform.value.excemto === ""|| this.taxform.value.excemto === "None") {
        this.toastr.error("Please Choose Valid ToDate ")
        this.SpinnerService.hide();
        return false

      }
      if (this.taxform.value.excemrate === "") {
        this.toastr.error("Please Enter Exempted Rate ")
        this.SpinnerService.hide();
        return false

      }
      if (this.taxform.value.excemthrosold === "") {
        this.toastr.error("Please Enter Exemp Threshold")
        this.SpinnerService.hide();
        return false

      }
    }}
    else{
      this.isexcempted="N"
      this.taxform.value.excemfrom =''
      this.taxform.value.excemto = ''
      this.taxform.value.isexcempted=""
      this.taxform.value.excemthrosold=null
    }

    if (this.taxedit) {
      if (this.taxform.value.isexcempted == true || false) {
        this.isexcemptedcheck({
          "checked": this.taxform.value.isexcempted
        })
      }
      this.taxform.value.tax = this.taxform.value.tax.id;
      this.taxform.value.subtax = this.taxform.value.subtax.id;
      
      if(this.taxform.value.taxrate!=null){
        this.taxform.value.taxrate = this.taxform.value.taxrate.id;
      }else{
        this.taxform.value.taxrate=0;
      }
    
      this.taxform.value.isexcempted = this.isexcempted;
      this.taxform.value.msme = this.msme;
      if (this.isexcempted == 'N') {
        this.taxarray = {
          "tax": this.taxform.value.tax,
          "subtax": this.taxform.value.subtax,
          "msme": this.taxform.value.msme,
          "panno":this.vendordata.panno,
          "isexcempted": this.isexcempted,
          "taxrate": this.taxform.value.taxrate,
          "id": this.taxform.value.id,
          "vendor_id":this.vendordata.id,
          "vendor_code":this.vendordata.code


        }
      }

    } else {
      this.taxform.value.msme = this.msme;
      this.taxform.value.tax = this.taxid;
      this.taxform.value.subtax = this.subtaxid;
      if(this.taxform.value.taxrate!=null){
        this.taxform.value.taxrate = this.taxform.value.taxrate.id;
      }else{
        this.taxform.value.taxrate=0;
      }
      // this.taxform.value.taxrate = this.taxform.value.taxrate.id;
      this.taxform.value.isexcempted = this.isexcempted;
    }


    if(this.taxform.value.msme === 'True') {
      if (this.taxform.value.msme_reg_no === "") {
        this.toastr.error("Please Enter Reg No ")
        this.SpinnerService.hide();
        return false
      }
    }


    if (this.isexcempted == 'N' && this.taxedit != true) {
      this.taxarray = {
        "tax": this.taxform.value.tax,
        "subtax": this.taxform.value.subtax,
        "msme": this.taxform.value.msme,
        "panno": this.vendordata.panno,
        "isexcempted": this.isexcempted,
        "taxrate": this.taxform.value.taxrate,
        "vendor_id":this.vendordata.id,
        "vendor_code":this.vendordata.code


      }
    } else if (this.isexcempted == 'Y') {
      this.taxform.value.excemfrom = this.datepipe.transform(this.taxform.value.excemfrom, 'yyyy-MM-dd');
      this.taxform.value.excemto = this.datepipe.transform(this.taxform.value.excemto, 'yyyy-MM-dd');
      this.taxarray = this.taxform.value
    }

    let json= {
      "msme_reg_no": this.taxform.value.msme_reg_no
    }

    let jsonValue = Object.assign({},this.taxarray,json)
    console.log("branchtax",jsonValue)

    this.fileToUpload.append("data", JSON.stringify(jsonValue))
    if (this.file.length > 0) {

      for (let i = 0; i < this.file.length; i++) {
        this.fileToUpload.append('file', this.file[i])
      }
    }

    
    this.atmaService.branchtax_create(this.taxarray, this.fileToUpload, this.vendordata.id)
      .subscribe(res => {
        console.log("branchtax1",res)

        if (res.id > 0) {
          this.notification.showSuccess("Success")
          console.log("branchtax",res)
          this.SpinnerService.hide();
          this.onSubmit.emit();

        }
        else{
          this.toastr.error(res); 
            
          this.SpinnerService.hide();
          return true
        }
       




      })
  }
  branchdetails() {
    let data: any = this.shareService.branchView.value;
    this.taxform.patchValue({
      panno: data.panno,
      supplier_branch: data.name,
      branchid: data.id,
      pan: data.panno
    })
  }
  selecttax(data) {
      //  if(this.taxform.value.tax.name=="GST"){
       if(data.name=="GST"){
      this.taxratefield=false;
      this.exmpt_flag=false;
      this.taxform.value.isexcempted=false
      this.taxform.get('isexcempted').setValue(false);
      this.isexcempted='N'
   }else{
    this.taxratefield=true;
    // this.exmpt_flag=true;
   }
  
    this.taxform.get('subtax').setValue(null);
    this.displayFnsubtax(null)
    this.taxform.get('taxrate').setValue(null);
    this.displayFntaxrate(null)
    this.taxid = data.id;
    this.SubTax_dropdownget(this.taxid, '')
    

    

  }
  selectsubtax(data) {
    console.log('op')
    this.taxform.get('taxrate').setValue(null);
    this.displayFntaxrate(null)
    this.subtaxid = data.id;
    this.Taxrate_dropdownget(this.subtaxid, '')
  
  }

  onChangeSearch(search: string) {
    this.atmaService.Tax_dropdownsearchST(search, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxdata = datas;

      })
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  

  


}