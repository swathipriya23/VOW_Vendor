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

export interface documentListss {
  name: string;
  id: number;
}
@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  // bcp & due
  BCPQuestionnaireForm:FormGroup;
  DueDiligenceForm:FormGroup;
  bcplistdata = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }] 
  duelistdata = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }]
  bcpList: any;
  duediligenceList: any;
  orgname:any;


  DocumentEditForm:FormGroup
  Documentlist:Array<documentListss>
  isLoading=false;
  has_next = true;
  has_previous = true;
  documentEditId=0;
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
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  uploadList = [];
  images:string  []  =  [];
  comflag:any;
  
  @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  @ViewChild('docInput') docInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
 
  constructor(private formbuilder: FormBuilder,private notification: NotificationService,
  private router:Router,private toastr: ToastrService,private atmaService:AtmaService,
  private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
  private shareService:ShareService,public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
    let data: any = this.shareService.vendorViewHeaderName.value;
    this.vendorId = data.id;
    let getparticulardata:any = this.shareService.vendorViewHeaderName.value;
    console.log("getparticulardata",getparticulardata)
    this.comflag = getparticulardata.compliance_flag
    // this.orgname = getparticulardata.group.id
   
    
    this.DocumentEditForm = this.formbuilder.group({
     
      partner_id: [{'value':this.vendorId,disabled: true }],
      docgroup_id: [''], 
      period: new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      remarks: [''],
      file_name:['',[Validators.required]],
      })
    
     this.getDocumentEditForm()

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

// get bcp
getbcp_questionnaire() {
  this.atmaService.getBCP_questionnaire(this.vendorId)
  .subscribe(result => {
    console.log("get-bcp", result)
      let datass = result['data'];
      this.bcpList = datass;
      console.log("bcp", this.bcpList)
  })
} 

// get due
getdue_diligence() {
  this.atmaService.getDUE_diligence(this.vendorId)
  .subscribe(result => {
    console.log("get-due", result)
      let datass = result['data'];
      this.duediligenceList = datass;
      console.log("due", this.duediligenceList)
  })
}

show_BCPSummary:boolean;
show_DueSummary:boolean;
show_document = true;
BCP_Questionnaire(){
 this.show_BCPSummary = true;
 this.show_DueSummary = false;
 this.show_document = false;
 this.getbcp_questionnaire();
}

due_diligence(){
 this.show_BCPSummary = false;
 this.show_DueSummary = true;
 this.show_document = false;
  this.getdue_diligence();
}

document(){
 this.show_BCPSummary = false;
 this.show_DueSummary = false;
 this.show_document = true;
}
docgroupname(){
  let parentkeyvalue: String="";
    this.getParent(parentkeyvalue,this.vendorId);
    this.DocumentEditForm.get('docgroup_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.atmaService.get_parentScroll_doc(value,this.vendorId,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Documentlist = datas;
      console.log("Documentlist", datas)
    })
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



  getDocumentEditForm() {
    let data :any= this.shareService.documentEdit.value;
    console.log("da",data)
    for(var i=1;i<data.file_id.length;i++){
      this.FileId=data.file_id[i].id;
     }
    
    this.atmaService.getdocumentEdit(data,this.vendorId)
        .subscribe((result:any) => {
    this.documentEditId = result.id;
    let Partner_Id=result.partner_id;
    let doc=result.docgroup_id;
    let Period=result.period;
    let Remarks=result.remarks;
    this.fileList=result.file_id
    
    
    this.DocumentEditForm.patchValue({
      partner_id:Partner_Id,
      docgroup_id:doc,
      period: Period,
      remarks:Remarks,
      file_name:this.fileList
      })
  })
  }
  createFormat() {
    let data = this.DocumentEditForm.controls;
    let objdocument = new documents();
    // let documentEditId=data.id;
    objdocument.id=this.documentEditId;
    objdocument.partner_id = data['partner_id'].value;
    objdocument.docgroup_id = data.docgroup_id.value.id;
    objdocument.period = data['period'].value;
    // objdocument.remarks = data['remarks'].value;
    objdocument.file_name=data['file_name'].value;

    var str = data['remarks'].value
    var cleanStr_rmk=str.trim();//trim() returns string with outer spaces removed
    objdocument.remarks = cleanStr_rmk

    return objdocument;
  }




  
    // bcp submit form
    bcp_submitForm(){

      console.log("bcp",this.bcpList)

      for(let i=0;i<this.bcpList.length;i++)
      {
        if(this.bcpList[i].ans_bool == ""){
          this.toastr.error('Please Fill Yes/No');
          this.SpinnerService.hide();
          return false;
        }
        
      }
      
      this.atmaService.createBCPForm(this.vendorId,this.bcpList)
    .subscribe(result => {
      console.log("result", result);

      if (result.status == "success") {
        this.notification.showSuccess("Updated Successfully!...")
        this.getbcp_questionnaire();
        // this.SpinnerService.hide();
        // this.onSubmit.emit();
      } else {
        this.notification.showError(result.description)
        // this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
    }


    
    // due submit form
    due_submitForm(){
      console.log("due",this.duediligenceList)
        
      for(let i=0;i<this.duediligenceList.length;i++)
      {
        if(this.duediligenceList[i].direction == ""){
          this.toastr.error('Please Fill Direction No');
          this.SpinnerService.hide();
          return false;
        }
        
      }
      this.atmaService.createDUEForm(this.vendorId,this.duediligenceList)
    .subscribe(result => {
      console.log("result", result);

      if (result.status == "success") {
        this.notification.showSuccess("Updated Successfully!...")
        this.getdue_diligence();
        // this.SpinnerService.hide();
        // this.onSubmit.emit();
      } else {
        this.notification.showError(result.description)
        // this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
    }

  documentEditCreateForm() {
    this.SpinnerService.show();
    if (this.DocumentEditForm.value.docgroup_id.id==undefined||this.DocumentEditForm.value.docgroup_id.id<=0){
      this.toastr.error('Please Select DocumentGroup Name');
      this.SpinnerService.hide();
      return false;
    }
  
    
    if (this.DocumentEditForm.value.period ===""){
      this.toastr.error('Please Enter Period');
      this.SpinnerService.hide();
      return false;
    }
   
   
    this.atmaService.documentEditCreateForm(this.vendorId,this.createFormat(),this.images)
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
        // if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        //   this.notification.showWarning("Duplicate Code & Name ...")
        //   this.documentEditButton = false;
        // } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        //   this.notification.showError("INVALID_DATA!...")
        //   this.documentEditButton = false;
        // } else {
        //   this.notification.showSuccess("Saved Successfully!...")
        //   this.onSubmit.emit();
         
         
        // }
        
        
        // return true
       
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  
  public displayFnparent(parenttype?: documentListss): string | undefined {
    //  console.log('id',parenttype.id);
    //  console.log('name',parenttype.name);
    return parenttype ? parenttype.name : undefined;
  }
  
  get parenttype() {
    return this.DocumentEditForm.get('docgroup_id');
  }
  
  private getParent(parentkeyvalue,vendorId) {
    this.atmaService.getParentDropDown_doc(parentkeyvalue,vendorId)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Documentlist = datas;
        console.log("prnt", datas)
        
      })

      
  }
  
  parentScroll() {
    setTimeout(() => {
    if (
    this.matdocAutocomplete &&
    this.matdocAutocomplete &&
    this.matdocAutocomplete.panel
    ) {
    fromEvent(this.matdocAutocomplete.panel.nativeElement, 'scroll')
    .pipe(
    map(x => this.matdocAutocomplete.panel.nativeElement.scrollTop),
    takeUntil(this.autocompleteTrigger.panelClosingActions)
    )
    .subscribe(x => {
    const scrollTop = this.matdocAutocomplete.panel.nativeElement.scrollTop;
    const scrollHeight = this.matdocAutocomplete.panel.nativeElement.scrollHeight;
    const elementHeight = this.matdocAutocomplete.panel.nativeElement.clientHeight;
    const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    if (atBottom) {
    if (this.has_next === true) {
    this.atmaService.get_parentScroll_doc(this.docInput.nativeElement.value, this.vendorId,this.currentpage + 1)
    .subscribe((results: any[]) => {
    let datas = results["data"];
    let datapagination = results["pagination"];
    this.Documentlist = this.Documentlist.concat(datas);
    if (this.Documentlist.length >= 0) {
    this.has_next = datapagination.has_next;
    this.has_previous = datapagination.has_previous;
    this.currentpage = datapagination.index;
    }
    })
    }
    }
    });
    }
    });
    }

    
  onCancelClick() {
     this.onCancel.emit()
    }

  fileChange(event) {
    let imagesList = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
  // this.InputVar.nativeElement.value = '';
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
    partner_id: number;
    docgroup_id: any;
    period: any;
    remarks: any;
    file_id:any;
    file_name:String;
    
  }

