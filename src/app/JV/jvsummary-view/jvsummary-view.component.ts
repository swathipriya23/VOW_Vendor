import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JvService } from '../jv.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { environment } from 'src/environments/environment';
import {ExceptionHandlingService} from '../exception-handling.service';
import { NgxSpinnerService } from "ngx-spinner";



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
      return formatDate(date, 'dd/MM/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-jvsummary-view',
  templateUrl: './jvsummary-view.component.html',
  styleUrls: ['./jvsummary-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class JvsummaryViewComponent implements OnInit {
  summaryviewForm: FormGroup
  jvid: any
  viewList: any

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  description: any
  creditsum: any
  debitsum: any
  sum: any
  totalcount: any
  tranrecords: any
  filedatas: any
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closefile') closefile;

  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  constructor(private fb: FormBuilder, private shareservice: ShareService,
    private jvservice: JvService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService, private datepipe: DatePipe,
    private errorHandler:ExceptionHandlingService,private spinnerservice:NgxSpinnerService) { }

  ngOnInit(): void {

    this.jvid = this.shareservice.jvlist.value

    this.summaryviewForm = this.fb.group({

      crno: [''],
      refno: [''],
      date: [''],
      branch: ['']

    })
    this.getjvview()

  }

  getjvview() {
    this.spinnerservice.show()
    this.jvservice.jvsingleget(this.jvid)
      .subscribe(result => {
        if (result) {
          this.spinnerservice.hide()
          this.description = result?.jedescription
          // if(result['file_data'].length > 0){
          this.filedatas = result['file_data']
          // }

          this.summaryviewForm.patchValue({
            crno: result?.jecrno,
            refno: result?.jerefno,
            date: this.datepipe.transform(result?.jetransactiondate, 'dd/MM/yyyy'),
            branch: result?.jebranch?.name + "-" + result?.jebranch?.code
          })


          this.viewList = result['journaldetails']
          if (this.viewList?.length > 0) {
            let credit = this.viewList?.filter(x => x.jedtype == "Credit")
            let creditamount = credit?.map(c => c.jedamount)
            this.creditsum = creditamount?.reduce((a, b) => a + b, 0)
            let debit = this.viewList?.filter(x => x.jedtype == "Debit")
            let debitamount = debit?.map(c => c.jedamount)
            this.debitsum = debitamount?.reduce((a, b) => a + b, 0)
            this.sum = Number(this.debitsum) + Number(this.creditsum)
            this.totalcount = this.viewList?.length
          }
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  back() {
    this.onCancel.emit()
  }

  tranback() {
    this.closedbuttons.nativeElement.click()

  }

  gettrandata() {
    this.spinnerservice.show()
    this.jvservice.gettrandetail(this.jvid)
      .subscribe(result => {
        if (result) {
          this.tranrecords = result['data']
          this.spinnerservice.hide()
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  viewfile(datas) {
    let id = datas?.file_id
    let filename = datas?.file_name
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      this.spinnerservice.show()
      this.showimageHeaderAPI = true
      this.showimagepdf = false
      this.jpgUrlsAPI = this.imageUrl + "jvserv/fileview/" + id + "?token=" + token;
      this.spinnerservice.hide()
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimagepdf = true
      this.showimageHeaderAPI = false
      this.spinnerservice.show()
      this.jvservice.filedownload(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl
          this.spinnerservice.hide()


        },(error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide()
        })
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimagepdf = false
      this.showimageHeaderAPI = false
    }




  }

  downloadfiles(data) {
    this.spinnerservice.show()
    this.jvservice.filedownload(data.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.spinnerservice.hide()

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      }
      )
  }

  fileback() {
    this.closefile.nativeElement.click()
  }

  fileDeletes(data, index) {
    this.spinnerservice.show()
    this.jvservice.deletefile(data?.file_id)
      .subscribe(result => {
        if (result.status == "success") {
          this.notification.showSuccess("Deleted")
          this.closefile.nativeElement.click()
          this.filedatas.splice(index, 1)
          this.spinnerservice.hide()
        }
        else {
          this.notification.showError(result.description)
          this.closefile.nativeElement.click()
          this.spinnerservice.hide()
          return false
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }


}
