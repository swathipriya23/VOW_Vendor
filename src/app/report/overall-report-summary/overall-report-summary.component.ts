import { DatePipe, formatDate } from '@angular/common';
import { Component, forwardRef, HostListener, Input, OnInit, VERSION, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../report.service';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
const moment = _rollupMoment || _moment;


interface operatorList {
  value: string;
  viewValue: string;
}

export const PICK_FORMAT={
  parse:{dateInput:{year:'numeric',month:'short',day:'numeric'}},
  display:{
    dateInput:'input',
    monthYearLabel:{'year':'numeric',month:'short'},
    dateAllyLabel:{year:'numeric',month:'long',day:'numeric'},
    monthYearAllyLabel:{year:'numeric',month:'long'}
  }
}
export const MONTH_MODE_FORMATS = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

class pDateAdapter extends NativeDateAdapter{
  format(date: Date, displayFormat: Object): string {
    if(displayFormat==='input'){
      return formatDate(date,'dd-MM-yyyy',this.locale)
    }
    else{
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-overall-report-summary',
  templateUrl: './overall-report-summary.component.html',
  styleUrls: ['./overall-report-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DateAdapter,useClass:pDateAdapter},
    {provide:MAT_DATE_FORMATS,useValue:PICK_FORMAT},
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_MODE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OverallReportSummaryComponent),
      multi: true,
    },
  ]
})
export class OverallReportSummaryComponent implements OnInit {
  _inputCtrl: FormControl = new FormControl();
  _inputCtrl1: FormControl = new FormControl();
  module: FormControl = new FormControl();
  _customFilter: (d: Moment) => boolean;
  onChange = (monthAndYear: Date) => { };
  onTouched = () => { };
  @ViewChild(MatDatepicker) _picker: MatDatepicker<Moment>;

  @Input() touchUi = false;
  @Input() touchUi1 = false;
  module_id: any;
  report_id: any;
  generated_Id: any;
  module_name: any;
  vendorForm: FormGroup;
  vendata: any;
  role: boolean = true;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
  month:any = {0:'Jan',1:'Feb',2:'Mar',3:'Apr',4:'May',5:'Jun',6:'Jul',7:'Aug',8:'Sep',9:'Oct',10:'Nov',11:'Dec'}
  datearray: Array<any>=[];
  mo1: any;
  moduleList: any = [];
  moduleNameList: any = [];
  reportForm:any = FormGroup;
  operatorData:any = [];
  operatorData2:any = [];
  operatorDataVendor:any = [];
  presentpage: number=1;
  has_next: boolean=false;
  has_previous: boolean=false;
  has_next2: boolean=false;
  has_previous2: boolean=false;
  pageSize = 10;
  isLoading = false;
  operatorList: operatorList[] = [
    {value: '1', viewValue: 'EQUAL TO '},
    {value: '2', viewValue: 'GREATER THAN OR EQUAL TO'},
    {value: '3', viewValue: 'LESS THAN OR EQUAL TO'},
    {value: '4', viewValue: 'RANGE BETWEEN'},
    {value: '5', viewValue: 'IN'},
    {value: '6', viewValue: 'DATE BETWEEN'},
    {value: '7', viewValue: 'MONTH BETWEEN'},
  ];
  has_nextcom_branch=true;
  has_previouscom=true;
  currentpagecom_branch: number=1;
  presentpagebuk:number = 1
  version = VERSION;
  date = new Date();
  monthInputCtrl: FormControl = new FormControl(new Date(2020,0,1));
  
  _max: Moment;
  @Input() get max(): string | Date {
    return this._max ? this._max.format('MM/YYYY') : undefined;
  }
  set max(max: string | Date) {
    // expect MM to be 1..12 and YYYY > 0
    if (max) {
      const momentDate = typeof max === 'string' ? moment(max, 'MM/YYYY') : moment(max);
      this._max = momentDate.isValid() ? momentDate : undefined;
    }
  }

