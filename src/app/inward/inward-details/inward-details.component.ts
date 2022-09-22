import { Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { DataService } from '../inward.service'
import { NotificationService } from '../notification.service'
import { FormArray, FormBuilder, FormControl, FormGroup, } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorExceptionService } from '../error-exception.service'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpHeaders } from '@angular/common/http';
export interface depttypelistss {
  id: any
  code: any
  name: any
}

@Component({
  selector: 'app-inward-details',
  templateUrl: './inward-details.component.html',
  styleUrls: ['./inward-details.component.scss']
})
export class InwardDetailsComponent implements OnInit {

  inwarddetails: FormGroup;
  inwardDetailList: any;
  employeeBranchData: any;
  documenttypeList: any;
  imageUrl = environment.apiURL
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>

  constructor(private router: Router, private shareService: ShareService,
    private notification: NotificationService, private fb: FormBuilder,
    private dataService: DataService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorExceptionService,) { }

  ///////////////////////////////////////////////////////////////////////////////////////       initial init
  ngOnInit(): void {
    this.getInwardDetailsView();
    // this.Documenttype();

    this.inwarddetails = this.fb.group({
      noofpackets: '',
      doccount: '',
      inwarddetailsArray: this.fb.array([]),

    })
  }
  /////////////////////////////////////////////// Initial detail view  1
  awbnoforheader: any
  noofpacket: any
  channelnameforheader: any

  dateforheader: any

