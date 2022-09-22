import { Component, OnInit } from '@angular/core';
import { DataService } from '../inward.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { SharedService } from '../../service/shared.service'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
@Component({
  selector: 'app-inward-master',
  templateUrl: './inward-master.component.html',
  styleUrls: ['./inward-master.component.css'],
  providers: [
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class InwardMasterComponent implements OnInit {

  courierList: Array<any>
  documentList: Array<any>
  channelList: Array<any>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  iMasterList: any;
  urlCourier: string;
  urlChannel: string;
  urlDocument: string;
  urls: string;
  isChannel: boolean;
  isDocument: boolean;
  isCourier: boolean;
  roleValues: string;
  addFormBtn: string;
  ismakerCheckerButton: boolean;
  isChannelForm: boolean;
  isChannelEditForm: boolean;
  isCourierForm: boolean;
  isCourierEditForm: boolean;
  isDocumentForm: boolean;
  isDocumentEditForm: boolean;
  currentpageChannel: number = 1;
  currentpageDocument: number = 1;
  currentpageCourier: number = 1;
  pageSize = 10;

  constructor(private dataService: DataService, private router: Router, private shareService: ShareService,
    private sharedService: SharedService,
  ) { }


  ngOnInit(): void {
    let datas = this.sharedService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "iMaster") {
        this.iMasterList = subModule;
      }

    });
    // this.ismakerCheckerButton = this.makerNameBtn === this.subModuleName ? true : false;
    // })


  }



  getDocument(
    pageNumber = 1) {
    this.dataService.getDocument(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // console.log("GetDoc", datas);
        let datapagination = results["pagination"];
        this.documentList = datas;
        if (this.documentList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpageDocument = datapagination.index;
        }
      })
  }

  document_nextClick() {
    if (this.has_next === true) {
      this.getDocument(this.currentpageDocument + 1)
    }
  }

  document_previous_Click() {
    if (this.has_previous === true) {
      this.getDocument(this.currentpageDocument - 1)
    }
  }


  searchDocument(code, name ){
    console.log("channel code ", code )
    console.log("channel name ", name )

    this.dataService.getDocsearch(code, name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.documentList = datas;
      })

  }



  getChannel(
    pageNumber = 1) {
    this.dataService.getChannel(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // console.log("GetChannel", datas);
        let datapagination = results["pagination"];
        this.channelList = datas;
        if (this.channelList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpageChannel = datapagination.index;
        }
      })
  }

  channel_nextClick() {
    if (this.has_next === true) {
      this.getChannel(this.currentpageChannel + 1)
    }
  }

  channel_previousClick() {
    if (this.has_previous === true) {
      this.getChannel(this.currentpageChannel - 1)
    }
  }


  courierEdit(data: any) {
    // console.log("Couriererer",data)

    this.isCourierEditForm = true;
    this.isCourier = false;
    this.ismakerCheckerButton = false;
    this.shareService.courierEdit.next(data);
    return data;
  }

  channelEdit(data: any) {
    // console.log("CHANELLLL",data)
    this.isChannel = false;
    this.isChannelEditForm = true;
    this.ismakerCheckerButton = false;
    this.shareService.channelEdit.next(data)
    return data;
  }
  documentEdit(data: any) {
    // console.log("Docuebt",data)

    this.isDocumentEditForm = true;
    this.ismakerCheckerButton = false;
    this.isDocument = false;
    this.shareService.documentEdit.next(data)
    return data;
  }

  searchChannel(code, name ){
    console.log("channel code ", code )
    console.log("channel name ", name )

    this.dataService.getChannelsearch(code, name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.channelList = datas;
      })

  }
  


 getCourier (
    pageNumber = 1) {
    this.dataService.getCourier(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // console.log("GetCourier", datas);
        let datapagination = results["pagination"];
        this.courierList = datas;
        if (this.courierList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpageCourier = datapagination.index;
        }
      })
  }

  courier_nextClick() {
    if (this.has_next === true) {
      this.getCourier(this.currentpageCourier + 1)
    }
  }

  courier_previousClick() {
    if (this.has_previous === true) {
      this.getCourier(this.currentpageCourier - 1)
    }
  }
  searchCourier(code, name, contactperson ){
    console.log("searchCourier code ", code )
    console.log("searchCourier name ", name )
    console.log("searchCourier name ", contactperson )
    this.dataService.getCouriersearch(code, name, contactperson)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.courierList = datas;
    })

}
  subModuleData(data) {
    this.urls = data.url;
    this.urlChannel = "/inwardchannel";
    this.urlDocument = "/inwarddocument";
    this.urlCourier = "/inwardcourier";
    this.isChannel = this.urlChannel === this.urls ? true : false;
    this.isCourier = this.urlCourier === this.urls ? true : false;
    this.isDocument = this.urlDocument === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }

    if (this.isChannel) {
      this.isChannel = true

      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = false;
      this.getChannel();
    }
    if (this.isDocument) {
      this.isDocument = true

      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.getDocument();
    }
    if (this.isCourier) {
      this.isCourier = true

      this.isCourierForm = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.getCourier();
    }
  }



  addForm(data) {
    if (data == "Inward Courier") {
      this.isCourierForm = true;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.ismakerCheckerButton = false;
    } else if (data == "Inward Document") {
      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = true;
      this.isDocument = false;
      this.isChannelForm = false;
      this.isChannel = false
      this.ismakerCheckerButton = false;
    } else if (data === "Inward Channel") {
      this.isCourierForm = false;
      this.isCourier = false;
      this.isDocumentForm = false;
      this.isDocument = false;
      this.isChannelForm = true;
      this.isChannel = false
      this.ismakerCheckerButton = false;
    }
  }

  courierSubmit() {
    this.getCourier();
    this.isCourierForm = false;
    this.ismakerCheckerButton = true
    this.isCourier = true;
  }

  courierCancel() {
    this.isCourier = true;
    this.ismakerCheckerButton = true
    this.isCourierForm = false;
  }

  courierEditCancel() {
    this.isCourier = true;
    this.ismakerCheckerButton = true
    this.isCourierEditForm = false;
  }

  courierEditSubmit() {
    this.getCourier();
    this.isCourier = true;
    this.ismakerCheckerButton = true
    this.isCourierEditForm = false;
  }

  documentCancel() {
    this.isDocument = true;
    this.isDocumentForm = false;
    this.ismakerCheckerButton = true
  }
  documentSubmit() {
    this.getDocument();
    this.isDocument = true;
    this.isDocumentForm = false;
    this.ismakerCheckerButton = true

  }
  documentEditCancel() {
    this.isDocument = true;
    this.isDocumentEditForm = false;
    this.ismakerCheckerButton = true

  }
  documentEditSubmit() {
    this.getDocument();
    this.ismakerCheckerButton = true
    this.isDocument = true;
    this.isDocumentEditForm = false;
  }

  channelEditCancel() {
    this.isChannelEditForm = false;
    this.isChannel = true;
    this.ismakerCheckerButton = true;
  }
  channelEditSubmit() {
    this.getChannel();
    this.isChannelEditForm = false;
    this.isChannel = true;
    this.ismakerCheckerButton = true

  }

  channelCancel() {
    this.isChannelForm = false;
    this.isChannel = true;
    this.ismakerCheckerButton = true;
  }
  channelSubmit() {
    this.getChannel();
    this.isChannelForm = false;
    this.isChannel = true;
    this.ismakerCheckerButton = true

  }
} 