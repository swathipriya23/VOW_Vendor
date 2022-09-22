import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaService } from "../ta.service";
import { ShareService } from "../share.service";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report-tour-detail',
  templateUrl: './report-tour-detail.component.html',
  styleUrls: ['./report-tour-detail.component.scss']
})
export class ReportTourDetailComponent implements OnInit {
  reporttourdetailForm: FormGroup
  tourdetailreportmodal: any
  gettourdetailreportList = []
  id: any
  ids: any
  emptourid: any
  empname: any
  reportindex: any
  datas: any
  tourreportid: any
  emptourreportid: any
  tourdetaillist: any
  has_next: any;
  presentpage: any = 1;
  pageSize = 10;
  p = 1;
  has_previous: any;
  tourrequirementid: string;
  startdate: string;
  enddate: string;
  tourid: any;
  params: string;
  showrequirements = false;
  formdata: any;
  approvalflowlist: any[];
  approverloader: boolean;
  accrequirementdata: any[];
  requirementdata: any[];
  requirementloader: boolean;
  reporttitle: any;
  statuscolors = { APPROVED: 'green', REJECTED: 'red', PENDING: '#f5b048d7', RETURN: 'black' }

  constructor(public taservice: TaService, private shareservice: ShareService, private datepip: DatePipe,
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.gettourdetailreportList = [];
    this.id = this.shareservice.tourData.value
    this.emptourid = this.shareservice.empData.value
    this.datas = this.shareservice.report.value
    this.reportindex = this.datas.index
    this.formdata = JSON.parse(this.shareservice.reportvalue.value);
    let titleobj = { 1: 'Accommodation Report', 2: 'Cab Report', 5: 'Flight Report', Travel: 'Travel Report', Claim: 'Travel Claim Report', 3: 'Bus Report', 4: 'Train Report' };
    this.params = '&view=1'
    this.formdata.startdate ? this.params += "&start_date=" + this.datepip.transform(this.formdata.startdate, 'dd-MMM-yyyy') : false;
    this.formdata.enddate ? this.params += "&end_date=" + this.datepip.transform(this.formdata.enddate, 'dd-MMM-yyyy') : false;
    this.formdata.tourno ? this.params += "&tour_no=" + this.formdata.tourno : false;
    this.params += '&type=' + this.formdata.reportdropdown;
    if (this.formdata.reportdropdown == 'Requirements') {
      this.params += "&booking_type=" + this.formdata.requirement;
      this.tourrequirementid = this.formdata.requirement;
      this.showrequirements = true;
      this.reporttitle = titleobj[this.tourrequirementid]
    } else {
      this.showrequirements = false;
      this.tourrequirementid = this.formdata.reportdropdown;
      this.reporttitle = titleobj[this.tourrequirementid]
    }


    this.emptourreportid = this.shareservice.emptourreasonid.value
    this.presentpage = 1
    this.getsearchtourdetail(this.presentpage)
  }
  tourrequestno: any
  gettourdetail(data, book, date) {
    this.SpinnerService.show()
    let arr
    this.taservice.gettourdetailreport(data, book, date)
      .subscribe(data => {
        this.SpinnerService.hide()
        this.gettourdetailreportList = data['data']
        // console.log('this.gettourdetailreportlist', data['data'][0])
        let pagination = data['pagination'];

        if (this.gettourdetailreportList) {
          this.has_next = pagination.has_next;
          this.has_previous = pagination.has_previous;
          this.presentpage = pagination.index;

        }
        if (this.gettourdetailreportList.length == 0) {
          this.nextClick()

        }
        if (this.gettourdetailreportList) {
          this.gettourdetailreportList = this.gettourdetailreportList.sort((key1, key2) => (key1.tour_id < key2.tour_id) ? -1 : 1);
        }



      })
  }


  getsearchtourdetail(page) {
    this.SpinnerService.show()
    let arr
    this.taservice.getsearchtourdetailreport(page, this.params)
      .subscribe(data => {
        this.SpinnerService.hide()
        this.gettourdetailreportList = data['data']
        // console.log('this.gettourdetailreportlist',data['data'][0] )
        let pagination = data['pagination'];

        if (this.gettourdetailreportList) {
          this.has_next = pagination.has_next;
          this.has_previous = pagination.has_previous;
          this.presentpage = pagination.index;

        }
        // if (this.gettourdetailreportList.length == 0) {
        //   this.nextClick()

        // }
        // if (this.gettourdetailreportList) {
        //   this.gettourdetailreportList = this.gettourdetailreportList.sort((key1, key2) => (key1.tour_id < key2.tour_id) ? -1 : 1);
        // }



      })
  }

  getrequirement(tourid) {
    this.taservice.getTourmakereditSummary(tourid).subscribe(
      result => {
        let reqdata = result['detail']
        console.log('reqdata', reqdata)
        this.requirementdata = []
        this.accrequirementdata = []
        for (let i = 0; i < reqdata.length; i++) {

          for (let j = 0; j < reqdata[i].requirement.length; j++) {
            if (reqdata[i].requirement[j].booking_needed == '1') {
              this.accrequirementdata.push(reqdata[i].requirement[j])
            }
            else {
              this.requirementdata.push(reqdata[i].requirement[j])
            }
          }

          this.requirementloader = true
        }
        console.log('requirementsdata', this.requirementdata)

      })
  }
  getapprovalflowlsit(tourid) {
    this.taservice.getapproveflowalllist(tourid)
      .subscribe(res => {
        this.approvalflowlist = res['approve']
        this.approverloader = true
      })
    //   setTimeout(() => {
    //    this.closeapprovalpopup.nativeElement.click()
    // }, 1000);
  }
  reportexceldownload() {
    let myform = this.formdata;
    let reportname = myform.requirement;
    let params = this.params.replace('&view=1', '?view=0');
    this.SpinnerService.show()
    this.taservice.gettourreportxl(reportname, params).subscribe(data => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let titleobj = {1:'Accommodation Report',2:'Cab Report',5:'Flight Report',Travel:'Travel Report',Claim:'Travel Claim Report',3:'Bus Report',4:'Train Report'};
      link.download = titleobj[this.tourrequirementid] + ".xlsx";
      link.click();
    })
  }

  nextClick() {
    if (this.has_next == true) {
      this.getsearchtourdetail(this.presentpage + 1);
    }

  }
  previousClick() {
    if (this.has_previous == true) {
      this.getsearchtourdetail(this.presentpage - 1);
    }

  }

  statuscolor(value) {
    return this.statuscolors[value] ? this.statuscolors[value] : 'black'
  }



  download() {
    if (this.reportindex === 1) {

      this.taservice.gettourdetaildownload(this.tourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Detail Report' + ".xlsx";
          link.click();
        })
    }
    if (this.reportindex === 3) {
      this.taservice.gettourdetaildownload(this.emptourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Detail Report' + ".xlsx";
          link.click();
        })
    }
  }

  clearhistorypopup() {
    this.approvalflowlist = []
    this.approverloader = false
  }

  clearrequirementpopup() {
    this.accrequirementdata = []
    this.requirementdata = []
    this.requirementloader = false
  }

  getdetail(data) {

    this.taservice.gettourdetailreportdetailitenary(data)
      .subscribe((results) => {
        console.log('tour', data, 'detail', results)
        this.tourdetaillist = results

      })
  }
}