  _min: Moment;
  @Input() get min(): string | Date {
    return this._min ? this._min.format('MM/YYYY') : undefined;
  }
  set min(min: string | Date) {
    // expect MM to be 1..12 and YYYY > 0
    if (min) {
      const momentDate = typeof min === 'string' ? moment(min, 'MM/YYYY') : moment(min);
      this._min = momentDate.isValid() ? momentDate : undefined;
    }
  }
  writeValue(date: Date): void {
    if (date && this._isMonthEnabled(date.getFullYear(), date.getMonth())) {
      const momentDate = moment(date);
      if (momentDate.isValid()) {
        this._inputCtrl.setValue(momentDate, { emitEvent: false });
        this._inputCtrl1.setValue(momentDate, { emitEvent: false });
      }
    }
  }
  private _isMonthEnabled(year: number, month: number) {
    if (month === undefined || month === null ||
      this._isYearAndMonthAfterMaxDate(year, month) ||
      this._isYearAndMonthBeforeMinDate(year, month)) {
      return false;
    }

    if (!this._customFilter) {
      return true;
    }

    const firstOfMonth = moment([year, month, 1]);

    // If any date in the month is enabled count the month as enabled.
    for (const date = firstOfMonth; date.month() === month; date.add(1)) {
      if (this._customFilter(date)) {
        return true;
      }
    }

    return false;
  }
  private _isYearAndMonthAfterMaxDate(year: number, month: number) {
    if (this._max) {
      const maxYear = this._max.year();
      const maxMonth = this._max.month();

      return year > maxYear || (year === maxYear && month > maxMonth);
    }

    return false;
  }
  private _isYearAndMonthBeforeMinDate(year: number, month: number) {
    if (this.min) {
      const minYear = this._min.year();
      const minMonth = this._min.month();

      return year < minYear || (year === minYear && month < minMonth);
    }

    return false;
  }

