import { Component, OnInit } from '@angular/core';
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormControl, FormBuilder, NgSelectOption } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
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
  selector: 'app-expensemaker-summary',
  templateUrl: './expensemaker-summary.component.html',
  styleUrls: ['./expensemaker-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ExpensemakerSummaryComponent implements OnInit {
  has_next = true;
  has_previous = true;
  getexpenceList: any
  tourexpencesummarypage: number = 1;
  pagesize = 10;
  memoSearchForm: FormGroup;
  expensemakersearch: any
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  latest: any
  today = new Date();
  date: any;
  value: any;
  currentpage: number = 1;
  presentpage: number = 1;
  onbehalfname: any;
  onbehalfempid: any;
  creatable: boolean;
  tour: any;
  isTourMakerpage: boolean;
  select: Date;
  send_value: any = ""

  constructor(private taService: TaService, private sharedService: SharedService,
    private route: ActivatedRoute, private router: Router, private notification: NotificationService,
    private shareservice: ShareService, private sharedservice: SharedService, private datePipe: DatePipe, private fb: FormBuilder,
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {

    let tourno = this.shareservice.tourno.value;
    this.send_value = ''
    let request_date = this.shareservice.requestdate.value;
    request_date = this.datePipe.transform(request_date, "dd-MMM-yyyy");
    let onbehalf= this.shareservice.expmakeonbehalf.value;
    if (tourno) {
      this.send_value = this.send_value + "&tour_no=" + tourno
    }
    if (tourno && request_date) {

      console.log(request_date)
      this.send_value = this.send_value + "&request_date=" + request_date
    }
    else if (request_date) {
      this.send_value = "&request_date=" + request_date
    }
    if ((onbehalf == 0 || onbehalf ) && onbehalf != null){
      this.send_value = this.send_value+"&onbehalf="+onbehalf
    }
    //   let values:any =this.shareservice.radiovalue.value
    // if (values === ''){
    //   this.value = null
    // }
    // else if (values === '0' || values === 0){
    //   this.value=0
    // }
    // else if(values === 1){
    //   this.value = 1
    // }
    // else if (values === "1"){
    //   this.value = 1
    // }

    this.memoSearchForm = this.fb.group({
      tourno: [''],
      requestdate: [''],
    })
    let datas: any = this.shareservice.fetchData.value;
    if (datas) {
      this.onbehalfname = datas.employee_name
      this.onbehalfempid = datas.employeegid
    }
    this.gettourmakersummary(this.send_value, 1, this.pagesize)
  }
  tourno(e) {
    this.tour = e.target.value
    console.log("this.tour", this.tour)
  }
  fromDateSelection(event: string) {
    let latest = event
    this.date = this.datePipe.transform(latest, 'dd-MMM-yyyy');
    console.log("this.date", this.date)
    console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  gettourmakersummary(val,
    pageNumber, pageSize) {

    this.SpinnerService.show()
    this.taService.getexpenceSummary(pageNumber, val)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        this.creatable = false;

        let datas = results["data"];
        this.getexpenceList = datas;
        let datapagination = results["pagination"];
        this.getexpenceList = datas;
        if (this.getexpenceList.length === 0) {
          this.isTourMakerpage = false
        }
        if (this.getexpenceList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
          this.isTourMakerpage = true
        }
      })
  }
  TourmakernextClick() {
    if (this.has_next === true) {
      this.gettourmakersummary(this.send_value, this.currentpage + 1, this.pagesize)
    }
  }
  TourmakerpreviousClick() {
    if (this.has_previous === true) {
      this.gettourmakersummary(this.send_value, this.currentpage - 1, this.pagesize)
    }
  }
  expenceEdit(data) {
    let startdate = new Date(data.startdate)
    if (this.value == 1) {
      delete data.onbehalfof
    }
    this.shareservice.expensesummaryData.next(data)
    var datas = JSON.stringify(Object.assign({}, data));

    localStorage.setItem("expense_details", datas)
    this.router.navigateByUrl('ta/exedit');

  }


  tourMakerSearch() {
    this.send_value = ''
    let form_value = this.memoSearchForm.value;
    if (form_value.tourno != "") {
      this.send_value = this.send_value + "&tour_no=" + form_value.tourno
    }
    if (form_value.requestdate != "") {
      let date = this.datePipe.transform(form_value.requestdate, "dd-MMM-yyyy");
      this.send_value = this.send_value + "&request_date=" + date
    }
    this.gettourmakersummary(this.send_value, this.currentpage, this.pagesize)
  }
  reset() {
    this.send_value = ""
    this.memoSearchForm = this.fb.group({
      tourno: [''],
      requestdate: [''],
    })
    this.gettourmakersummary(this.send_value, this.currentpage, this.pagesize)
  }
}

