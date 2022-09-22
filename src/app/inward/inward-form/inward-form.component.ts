import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataService } from '../inward.service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { filter, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorExceptionService } from '../error-exception.service'
import { ShareService } from '../share.service'

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

export interface courierlistss {
  code: string
  name: string
  id: string
}

@Component({
  selector: 'app-inward-form',
  templateUrl: './inward-form.component.html',
  styleUrls: ['./inward-form.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InwardFormComponent implements OnInit {
  inwardForm: FormGroup;
  courierList: Array<any>;
  channelList: Array<any>;
  currentDate: any = new Date();
  ddList: any
  defaultDate = new FormControl(new Date())
  courier: boolean;
  today = new Date();
  employeeBranchData: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading: boolean
  ChannelList: any
  CourierList: Array<courierlistss>;
  maxData = this.currentDate
  editFormsActive: boolean
  editFormsActiveAfterDetailsFinished: boolean = false
  HeaderID: any
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('Channel') matChannelAutocomplete: MatAutocomplete;
  @ViewChild('channelInput') channelInput: any;

  @ViewChild('Courier') matCourierAutocomplete: MatAutocomplete;
  @ViewChild('CourierInput') CourierInput: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private dataService: DataService, private datePipe: DatePipe,
    private router: Router, private errorHandler: ErrorExceptionService, private SpinnerService: NgxSpinnerService, private shareService: ShareService,) { }
  ngOnChanges() {
    this.getCourier();
    
  }
  ngOnInit(): void {
    this.inwardForm = this.fb.group({
      no: ['', Validators.required],
      channel: ['', Validators.required],
      courier: ['', Validators.required],
      // couriers: ['', Validators.required],
      awbno: ['', Validators.required],
      noofpockets: ['1', Validators.required,],
      inwardfrom: ['', Validators.required],
      date: new Date()
    });

    // this.inwardForm.get('channel').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.dataService.getChannelFKdd(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.ChannelList = datas;

    //   }, (error) => {
    //     this.errorHandler.handleError(error);
    //     // this.SpinnerService.hide();
    //   })

    this.inwardForm.get('courier').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getCourierFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.employeeBranch();
    this.getEditInward();
  }

  CourierDD: Boolean
  CourierInputvalue: boolean
  ddChannelChange(event) {
    let value = event.value
    if (value == undefined) { value = event.id }
    else { value = event.value }
    if (value === 1) {
      this.CourierInputvalue = false;
      this.CourierDD = true;
      // this.inwardForm.get('couriers').reset("");
      // this.inwardForm.get('courier').reset("");
    } else {
      this.CourierDD = false
      this.CourierInputvalue = false
      // this.inwardForm.get('couriers').reset("");
      // this.inwardForm.get('courier').reset("");
    }
  }

  resetCourier(){
      this.inwardForm.get('courier').reset("");
  }

  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    return this.currentDate;
  }

  getCourier() {
    this.dataService.getCourier()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.courierList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getChannel() {
    this.dataService.getChannel()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.channelList = datas;
        if (this.editFormsActive == false) {
          let selectedData = this.channelList.find(x => x.id == 1)
          this.inwardForm.patchValue({
            channel: selectedData.id
          })
          this.ddChannelChange(selectedData)
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  getEditInward() {
    let data: any = this.shareService.inwardData.value
    this.getChannel();
    console.log(data)
    let id = data.id
    let detailFinished = data.detail_complete
    console.log("detailFinished", detailFinished)
    if(detailFinished == undefined){
    this.editFormsActiveAfterDetailsFinished = false
    }else{
    this.editFormsActiveAfterDetailsFinished = detailFinished
    }
    if (id == null || id == undefined || id == "") {
      this.editFormsActive = false
      return false
    }
    this.HeaderID = id
    this.editFormsActive = true
    let inwardfrom = data.inwardfrom
    let channel = data.channel_id.id

    let awbno = data.awbno

    let noofpackets = data.noofpockets

    let courier = data.courier_id
    let date = data.date

    this.inwardForm.patchValue({
      no: '',
      channel: channel,
      courier: courier,
      // couriers: couriers,
      awbno: awbno,
      noofpockets: noofpackets,
      inwardfrom: inwardfrom,
      date: date
    })
    let dataforCourier = {
      value: channel
    }

    this.ddChannelChange(dataforCourier)
  }






  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  courierInwardForm() {
    let data = this.inwardForm.value

    let dateValue = this.datePipe.transform(data.date, 'yyyy-MM-dd');
    this.inwardForm.value.date = dateValue

    if (data.inwardfrom == "" || data.inwardfrom == null || data.inwardfrom == undefined) {
      this.notification.showWarning("Please fill Where the Inward From?")
      return false
    }
    if (data.noofpockets == "" || data.noofpockets == null || data.noofpockets == undefined) {
      this.notification.showWarning("Please fill No of Packets")
      return false
    }

    if (data.channel == 1) {
      if (data.courier == "" || data.courier == null || data.courier == undefined) {
        this.notification.showWarning("Please fill Courier")
        return false
      }
      if (data.awbno == "" || data.awbno == null || data.awbno == undefined) {
        this.notification.showWarning("Please fill AWB NO")
        return false
      }
    }


    this.dataService.createInwardForm(data, this.HeaderID)
      .subscribe((results: any) => {
        if (results.code == "UNEXPECTED_ERROR", results.description == "Duplicate Courier Name") {
          this.notification.showWarning("Duplicate Courier Name")
          return false
        }
        else {
          this.notification.showSuccess("Saved Successfully!...")
          // this.router.navigate(['inward/inwardSummary']);
          this.onSubmit.emit();
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  employeeBranch() {
    this.dataService.employeeBranch()
      .subscribe((results: any) => {
        this.employeeBranchData = results.name;
        // console.log("EmploBrancj", results)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  cancel() {
    // this.router.navigate(['inward/inwardSummary']);
    this.onCancel.emit()

  }

  getChannelFK() {
    this.dataService.getChannelFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ChannelList = datas;
        console.log("channel list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  autocompleteCourierScroll() {
    setTimeout(() => {
      if (
        this.matChannelAutocomplete &&
        this.autocompleteTrigger &&
        this.matChannelAutocomplete.panel
      ) {
        fromEvent(this.matChannelAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matChannelAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matChannelAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matChannelAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matChannelAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CourierList = this.CourierList.concat(datas);
                    // console.log("emp", datas)
                    if (this.CourierList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }


  displayFnCourier(courier?: courierlistss): string | undefined {
    return courier ? courier.name : undefined;
  }

  getCourierFK() {
    this.dataService.getCourierFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;
        console.log("CourierList list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }












  numberOnly(event): boolean {
    const input = event.target.value;
    if (input.length === 0 && event.which === 48) {
      event.preventDefault();
    }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }



}