  _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }
  
  _openDatepickerOnFocus(datepicker: MatDatepicker<Moment>) {
    setTimeout(() => {
      if (!datepicker.opened) {
        datepicker.open();
      }
    });
  }

  _yearSelectedHandler(chosenMonthDate: Moment, datepicker: MatDatepicker<Moment>) {
    if (!this._isYearEnabled(chosenMonthDate.year())) {
      datepicker.close();
    }
  }

  _monthSelectedHandler(chosenMonthDate: Moment, datepicker: MatDatepicker<Moment>) {
    if (!this._isMonthEnabled(chosenMonthDate.year(), chosenMonthDate.month())) {
      datepicker.close();
      return;
    }

    if (this._max && chosenMonthDate.diff(this._max, 'month') > 0) {
      chosenMonthDate = this._max.clone();
    }

    if (this._min && this._min.diff(chosenMonthDate, 'month') > 0) {
      chosenMonthDate = this._min.clone();
    }

    this._inputCtrl.setValue(chosenMonthDate);
    this.onChange(chosenMonthDate.toDate());
    this.onTouched();
    datepicker.close();
  }

  _monthSelectedHandler1(chosenMonthDate: Moment, datepicker: MatDatepicker<Moment>) {
    if (!this._isMonthEnabled(chosenMonthDate.year(), chosenMonthDate.month())) {
      datepicker.close();
      return;
    }

    if (this._max && chosenMonthDate.diff(this._max, 'month') > 0) {
      chosenMonthDate = this._max.clone();
    }

    if (this._min && this._min.diff(chosenMonthDate, 'month') > 0) {
      chosenMonthDate = this._min.clone();
    }

    this._inputCtrl1.setValue(chosenMonthDate);
    this.onChange(chosenMonthDate.toDate());
    this.onTouched();
    datepicker.close();
  }
  /** Whether the given year is enabled. */
  private _isYearEnabled(year: number) {
    // disable if the year is greater than maxDate lower than minDate
    if (year === undefined || year === null ||
      (this._max && year > this._max.year()) ||
      (this._min && year < this._min.year())) {
      return false;
    }

    // enable if it reaches here and there's no filter defined
    if (!this._customFilter) {
      return true;
    }

    const firstOfYear = moment([year, 0, 1]);

    // If any date in the year is enabled count the year as enabled.
    for (const date = firstOfYear; date.year() === year; date.add(1)) {
      if (this._customFilter(date)) {
        return true;
      }
    }

    return false;
  }


  constructor(private service: ReportService, private formBuilder:FormBuilder,
    private toastr:ToastrService, private spinner: NgxSpinnerService, 
    public dialog: MatDialog, private router:Router, private datepipe:DatePipe) { }

  ngOnInit(): void {
    this.reportForm = this.formBuilder.group({
      // module: [''],
      template: [''],
      operators: [''],
      value1: [''],
      value2: [''],
      value1date: [''],
      value2date: ['']
    })

    this.service.getModuleList()
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('INVALID DATA')
        }
        else{
        let datas = results["data"];
        this.moduleList = datas
        }
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });

      this.service.getDownloadList()
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('INVALID DATA')
        }
        else{
        let datas = results["data"];
        this.operatorData2 = datas
        }
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
  }

  dialogRef:any
  ogFlag = 0
  moduleType(data){
    this.spinner.show();
    this.reportForm.reset();
    this.module_id = data.id
    this.module_name = data.name
    if(this.module_name == 'TRIAL BALANCE'){
      this.service.getRole()
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results[0].role == 1){
          this.role = false;
        }
        else{
          this.role = true;
        }
      })
    }
    this.service.getModuleNameList(data.id)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
        }
        else{
          this.operatorData = [];
          let datas = results["data"];
          this.moduleNameList = datas
          this.spinner.hide();
        }        
      },(error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
    }

  moduleNameType(data){
    this.report_id=data.id
    let data_list = {'module_id':this.module_id,
                'report_id':data.id,
                'report_name':data.name}
    this.service.getParameterList(data_list)
    .subscribe((results: any) => {
      console.log("getList", results);
      if(results.code == "INVALID_DATA"){
        this.toastr.warning('No Data')
      }
      else{
        let datas = results["data"];
        this.operatorData = datas
        console.log(this.operatorData)
        for(let i=0; i<this.operatorData.length; i++){
          this.operatorData[i]['value1'] = false;
          this.operatorData[i]['value1date'] = false;
          this.operatorData[i]['value1month'] = false;
          this.operatorData[i]['value2'] = false;
          this.operatorData[i]['value2date'] = false;
          this.operatorData[i]['value2month'] = false;
        }
      }        
    })
  }

  checker_cat(d){
    let arr = d.id;
    let out={}
    let obj=[]
      if(this.reportForm.get('operators').value!=null || this.reportForm.get('operators').value!="" || this.reportForm.get('operators').value!=undefined ){
        out['operators']=this.reportForm.get('operators').value
      }
      if(this.reportForm.get('value1').value!=null || this.reportForm.get('value1').value!="" || this.reportForm.get('value1').value!=undefined ){
        out['value1']=this.reportForm.get('value1').value
      }  
      out['report_id']=this.report_id
      out['module']=this.module_name
      out['scheduler']=0
      obj.push(out)
      this.service.generateExcel(obj)
      .subscribe((results: any) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        if(this.module_name == "ACCOUNT PAYABLE"){
          link.download = "ACCOUNT_PAYABLE_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "JOURNAL VOUCHER"){
          link.download = "JOURNAL_VOUCHER_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "SUPPLIER MASTER"){
          link.download = "SUPPLIER_MASTER_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "TDS REPORT"){
          if(this.module_id == '4' && this.operatorData[0]['value1month']==true){
          const mon = this._inputCtrl.value
          this.datearray.push(mon._d.getMonth());  //month
          const month1 = this.datearray[0]; //month convert string
          this.mo1 = this.month[month1]
          link.download = `TDS_FULL_${this.mo1}_Reports `+ date +".xlsx";
          this.datearray = []
          }
          else{
            link.download = "TDS_FULL_Reports "+ date +".xlsx";
          }
        }
        else if(this.module_name == "TRIAL BALANCE"){
          link.download = "TRIAL_BALANCE_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "GSTR 2 INPUT RECORD"){
          link.download = "GSTR_2B_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "LIST OF INVOICES NOT PAID"){
          link.download = "LIST_OF_INVOICES_NOT_PAID_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "EXPENSE CLAIM REPORT"){
          link.download = "EXPENSE_CLAIM_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "DEBIT REPORT"){
          link.download = "DEBIT_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "CREDIT REPORT"){
          link.download = "CREDIT_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "VENDOR STATEMENT OF ACCOUNT"){
          link.download = "VENDOR_STATEMENT_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "PAYMENT REPORT"){
          link.download = "PAYMENT_Reports "+ date +".xlsx";
        }
        else if(this.module_name == "PAYMENT COUNT MOVEMENT"){
          link.download = "PAYMENT_COUNT_MOVEMENT_Reports "+ date +".xlsx";
        }
        link.click();
        this.toastr.success('Success')
        this.spinner.hide()
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
    }

  operatorSelect(data,event,i){
    if(event.isUserInput && event.source.selected==true){
      if(data=='1'){
        this.operatorData[i]['value1'] = true;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='2'){
        this.operatorData[i]['value1'] = true;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='3'){
        this.operatorData[i]['value1'] = true;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='4'){
        this.operatorData[i]['value1'] = true;
        this.operatorData[i]['value2'] = true;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='5'){
        this.operatorData[i]['value1'] = true;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='6'){
        this.operatorData[i]['value1date'] = true;
        this.operatorData[i]['value2date'] = true;
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='7'){
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1month'] = true;
        this.operatorData[i]['value2month'] = true;
      }
    }
    else if(event.isUserInput && event.source.selected==false){
      if(data=='1'){
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='2'){
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='3'){
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='4'){
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='5'){
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='6'){
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
      if(data=='7'){
        this.operatorData[i]['value1date'] = false;
        this.operatorData[i]['value2date'] = false;
        this.operatorData[i]['value1'] = false;
        this.operatorData[i]['value2'] = false;
        this.operatorData[i]['value1month'] = false;
        this.operatorData[i]['value2month'] = false;
      }
    }
  }

  previousClick(){

  }

  nextClick(){

  }

  previousClick2(){

  }

  nextClick2(){

  }

  vendor(){
    
  }

  actionDownload(id,i){
    this.spinner.show()
    this.service.getDownloadReport(id)
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
      this.spinner.hide()
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
  }

  report(){

  }

  manualRun(){
    let dynamic_year=new Date();
    let yeat_d=dynamic_year.getFullYear();
    this.spinner.show();
    let d = [{
          "operators": "DATE BETWEEN",
          "value1date": yeat_d.toString()+"-04-01",
          "value2date": this.datepipe.transform(dynamic_year,'yyyy-MM-dd'),
          "module": "TRIAL BALANCE",
          "scheduler":1
    }]
    this.service.manualRunTB(d)
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


  generate(){
    this.spinner.show()
    let obj = []
    let out={}
    this.report_id
    for(let i=0; i<this.operatorData.length;i++){
      if(this.operatorData[i]['value1']==true && this.operatorData[i]['value2']==true && this.operatorData[i]['value1date']==true && this.operatorData[i]['value2date']==true){
        if(this.reportForm.get('operators').value!=null || this.reportForm.get('operators').value!="" || this.reportForm.get('operators').value!=undefined ){
          out['operators']=this.reportForm.get('operators').value
        }
        if(this.reportForm.get('value1').value!=null || this.reportForm.get('value1').value!="" || this.reportForm.get('value1').value!=undefined ){
          out['value1']=this.reportForm.get('value1').value
        }
        if(this.reportForm.get('value2').value!=null || this.reportForm.get('value2').value!="" || this.reportForm.get('value2').value!=undefined ){
          out['value2']=this.reportForm.get('value2').value
        }
        if(this.reportForm.get('value1date').value!=null || this.reportForm.get('value1date').value!="" || this.reportForm.get('value1date').value!=undefined ){
          out['value1date']=this.reportForm.get('value1date').value
        }
        if(this.reportForm.get('value2date').value!=null || this.reportForm.get('value2date').value!="" || this.reportForm.get('value2date').value!=undefined ){
          out['value2date']=this.reportForm.get('value2date').value
        }
        out['report_id']=this.report_id
        out['module']=this.module_name
        out['scheduler']=0
        obj.push(out)
      }
      else if(this.operatorData[i]['value1']==true && this.operatorData[i]['value2']==true){
        if(this.reportForm.get('operators').value!=null || this.reportForm.get('operators').value!="" || this.reportForm.get('operators').value!=undefined ){
          out['operators']=this.reportForm.get('operators').value
        }
        if(this.reportForm.get('value1').value!=null || this.reportForm.get('value1').value!="" || this.reportForm.get('value1').value!=undefined ){
          out['value1']=this.reportForm.get('value1').value
        }
        if(this.reportForm.get('value2').value!=null || this.reportForm.get('value2').value!="" || this.reportForm.get('value2').value!=undefined ){
          out['value2']=this.reportForm.get('value2').value
        }  
        out['report_id']=this.report_id
        out['module']=this.module_name
        out['scheduler']=0
        obj.push(out)
      }
      else if(this.operatorData[i]['value1month']==true && this.operatorData[i]['value2month']==true){
        if(this.reportForm.get('operators').value!=null || this.reportForm.get('operators').value!="" || this.reportForm.get('operators').value!=undefined ){
          out['operators']=this.reportForm.get('operators').value
        }
        out['value1month']=this.datepipe.transform(this._inputCtrl.value,'yyyy-MM')
        // out['value2month']=this.datepipe.transform(this._inputCtrl.value,'yyyy-MM')
        out['report_id']=this.report_id
        out['module']=this.module_name
        out['scheduler']=0
        obj.push(out)
      }
      else if(this.operatorData[i]['value1date']==true && this.operatorData[i]['value2date']==true){
        if(this.reportForm.get('operators').value!=null || this.reportForm.get('operators').value!="" || this.reportForm.get('operators').value!=undefined ){
          out['operators']=this.reportForm.get('operators').value
        }
        if(this.reportForm.get('value1date').value!=null || this.reportForm.get('value1date').value!="" || this.reportForm.get('value1date').value!=undefined ){
          out['value1date']=this.datepipe.transform(this.reportForm.get('value1date').value,'yyyy-MM-dd')
        }
        if(this.reportForm.get('value2date').value!=null || this.reportForm.get('value2date').value!="" || this.reportForm.get('value2date').value!=undefined ){
          out['value2date']=this.datepipe.transform(this.reportForm.get('value2date').value,'yyyy-MM-dd')
        }
        out['report_id']=this.report_id
        out['module']=this.module_name
        out['scheduler']=0
        obj.push(out)
      }
      else if(this.operatorData[i]['value1']==true){
        if(this.reportForm.get('operators').value!=null || this.reportForm.get('operators').value!="" || this.reportForm.get('operators').value!=undefined ){
          out['operators']=this.reportForm.get('operators').value
        }
        if(this.reportForm.get('value1').value!=null || this.reportForm.get('value1').value!="" || this.reportForm.get('value1').value!=undefined ){
          out['value1']=this.reportForm.get('value1').value
        }  
        out['report_id']=this.report_id
        out['module']=this.module_name
        out['scheduler']=0
        obj.push(out)
      }
    }
    console.log(this.module_name);
    this.service.generateExcel(obj)
    .subscribe((results: any) => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      if(this.module_name == "ACCOUNT PAYABLE"){
        link.download = "ACCOUNT_PAYABLE_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "JOURNAL VOUCHER"){
        link.download = "JOURNAL_VOUCHER_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "SUPPLIER MASTER"){
        link.download = "SUPPLIER_MASTER_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "TDS REPORT"){
        if(this.module_id == '4' && this.operatorData[0]['value1month']==true){
        const mon = this._inputCtrl.value
        this.datearray.push(mon._d.getMonth());  //month
        const month1 = this.datearray[0]; //month convert string
        this.mo1 = this.month[month1]
        link.download = `TDS_FULL_${this.mo1}_Reports `+ date +".xlsx";
        this.datearray = []
        }
        else{
          link.download = "TDS_FULL_Reports "+ date +".xlsx";
        }
      }
      else if(this.module_name == "TRIAL BALANCE"){
        link.download = "TRIAL_BALANCE_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "GSTR 2 INPUT RECORD"){
        link.download = "GSTR_2B_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "LIST OF INVOICES NOT PAID"){
        link.download = "LIST_OF_INVOICES_NOT_PAID_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "EXPENSE CLAIM REPORT"){
        link.download = "EXPENSE_CLAIM_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "DEBIT REPORT"){
        link.download = "DEBIT_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "CREDIT REPORT"){
        link.download = "CREDIT_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "VENDOR STATEMENT OF ACCOUNT"){
        link.download = "VENDOR_STATEMENT_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "PAYMENT REPORT"){
        link.download = "PAYMENT_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "PAYMENT COUNT MOVEMENT"){
        link.download = "PAYMENT_COUNT_MOVEMENT_Reports "+ date +".xlsx";
      }
      else if(this.module_name == "BSCC"){
        link.download = "BSCC Reports "+ date +".xlsx";
      }
      link.click();
      this.toastr.success('Success')
      this.spinner.hide()
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })
  }

  // vendorAct(data){
  //   this.operatorDataVendor = undefined;
  //   this.service.getVendorData(data.id)
  //     .subscribe((results: any) => {
  //       console.log("getList", results);
  //       if(results.code == "INVALID_DATA"){
  //         this.toastr.warning('No Data')
  //       }
  //       else{
  //         // this.operatorData = [];
  //         let datas = results["data"];
  //         this.operatorDataVendor = datas
  //         this.spinner.hide();
  //       }        
  //       },(error)=>{
  //         this.operatorDataVendor = []
  //         this.toastr.warning(error.status+error.statusText)
  //       })
  //     }
  }
