import { DatePipe, formatDate } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { ReportService } from '../report.service';

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
  selector: 'app-vendor-report',
  templateUrl: './vendor-report.component.html',
  styleUrls: ['./vendor-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
  encapsulation: ViewEncapsulation.None
})
export class VendorReportComponent implements OnInit {
  @ViewChild('ven') matcatAutocomplete: MatAutocomplete;
  @ViewChild('venidInput') venidInput: any;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  dateNew: any;
  // _inputCtrl: FormControl = new FormControl();
  month:any = {0:'Jan',1:'Feb',2:'Mar',3:'Apr',4:'May',5:'Jun',6:'Jul',7:'Aug',8:'Sep',9:'Oct',10:'Nov',11:'Dec'}
  mo1: any;
  role: boolean = true;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  first = false;
  vendorForm: FormGroup;
  vendata: any;
  operatorDataVendor:Array<any> = [];
  venName:any;
  venId:any;
  venNameDetail:Array<any> = [];
  pageSize = 10;
  isLoading = false;
  has_nextcom_branch=true;
  has_previouscom=true;
  currentpagecom_branch: number=1;
  presentpagebuk:number = 1
  presentpage:number = 1
  has_next: boolean=false;
  has_previous: boolean=false;
  constructor(private service: ReportService, private formBuilder:FormBuilder,
    private toastr:ToastrService, private spinner: NgxSpinnerService, 
    public dialog: MatDialog, private router:Router, private datepipe:DatePipe) { }

  ngOnInit(): void {
    this.vendorForm = this.formBuilder.group({
      ven:new FormControl(''),
      "_inputCtrl":new FormControl('')
    })

    this.service.getRole()
      .subscribe((results: any) => {
        console.log("getVendorrole", results);
        if(results[0].role == 1){
          this.role = false;
        }
        else{
          this.role = true;
        }
      });

    this.service.getvensearch('',1).subscribe(data=>{
      this.vendata=data['data'];
    }),

    this.vendorForm.get('ven').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.getvensearch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )

