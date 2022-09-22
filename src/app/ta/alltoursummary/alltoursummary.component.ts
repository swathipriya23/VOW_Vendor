import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShareService } from '../share.service';
import { TaService } from '../ta.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-alltoursummary',
  templateUrl: './alltoursummary.component.html',
  styleUrls: ['./alltoursummary.component.scss']
})
export class AlltoursummaryComponent implements OnInit {
  tourid: any;
  startdate: string;
  toursummary: any;
  has_next = true;
  has_previous = false;
  presentpage = 1
  requirementdata: any; 
  approvalflowlist: any;
  p = 1

  pageSize = 10;
  accrequirementdata: any[];
  approverloader: boolean=false;
  requirementloader:boolean=false

  @ViewChild('closeapprovalpopup') closeapprovalpopup;
  enddate: any;
  tourrequirement: any;
  showtravel:any;
  showclaim:any

  constructor(public taservice: TaService, private shareservice: ShareService,
    private router: Router, private SpinnerService: NgxSpinnerService,private datePipe:DatePipe) { }

  ngOnInit(): void {

    this.tourid = this.shareservice.all_tournumb.value
    this.tourrequirement=this.shareservice.all_tourrequirement.value
  

    this.startdate = this.datePipe.transform(this.shareservice.all_tourstartdate.value, 'dd-MMM-yyyy')

    this.enddate = this.datePipe.transform(this.shareservice.all_tourenddate.value, 'dd-MMM-yyyy')
    console.log('this.tourid',this.tourid)
    
    console.log('this.startdate',this.startdate)
    console.log('this.enddate',this.enddate)
    console.log('this.requirement',this.tourrequirement)

    // if ((this.tourid == '' || this.tourid == null) && (this.startdate == '' || this.startdate == null) ) {
    //   this.gettoursummary(this.presentpage,this.startdate)
    // }
    // else {
      this.presentpage = 1
      this.getsearchedtoursummary(this.tourid, this.presentpage,this.startdate, this.enddate,this.tourrequirement)

    // }

  }
  //ngOninint


  gettoursummary(pageno,date) {


    this.taservice.getalltoursummary(pageno,date)
      .subscribe(results => {
        this.toursummary = results['data']
        let pagination = results['pagination'];

        if (this.toursummary.length > 0) {
          this.has_next = pagination.has_next;
          this.has_previous = pagination.has_previous;
          this.presentpage = pagination.index;
          this.shareservice.all_tourpage.next(this.presentpage)
        }
      }
      )

  }

  nextClick() {
    if (this.has_next == true) {
      // if (this.tourid == '' || this.tourid == null) {
      //   this.gettoursummary(this.presentpage + 1,this.startdate)
      // }
      // else {
        this.getsearchedtoursummary(this.tourid, this.presentpage + 1,this.startdate, this.enddate,this.tourrequirement)
        this.shareservice.all_tourpage.next(this.presentpage)

      // }

    }

  }


  previousClick() {
    if (this.has_previous == true) {
      // if (this.tourid == '' || this.tourid == null) {
      //   this.gettoursummary(this.presentpage - 1,this.startdate)
      // }
      // else {
        this.getsearchedtoursummary(this.tourid, this.presentpage - 1,this.startdate, this.enddate,this.tourrequirement)
        this.shareservice.all_tourpage.next(this.presentpage)

      // }
    }
  }
 

  getsearchedtoursummary(tourid, page,date,enddate,reqtype) {
    // getsearchalltoursummary
    this.SpinnerService.show()
    this.taservice.getsearchalltoursummary(tourid, page,date,enddate,reqtype)
      .subscribe(results => {
        this.SpinnerService.hide()
        this.showclaim= false;
        this.showtravel = false;
        this.toursummary = results['data']
        let pagination = results['pagination'];
        if (reqtype.toLowerCase() == 'travel'){
          this.showtravel = true;
        }
        else if (reqtype.toLowerCase() == 'claim'){
          this.showclaim = true;
        }

        if (this.toursummary.length > 0) {
          this.has_next = pagination.has_next;
          this.has_previous = pagination.has_previous;
          this.presentpage = pagination.index;
          this.shareservice.all_tourpage.next(this.presentpage)

        }
      }
      )
  }



  getrequirement(tourid) {
    // this.taservice.gettourrequirements(tourid).subscribe(
    //   result => {
    //     this.requirementdata = result['data']
    //   })

    // getTourmakereditSummary

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

          this.requirementloader=true
        }
        console.log('requirementsdata', this.requirementdata)

      })
  }

  getapprovalflowlsit(tourid) {
    this.taservice.getapproveflowalllist(tourid)
      .subscribe(res => {
        this.approvalflowlist = res['approve']
        this.approverloader=true
      })
    //   setTimeout(() => {
    //    this.closeapprovalpopup.nativeElement.click()
    // }, 1000);
  }

  clearhistorypopup(){
    this.approvalflowlist=[]
    this.approverloader=false
  }

  clearrequirementpopup(){
    this.accrequirementdata=[]
    this.requirementdata=[]
    this.requirementloader=false
  }

}
