import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { ProofingService } from '../proofing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-proofing-upload',
  templateUrl: './proofing-upload.component.html',
  styleUrls: ['./proofing-upload.component.scss']
})
export class ProofingUploadComponent implements OnInit {
  images: any;
  tempId: any;
  accountid: any;
  finaljson: any;
  uploadForm: FormGroup;
  proofingList: Array<any>;
  uploadFileList: Array<any>;
  AccountList: Array<any>;
  templateId: number
  templateText: string;
  constructor(
    private notification: NotificationService,
    private datePipe: DatePipe, private proofingService: ProofingService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      images: ['', Validators.required],
    })
    this.getAccountList();
  }

  getAccountList() {
    this.proofingService.getAccount_List()
      .subscribe((results: any) => {
        let data = results['data'];
        this.AccountList = data
        // console.log("DDDDDDDAAAAAAAAAA", data)
      })
  }

  getuploaddata($event) {
    // console.log("getuploaddata button is clicked!", $event);
    this.proofingService.get_uploaddata(this.tempId, this.accountid)
      .subscribe((results: any) => {
        let data = results['data'];
        this.proofingList = data;
        // console.log('this.proofingList', this.proofingList)
      })
  }
  Approve($event) {
    // console.log("Approve button is clicked!", $event);
    let p_json: any = [];
    let accountjson: any = [];
    accountjson.push(this.accountid)
    // console.log('accountjson', accountjson);
    // let x = JSON.stringify(this.accountid)
    // console.log(this.accountid);
    p_json["id"] = accountjson
    // console.log('p_json', p_json);
    this.finaljson = JSON.stringify(Object.assign({}, p_json));
    this.proofingService.approveService(this.finaljson, "Approve")
      .subscribe(res => {
        // console.log("approve", res);
        this.notification.showSuccess("Approved successfully!")
      }
      )
  }


  getAccountTemplate(temp) {
    this.accountid = temp.id;
    this.templateId = temp.template.id;
    this.templateText = temp.template.file_type.text;

    // console.log("note", this.accountid);
    // console.log("notesss",  this.templateId );
    // console.log("BAAA",temp)

    return this.accountid, this.templateId
  }

  uploadDocument() {
    this.proofingService.uploadDocument(this.templateId, this.accountid, this.images)
      .subscribe((results: any) => {
        // console.log("UploadFile", results)
        this.notification.showSuccess("Upload Successfully!....")
        let file = results['data'];
        this.proofingList = file;
        // console.log("UploadFILESList", this.proofingList)
        this.uploadForm.reset();
      })
  }
  fileChange(file) {
    this.images = <File>file.target.files[0];
  }
  uploadPreview() {
    let preViewid = this.uploadFileList[0].id
    this.proofingService.uploadPreview(preViewid)
      .subscribe((response: any) => {
        let binaryData = [];
        binaryData.push(response)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Proofing.xlsx";
        link.click();
      })
  }


}