      .subscribe((results: any[]) => {
        this.vendata = results["data"];
        console.log('cat_id=',results)

      })
  }

  autocompleteScroll_cat() {
    setTimeout(() => {
      if (this.matcatAutocomplete && this.autocompleteTrigger && this.matcatAutocomplete.panel) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.service.getvensearch( this.venidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.vendata = this.vendata.concat(datas);
                    if (this.vendata.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  vendor(){

  }
  // date(){
  //   // const mon = this._inputCtrl.value
  //   this.dateNew.push(mon._d.getMonth());  //month
  //   const month1 = this.dateNew[0]; //month convert string
  //   this.mo1 = this.month[month1]
  // }

  previousClick(){
    if(this.presentpage == 1){
      this.toastr.warning('No Page Available')
      return false;
    }
    this.presentpage=this.presentpage-1
    this.spinner.show();
    let d = {"supplier_id":this.venId.toString(),"from_date":"","page_number":this.presentpage,"page_size":10}
    this.service.getVendorDetails(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
        }
        else{
          let datas = results;
          if (datas === undefined){
            this.toastr.warning("No Records")
          }
          else{
            this.operatorDataVendor = datas
            this.spinner.hide()
          }
        }        
        },(error)=>{
          this.spinner.hide()
          this.toastr.warning(error.status+error.statusText)
        })
      }

  nextClick(){
    this.presentpage=this.presentpage+1
    this.spinner.show();
    let d = {"supplier_id":this.venId.toString(),"from_date":"","page_number":this.presentpage,"page_size":10}
    this.service.getVendorDetails(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
        }
        else{
          let datas = results;
          if (datas === undefined){
            this.toastr.warning("No Records")
          }
          else{
            this.operatorDataVendor = datas
            this.spinner.hide()
          }
        }        
        },(error)=>{
          this.spinner.hide()
          this.toastr.warning(error.status+error.statusText)
        })
      }

  vendorAct(data){
    this.venName = data.name
    this.venId = data.id
    }

  clear(){
    this.vendorForm.get('ven').patchValue('')
    this.vendorForm.get('_inputCtrl').patchValue('')
  }

  submit(){
    this.spinner.show();
    let date = ""
    if(this.vendorForm.get('ven').value == null || this.vendorForm.get('ven').value == ""){
      this.toastr.warning('Select Vendor') 
      this.spinner.hide()
      return true     
    }
    if(this.vendorForm.get('_inputCtrl').value !=null && this.vendorForm.get('_inputCtrl').value !="" ){
      let datevalue=this.vendorForm.get('_inputCtrl').value;
      date =this.datepipe.transform(datevalue,'yyyy-MM-dd');      
    } 
    let d = {"supplier_id":this.venId.toString(),"from_date":date,"page_number":0,"page_size":10}
    this.service.getVendorDetails(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
          this.spinner.hide();
        }
        else{
          let datas = results;
          if (datas === undefined){
            this.toastr.warning("No Records")
            this.spinner.hide();
          }
          else{
            this.operatorDataVendor = datas
            this.vendorName()
            this.spinner.hide();
          }
        }        
        },(error)=>{
          this.spinner.hide()
          this.toastr.warning(error.status+error.statusText)
        })
  }

      vendorName(){
        let d = {"supplier_id":"","from_date":"","page_number":0,"page_size":10}
        this.service.getVendorDetailsName(d)
          .subscribe((results: any) => {
            console.log("getList", results);
            if(results.code == "INVALID_DATA"){
              this.toastr.warning('No Data')
              this.spinner.hide();
            }
            else{
              let datas = results['DATA'];
              this.venNameDetail = datas
              this.spinner.hide()
            }
          })
        }

      dialogRef:any
      ogFlag = 0    
      invoiceNo(data,i,temp){
        console.log(data)
        this.spinner.show();
        this.dialogRef = this.dialog.open(temp, {
          width: '80%',
          height: '70%',
          panelClass: 'newClass',
        });
      }

      actionVendorDownload(){
        if(this.first == true){
          this.toastr.warning('Already Progress')
          return true
        }
        this.first=true
        this.service.getVendorDownloadReport(this.venId)
        .subscribe(fullXLS=>{
          console.log(fullXLS);
          let binaryData = [];
          binaryData.push(fullXLS)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = 'Report_Download'+ date +".xlsx";
          link.click();
          this.first=false;
        },
        (error)=>{
          this.first=false;
          this.toastr.warning(error.status+error.statusText)
        })
      }

      manualRun(){
        this.spinner.show();
        let d = {
          "report_id": [
            {
              "operators": "DATE BETWEEN",
              "value1date": "2022-05-27",
              "value2date": "2022-05-27",
              "module": "Vendor Statement",
              "scheduler":1
            }
          ]
        }
        this.service.getVendorManualRun(d)
          .subscribe((results: any) => {
            console.log("getList", results);
            if(results.code == "INVALID_DATA"){
              this.toastr.warning('No Data')
              this.spinner.hide()
            }
            else{
              let datas = results;
              if (datas === undefined){
                this.toastr.warning("No Records")
                this.spinner.hide()
              }
              else{
                if (datas.message == "Successfully Created"){
                  this.toastr.warning("Click one more time insert data")
                  this.spinner.hide()
                }
                else if (datas.message == "Successfully Updated"){
                  this.toastr.success("Manual Run Data Inserted Successfully")
                  this.spinner.hide()
                }
                else if (datas.message == "Successfully Closed"){
                  this.toastr.success("Manual Run Done For the Day")
                  this.spinner.hide()
                }
              }
            }        
            },(error)=>{
              this.spinner.hide()
              this.toastr.warning(error.status+error.statusText)
            })
          }

      // PDfDownload(data) {
        // let id = this.getMemoIdValue(this.idValue)
        // let id = data.assetsaleheader_id
        // let name =  'Karur Vysya Bank'
        // this.faService.fileDownloadpo(id)
          // .subscribe((data) => {
            // let binaryData = [];
            // binaryData.push(data)
            // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            // let link = document.createElement('a');
            // link.href = downloadUrl;
            // link.download = name + ".pdf";
            // link.click();
          // })
      // }
    }