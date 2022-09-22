import { Component, OnInit,Output,ElementRef, EventEmitter,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators, } from '@angular/forms';
import {NotificationService} from '../../service/notification.service'
import {Router} from '@angular/router';
import {AtmaService} from '../atma.service';
import { MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { fromEvent} from 'rxjs';
import { ShareService } from '../share.service';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime,map,takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-kyc-edit',
  templateUrl: './kyc-edit.component.html',
  styleUrls: ['./kyc-edit.component.scss']
})
export class KycEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  kycEditForm:FormGroup
  isLoading=false;
  has_next = true;
  has_previous = true;
  kycEditId=0;
  currentpage: number = 1;
  file:string;
  filesid:number;
  vendorId:number;
  FileId:number;
  Filename:string;
  filesnames:string;
  FileName:string;
  fileList=[];
  documentEditButton = false;
  
  totalData:any;
  sanction = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }] 
  matchfound = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }]
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  uploadList = [];
  images:string  []  =  [];
  orgname:any;
  keyname:any;
  
  @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  @ViewChild('docInput') docInput: any;
 
  constructor(private formbuilder: FormBuilder,private notification: NotificationService,
  private router:Router,private toastr: ToastrService,private atmaService:AtmaService,
  private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
  private shareService:ShareService,public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
    let data: any = this.shareService.vendorView.value;
    this.vendorId = data.id;
    let getparticulardata:any = this.shareService.vendorViewHeaderName.value;
    console.log("getparticulardata",getparticulardata)
    // this.orgname = getparticulardata.orgtype.text
    this.orgname = getparticulardata.kyc_org
    if(this.orgname == "Individual"){
      this.keyname = 'Individual'
    } if(this.orgname == "Sole Proprietorship"){
      this.keyname = 'Sole Proprietor'
    } if(this.orgname != "Individual" && this.orgname != "Sole Proprietorship"){
      this.keyname = 'Directors'
    }

    this.kycEditForm=this.formbuilder.group({
      kyc_entity: [''],
      organization_name: [''],
      authorised_signatories:[''],
      beneficial_owners:[''],
      sanctions_conducted: [''],
      match_found: [''],
      file_name: ['']
    })
    
     this.getKYCEditForm()

    // let parentkeyvalue: String="";
    // this.getParent(parentkeyvalue);
    // this.DocumentEditForm.get('docgroup_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //       console.log('inside tap')
          
    //   }),

    //   switchMap(value => this.atmaService.get_parentScroll(value,1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.Documentlist = datas;
    //   console.log("Documentlist", datas)
    // })
}


data(datas){
  let values=datas.id
  this.atmaService .downloadfile(values)
 }