  couriernameforheader: any
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  getInwardDetailsView(pageNumber = 1, pageSize = 10) {
    let data: any = this.shareService.inwardDetailViews.value
    console.log("data from inward detail view", data)
    let id_data = data.id
    this.employeeBranchData = data?.branch_id?.fullname
    this.awbnoforheader = data?.awbno
    this.noofpacket = data?.noofpockets
    this.channelnameforheader = data?.channel_id?.name
    this.dateforheader = data?.date
    this.couriernameforheader = data?.courier_id?.name
    this.SpinnerService.show()
    this.dataService.getInwardDetailsView(id_data, pageNumber, pageSize)
      .subscribe((results: any) => {
        if (results) {
          this.SpinnerService.hide()
          let dataset = results["inwarddetails_detail"]
          this.inwardDetailList = dataset
          console.log("this. inwarddetail List data", this.inwardDetailList)
          // let datapagination = results["pagination"];


          // if (this.inwardDetailList.length > 0) {
          //   this.has_next = datapagination.has_next;
          //   this.has_previous = datapagination.has_previous;
          //   this.currentpage = datapagination.index;
          // }
          this.updateInternalDocCountData(dataset)
        }

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  nextClick() {
    if (this.has_next === true) {
      this.getInwardDetailsView(this.currentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getInwardDetailsView(this.currentpage - 1, 10)
    }
  }







  updateInternalDocCountData(dataset) {
    let ListData = dataset
    console.log("List data for API Call", ListData)
    for (let i in ListData) {
      let headerID = ListData[i].inwardheader_id
      let packno = ListData[i].packetno
      console.log("data headerID", headerID)
      console.log("packno", packno)
      this.SpinnerService.show()
      this.dataService.detailsBasedOnPacket(headerID, packno)
        .subscribe((results) => {
          this.SpinnerService.hide()
          let dataInnerObjects = results["inwarddetails_detail"]
          console.log("dataInnerObjects loop", dataInnerObjects)
          for (let j in dataInnerObjects) {

            let pushingData = this.inwardDetailList[i].details.push(dataInnerObjects[j])
            console.log("i index data", i)
            console.log("data of push based on index", pushingData)
          }


        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })




    }

  }


  AddBasedOnCount(index, data) {

    console.log("index of header", index)
    console.log("data of header", data)
    console.log("data.count of header", data.doccount)
    console.log("data.details", data.details)
    console.log("data.details.length", data.details.length)

    let doccountdata = data.doccount
    let detailsLengthdata = data.details.length
    let DifferenceInCountAndLength = doccountdata - detailsLengthdata
    let headerIDData = data.inwardheader_id
    let packnoData = data.packetno

    console.log(" DifferenceInCountAndLength ", DifferenceInCountAndLength)


    if (doccountdata <= detailsLengthdata) {
      this.notification.showWarning("If you want to reduce or change, Please use Delete ")
      return false
    }

    if (DifferenceInCountAndLength > 10) {
      let CountdataConform = confirm('Are you sure you want to add more than 10 counts')
      if (CountdataConform == false) {
        this.notification.showWarning("Interrupted by the User")
        data.doccount = ""
        return false
      }
    }

    this.SpinnerService.show()
    this.dataService.AddBasedOnCount(headerIDData, packnoData, DifferenceInCountAndLength)
      .subscribe((results) => {
        this.SpinnerService.hide()
        console.log("result data based on count", results)
        let dataResult = results["inwarddetails_detail"]
        if (results) {
          this.SpinnerService.hide()
          let dataInnerObjects = dataResult
          for (let j in dataInnerObjects) {
            let pushingData = this.inwardDetailList[index].details.push(dataInnerObjects[j])
            console.log("i index data", index)
            console.log("data of push based on index", pushingData)
          }

        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  inwardDetailsClone(outerindex, innerindex, dataTOClone, innerdata) {

    console.log("outerindex", outerindex)
    console.log("innerindex", innerindex)
    console.log("dataTOClone", dataTOClone)
    let headerIDData = dataTOClone.inwardheader_id
    let detailsId = innerdata.id
    this.SpinnerService.show()
    this.dataService.inwardDetailsClone(headerIDData, detailsId)
      .subscribe(results => {
        this.SpinnerService.hide()
        this.notification.showSuccess("Clone Successfully!..")
        console.log("CLOneDatavlaue", results)
        // this.inwarddetails.get("inwarddetailsArray")["controls"][outerindex].get("count").setValue(results.doccount)
        // let dataList = res['inwarddetails_detail']

        if (results) {
          this.SpinnerService.hide()
          dataTOClone.doccount = results.doccount
          let dataInnerObjects = results['inwarddetails_detail']
          for (let j in dataInnerObjects) {
            let pushingData = this.inwardDetailList[outerindex].details.push(dataInnerObjects[j])
            console.log("i index data", outerindex)
            console.log("data of push based on index", pushingData)
          }

        }

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  DeletewhileDocnumberNotgenerate(dataouter, outerindex, innerIndex, innerdet) {
    console.log("data to outer det", dataouter)
    console.log("data outer index", outerindex)
    console.log("data inner index", innerIndex)
    console.log("data inner det", innerdet)
    let ArrayLengthOuter = dataouter.details
    if (ArrayLengthOuter.length == 1) {
      this.notification.showWarning("Single Detail Not Allowed")
      return false

    }
    let headerID = innerdet.inwardheader_id
    let detailID = innerdet.id
    let packno = dataouter.packetno
    this.SpinnerService.show()
    this.dataService.DeleteInwardDetails(headerID, detailID, packno)
      .subscribe((results) => {
        this.SpinnerService.hide()
        if (results.code === "INVALID_INWARDHEADER_ID") {
          this.notification.showWarning("Single Detail Not Allowed")
          return false
        }
        else {
          this.SpinnerService.hide()
          innerdet.statuskey = true
          dataouter.doccount = results.doccount
          dataouter.details.splice(innerIndex, 1)
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }


  deleteInlineFile(outerdata, innerdata, indexouter, outerindex, fileindex) {
    console.log("outerdata", outerdata)
    console.log("innerdata", innerdata)
    console.log("indexouter", indexouter)
    console.log("outerindex", outerindex)
    console.log("fileindex", fileindex)
    let filedata = innerdata.filearray
    console.log("filedata for delete before", filedata)
    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)

  }




  onFileSelected(e, outerindex, inner, data, innerdata) {
    console.log("e in file", e)
    console.log("outerindex in file", outerindex)
    console.log("inner in file", inner)
    console.log("data in file", data)
    console.log("innerdata in file", innerdata)


    let datavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      innerdata.filearray.push(e.target.files[i])
    }


  }


  deleteFileOnParticular(outerindex, innerindex, fulldata, innerdata) {

    console.log("outerindex in file", outerindex)
    console.log("inner in file", innerindex)
    console.log("fulldata in file", fulldata)
    console.log("innerdata in file", innerdata)
    innerdata.filearray = []

    console.log(" this. fileinput", this.fileInput.toArray())
    let filesValue = this.fileInput.toArray()
    let filesValueLength = filesValue.length

    for (let i = 0; i < filesValueLength; i++) {
      filesValue[i].nativeElement.value = ""
      console.log("filesValue[i].nativeElement.value", filesValue[i].nativeElement.value)


    }



  }











  saveParticularIndexData(outerindex, innerindexx, dataToSubmit, dataOnParticularOuterIndex) {
    console.log("dataToSubmit ")
    let data = dataOnParticularOuterIndex
    console.log("submit dataaaaaaaa", data)

    if (data.pagecount == null || data.pagecount == "" || data.pagecount == undefined) {
      this.notification.showWarning("Please fill PageCount")
      return false
    }
    if (data.doctype_id == null || data.doctype_id == "" || data.doctype_id == undefined) {
      this.notification.showWarning("Please Select Document Type")
      return false
    }
    if (typeof data.doctype_id == 'string') {
      this.notification.showWarning("Please Select Document Type from Dropdown")
      return false
    }
    if (data.receivedfrom == null || data.receivedfrom == "" || data.receivedfrom == undefined) {
      this.notification.showWarning("Please fill Received From")
      return false
    }
    if (data.docsubject == null || data.docsubject == "" || data.docsubject == undefined) {
      this.notification.showWarning("Please fill Doc Subject")
      return false
    }
    // if (data.remarks == null || data.remarks == "" || data.remarks == undefined) {
    //   this.notification.showWarning("Please fill Remarks")
    //   return false
    // }
    let dataset = {
      "id": data.id,
      "pagecount": data.pagecount,
      "receivedfrom": data.receivedfrom,
      "docsubject": data.docsubject,
      "doctype_id": data.doctype_id.id,
      "remarks": data.remarks,
      "filekey": [data.file_name]
    }
    let filedataCheck = data.filearray
    if (filedataCheck.length <= 0) {
      this.notification.showWarning("Please Check Files is selected or not")
      return false
    }

    const formData: FormData = new FormData();
    let datavalue = JSON.stringify(dataset)
    formData.append('data', datavalue);
    let filekeydata = data.file_name

    let fileArray = data.filearray
    for (let individual in fileArray) {
      formData.append(filekeydata, fileArray[individual])

    }





    this.SpinnerService.show()

    this.dataService.inwardDetailsViewUpload(formData)
      .subscribe(res => {
        this.SpinnerService.hide()
        this.notification.showSuccess("Updated Successfully!..")
        console.log("return response ", res)
        data.docnumber = res.docnumber
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  fileDownload(file_id, file_name) {
    this.SpinnerService.show()
    this.dataService.fileDownload(file_id)
      .subscribe((data) => {
        this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file_name;
        link.click();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  cancel() {
    // this.router.navigate(['inward/inwardSummary']);
    this.onCancel.emit()
  }



  showInnerimagepopup: boolean = false
  fileListHeader: any

  HeaderFiles(data) {
    console.log("For Header Files", data)
    let filesdataValue = data.file_data
    let detailId = data.id
    this.SpinnerService.show()
    this.dataService.fileListViewnward(detailId)
      .subscribe(results => {
        this.SpinnerService.hide()
        console.log("file results data get from API", results)
        this.fileListHeader = results["file_data"]
        if (results) {
          this.showInnerimagepopup = true
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  showimageHeaderAPI: boolean
  showimagepdf: boolean
  jpgUrls: any
  tokenValues: any
  imageViews: boolean
  pdfViews: boolean
  pdfurl: any
  jpgUrlsAPI: any
  commentPopupHeaderFiles(dataforFile) {


    console.log("file dataaa", dataforFile.file_id)

    console.log("file dataaa", dataforFile)

    console.log("file dataaa", dataforFile)
    let id = dataforFile.file_id
    let file_name = dataforFile.filedata.file_name;
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    // let id = fileid.file_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {

        this.showimageHeaderAPI = true
        this.showimagepdf = false
        this.jpgUrlsAPI = this.imageUrl + "inwdserv/fileview/" + id + "?token=" + token;

        // const reader: any = new FileReader();
        // reader.readAsDataURL(dataimage);
        // reader.onload = (_event) => {
        //   this.jpgUrlsAPI = reader.result
        // }

        console.log("urlHeader", this.jpgUrlsAPI)
    }
    if (stringValue[1] === "pdf") {
      this.showimagepdf = true
      this.showimageHeaderAPI = false
      this.dataService.pdfPopup(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl
        }, (error) => {
          this.errorHandler.handleError(error);
          this.showimagepdf = false
          this.showimageHeaderAPI = false
          this.SpinnerService.hide();
        })
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimagepdf = false
      this.showimageHeaderAPI = false
    }
  }

  currentpagedoctype: any = 1
  has_nextdoctype: boolean
  has_previousdoctype: boolean
  isLoading: boolean = false
  Documenttype(e) {
    console.log("event dataaa", e)
    let dataToSearchCheck = e.target.value
    this.dataService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.documenttypeList = datas;
        let datapagination = results["pagination"];
        this.has_nextdoctype = datapagination.has_next;
        this.has_previousdoctype = datapagination.has_previous;
        this.currentpagedoctype = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  DocumenttypeDD() {
    let dataToSearchCheck = ''
    this.dataService.DocumenttypeSearchAPI(dataToSearchCheck, this.currentpagedoctype)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.documenttypeList = datas;
        let datapagination = results["pagination"];
        this.has_nextdoctype = datapagination.has_next;
        this.has_previousdoctype = datapagination.has_previous;
        this.currentpagedoctype = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  public displayFnDocType(doc?: depttypelistss): string | undefined {
    return doc ? doc.name : undefined;
  }





  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  // pdfurl: any

  filepreview(files) {
    // console.log("file data to view ", files)
    // this.showimageHeaderPreview = true
    // const reader: any = new FileReader();
    // reader.readAsDataURL(files);
    // reader.onload = (_event) => {
    //   // this.assetcatlist[index].images.push(reader.result);
    //   this.jpgUrls = reader.result

    // }


    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true

      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }


  }


  // displayFnDocType(){}

  // autocompleteDocTypeScroll(){}



  // Documenttype() {
  //   this.dataService.Documenttype()
  //     .subscribe(res => {
  //       let data = res['data'];
  //       this.documenttypeList = data;
  //     })
  // }


}