fileDeletes(data,index:number){
  let value = data.id
  console.log("filedel", value)
  this.atmaService .deletefile(value)
  .subscribe(result =>  {
   this.notification.showSuccess("Deleted....")
   this.fileList.splice(index, 1);
  
  })

}


  showimageHeaderAPI: boolean
  showimagepdf: boolean
  tokenValues: any
  imageViews: boolean
  pdfViews: boolean
  pdfurl: any
  jpgUrls: string;
  fileextension:any;
  showPopupImages: boolean = true
  imageUrl = environment.apiURL
  docUpdateFile(id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "PNG"|| stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" || stringValue[1] === "JPG" || stringValue[1] === "JPEG") {

        this.showimageHeaderAPI = true
        this.showimagepdf = false
        this.jpgUrls = this.imageUrl + "venserv/view_attactments/" + id + "?token=" + token;
    }
   else  if (stringValue[1] === "pdf") {
      this.showimagepdf = true
      this.showimageHeaderAPI = false
      this.atmaService.pdfPopup_docupdate(id)
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
    else{
      this.showimagepdf = false
      this.showimageHeaderAPI = false
      this.fileDownload(id, file_name)
    }
  }


  fileDownload(id, fileName) {
    this.atmaService.fileDownload_docupdate(id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }



  showimageHeaderPreviewPDF:boolean
  showimageHeaderPreview:boolean
  previewjpgUrls:any;
  previewpdfurl:any;
  fileview(files) {
    console.log("file data to view ", files)
    let stringValue = files.name.split('.')
    if (stringValue[1] === "PNG" || stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" || stringValue[1] === "JPG" || stringValue[1] === "JPEG") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.previewjpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.previewpdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }
  }



  getKYCEditForm() {
    let data :any= this.shareService.kycEdit.value;
    console.log("kyc edit",data)
    // for(var i=1;i<data.file_id.length;i++){
    //   this.FileId=data.file_id[i].id;
    //  }
    
    this.atmaService.getkycEdit(data,this.vendorId)
        .subscribe((result:any) => {
    this.kycEditId = result.id;
    let kyc_ent =result.kyc_entity;
    let org=result.organization_name;
    let auth=result.authorised_signatories;
    let bene=result.beneficial_owners;
    let san=result.sanctions_conducted.id;
    let match=result.match_found.id;
    this.fileList=result.report_file_id
    
    
    this.kycEditForm.patchValue({
      // partner_id:Partner_Id,
      // docgroup_id:doc,
      // period: Period,
      // remarks:Remarks,
      // file_name:this.fileList
      kyc_entity: kyc_ent,
      organization_name: org,
      authorised_signatories:auth,
      beneficial_owners:bene,
      sanctions_conducted: san,
      match_found: match,
      file_name:this.fileList
      })
  })
  }
  createFormat() {
    let data = this.kycEditForm.controls;
    let objdocument = new documents();
    // let documentEditId=data.id;
    objdocument.id=this.kycEditId;
    // objdocument.kyc_entity = data['kyc_entity'].value;
    // objdocument.organization_name = data['organization_name'].value;
    // objdocument.authorised_signatories = data['authorised_signatories'].value;
    // objdocument.beneficial_owners = data['beneficial_owners'].value;
    objdocument.sanctions_conducted = data['sanctions_conducted'].value;
    objdocument.match_found = data['match_found'].value;
    // objdocument.remarks = data['remarks'].value;
    objdocument.file_name=data['file_name'].value;

    if(data['kyc_entity'].value !=null){
      var str = data['kyc_entity'].value
      var cleanStr_kyc=str.trim();//trim() returns string with outer spaces removed
      objdocument.kyc_entity = cleanStr_kyc
    }
  
    if(data['organization_name'].value != null){
      var str = data['organization_name'].value
      var cleanStr_orgc=str.trim();//trim() returns string with outer spaces removed
      objdocument.organization_name = cleanStr_orgc
    }
   
    if(data['authorised_signatories'].value != null){
    var str = data['authorised_signatories'].value
    var cleanStr_aut=str.trim();//trim() returns string with outer spaces removed
    objdocument.authorised_signatories = cleanStr_aut
    }
    
    if(data['beneficial_owners'].value != null){
      var str = data['beneficial_owners'].value
      var cleanStr_bene=str.trim();//trim() returns string with outer spaces removed
      objdocument.beneficial_owners = cleanStr_bene
    }
   

    return objdocument;
  }

  kycEditCreateForm() {
    this.SpinnerService.show();
    if (this.kycEditForm.value.kyc_entity ===""){
      this.toastr.error('Please Fill Entity');
      this.SpinnerService.hide();
      return false;
    }
    if (this.kycEditForm.value.organization_name == ""){
      if(this.orgname == "Individual"){
        this.toastr.error("Please Fill Individual");
        this.SpinnerService.hide();
      }
      if(this.orgname == "Sole Proprietorship"){
        this.toastr.error("Please Fill Sole Proprietor");
        this.SpinnerService.hide();
      }
      if(this.orgname != "Individual" && this.orgname != "Sole Proprietorship"){
        this.toastr.error("Please Fill Directors");
        this.SpinnerService.hide();
      }
      return false;
      
    }
    if((this.orgname != "Individual" && this.orgname != "Sole Proprietorship")){
      if (this.kycEditForm.value.authorised_signatories == ""){
        this.toastr.error("Please Fill Authorised Signatories");
        this.SpinnerService.hide();
        return false;
      }
    }
    if((this.orgname != "Individual" && this.orgname != "Sole Proprietorship" && this.orgname != "Public Limited (listed)")){
      if (this.kycEditForm.value.beneficial_owners == ""){
        this.toastr.error("Please Fill Beneficial Owners");
        this.SpinnerService.hide();
        return false;
      }
    }
    
    if (this.kycEditForm.value.sanctions_conducted ==""){
      this.toastr.error("Please Fill Sanctions Screening Conducted");
      this.SpinnerService.hide();
      return false;
    }
    if (this.kycEditForm.value.match_found == ""){
      this.toastr.error("Please Fill Match Found");
      this.SpinnerService.hide();
      return false;
    }
   
   
    this.atmaService.kycEditCreateForm(this.vendorId,this.createFormat(),this.images)
      .subscribe(result => {
        console.log("documentedit", result)
        if(result.id === undefined){
          this.notification.showError(result.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("Updated Successfully!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }       
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  

    
  onCancelClick() {
     this.onCancel.emit()
    }

  fileChange(event) {
    let imagesList = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
  this.InputVar.nativeElement.value = '';
  imagesList.push(this.images);
  this.uploadList = [];
  imagesList.forEach((item) => {
    let s = item;
    s.forEach((it) => {
      let io = it.name;
      this.uploadList.push(io);
    });
  });
    }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.images.splice(index, 1);
      }
    })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 45 || charCode >46)  && (charCode < 48 || charCode > 57) ){ 
    return false;
    }
    return true;
  }

  namevalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-/  ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addressvalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}

class documents {
  id:any;
  kyc_entity: any;
  organization_name: any;
  authorised_signatories:any;
  beneficial_owners:any;
  sanctions_conducted: any;
  match_found: any;
  file_id:any;
  file_name:String;
  
}