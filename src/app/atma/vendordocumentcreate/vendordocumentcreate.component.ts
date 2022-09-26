import { Component, OnInit,Output,ElementRef, EventEmitter,ViewChild } from '@angular/core';
import {FormGroup,FormBuilder,FormControl, Validators, FormArray} from '@angular/forms';
import {AtmaService} from '../atma.service';
import { MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent} from 'rxjs';
import { ShareService } from '../share.service';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime,map,takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
export interface documentListss {
  name: string;
  id: number;
}


@Component({
  selector: 'app-vendordocumentcreate',
  templateUrl: './vendordocumentcreate.component.html',
  styleUrls: ['./vendordocumentcreate.component.scss']
})
export class VendordocumentcreateComponent implements OnInit {

// bcp & due
  BCPQuestionnaireForm:FormGroup;
  DueDiligenceForm:FormGroup;
  bcplistdata = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }] 
  duelistdata = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }]
  bcpList: any;
  duediligenceList: any;
  orgname:any;
  
  DocumentAddForm:FormGroup;
  docformarr:FormGroup;
  Documentlist:Array<documentListss>;
  fileList:Array<any>;
  attachments:Array<any>;
  isLoading=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  file:string;
  i:number;
  vendorId:number;
  documentButton=false;
  comflag:any;
  
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  uploadList = [];
  images:string  []  =  [];
  @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  @ViewChild('docInput') docInput: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();


  constructor(private formBuilder: FormBuilder,private notification:NotificationService,
    private toastr: ToastrService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private router:Router,private atmaService:AtmaService,private shareService: ShareService,
    ) { }

  ngOnInit(): void {
    
    let data: any = this.shareService.vendorID.value;
    console.log("vendor document data view create POPUP====>", data)
    this.vendorId = data;
    let getparticulardata:any = this.shareService.vendorViewHeaderName.value;
    console.log("getparticulardata",getparticulardata)
    // this.orgname = getparticulardata.group.id
    this.comflag = getparticulardata.compliance_flag
    
    this.docformarr=this.formBuilder.group({
       partner_id: [{'value':this.vendorId,disabled: true }],
      docgroup_id: [''], 
      period: new FormControl('',[Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      remarks: [''],
    })

    // let parentkeyvalue: String="";
    // this.getParent(parentkeyvalue);
    // this.DocumentAddForm.get('docgroup_id').valueChanges
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


    // this.BCPQuestionnaireForm = this.formBuilder.group({
    //   is_salary_credited: ['', Validators.required],
    //   is_esi_esf_remitted: ['', Validators.required],
    //   is_staisfied: ['', Validators.required],
    //   is_overtime: [''],
    //   overtime: [''],
    //   overtime_reason: [''],
    //   is_sleeping: [''],
    //   is_leave: [''],
    //   is_armedId: [''],
    //   is_overtimeunarmed: [''],
    //   overtimeunarmed: [''],
    //   overtime_reasonunarmed: [''],
    //   is_sleepingunarmed: [''],
    //   is_leaveunarmed: [''],
    //   is_unarmedId: [''],
    // })

    // this.DueDiligenceForm  = this.formBuilder.group ({

    // })
 }
//  public get htmlProperty() : SafeHtml {
//   return this._sanitizer.sanitize(SecurityContext.HTML, this._htmlProperty);
// }
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

 docFunctionList =[];
 adddocformarray(){
   if (this.docformarr.value.docgroup_id.id==undefined||this.docformarr.value.docgroup_id.id<=0  ){
      this.toastr.error('Please Select DocumentGroup Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.docformarr.value.period ===""){
      this.toastr.error('Please Enter Period');
      this.SpinnerService.hide();
      return false;
    }
    if(this.images.length == 0){
      this.toastr.error('', 'Choose Upload Files ', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false;
    }
 let dataArray = this.docformarr.value
 let data ={
  partner_id: this.vendorId,
  docgroup_id: dataArray.docgroup_id,
  period: dataArray.period,
  remarks: dataArray.remarks,
  attachment: "",
  filekey: this.images
 }
 
 console.log("dataArray",data)
 this.docFunctionList.push(data)
 console.log("array",this.docFunctionList)  

 this.docformarr.controls["period"].reset('');
 this.docformarr.controls["remarks"].reset('');
 this.docformarr.controls["docgroup_id"].reset('');
 this.images = [];
 this.fileInput.nativeElement.value = ""
  }


  docListDelete(index: number) {
    this.docFunctionList.splice(index, 1);
    console.log("delete",this.docFunctionList)
  }



 docgroupname(){
  let parentkeyvalue: String="";
  this.getParent(parentkeyvalue,this.vendorId);
  this.docformarr.get('docgroup_id').valueChanges
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
createFormat() {
    // let data = this.DocumentAddForm.controls;
    // let objdocument = new document();
    // objdocument.partner_id = data['partner_id'].value;
    // objdocument.docgroup_id = data['docgroup_id'].value.id;
    // objdocument.period = data['period'].value;
    // // objdocument.remarks = data['remarks'].value;

    // var str = data['remarks'].value
    // var cleanStr_rmk=str.trim();//trim() returns string with outer spaces removed
    // objdocument.remarks = cleanStr_rmk


    // return objdocument; 
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
        this.notification.showSuccess("Saved Successfully!...")
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
        this.notification.showSuccess("Saved Successfully!...")
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


  submitForm() {
    this.SpinnerService.show();
    console.log("submit", this.docFunctionList)

    if(this.docFunctionList.length == 0){
      this.toastr.error('Please Fill All Details');
      this.SpinnerService.hide();
      return false;
    }

    let count= 1
    for(let i=0;i<this.docFunctionList.length;i++)
    {
      this.docFunctionList[i].attachment = 'file' + count++
    }
    console.log("ffff", this.docFunctionList)


    for(let i=0;i<this.docFunctionList.length;i++)
    {
      if(this.docFunctionList[i].docgroup_id.id != undefined){
        this.docFunctionList[i].docgroup_id =this.docFunctionList[i].docgroup_id.id;
      }
    }
    console.log("docgp", this.docFunctionList)


    let dataset = this.docFunctionList
    const formData: FormData = new FormData();
    let datavalue = JSON.stringify(dataset)
    formData.append('data', datavalue);

    for(let i=0;i<this.docFunctionList.length;i++)
    {
      let string_value = this.docFunctionList[i].attachment
      let file_list = this.docFunctionList[i].filekey
      for (let individual in file_list) {
        formData.append(string_value, file_list[individual])
      }

    }



    
    // if (this.DocumentAddForm.value.docgroup_id.id==undefined||this.DocumentAddForm.value.docgroup_id.id<=0  ){
    //   this.toastr.error('Please Select DocumentGroup Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.DocumentAddForm.value.period ===""){
    //   this.toastr.error('Please Enter Period');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    
    
    this.atmaService.createDocumentForm(this.vendorId,formData)
    .subscribe(result => {
      console.log("result", result);

      if (result.status == "success") {
        this.notification.showSuccess("Saved Successfully!...")
        this.SpinnerService.hide();
        this.onSubmit.emit();
      } else {
        this.notification.showError(result.description)
        this.SpinnerService.hide();
        return false;
      }

      //  if(result.id === undefined){
      //   this.notification.showError(result.description)
      //   this.SpinnerService.hide();
      //   return false;
      // }
      // else{
      //   this.notification.showSuccess("Saved Successfully!...")
      //   this.SpinnerService.hide();
      //   this.onSubmit.emit();
      // }
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
    return this.docformarr.get('docgroup_id');
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
    if (this.Documentlist.length >= 0) {
    this.Documentlist = this.Documentlist.concat(datas);
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
    fileChange(event) {
      // let imagesList = [];
      this.images = [];
      for (var i = 0; i < event.target.files.length; i++) {
        this.images.push(event.target.files[i]);
      }
    //   this.InputVar.nativeElement.value = '';
		// imagesList.push(this.images);
		// this.uploadList = [];
		// imagesList.forEach((item) => {
		// 	let s = item;
		// 	s.forEach((it) => {
		// 		let io = it.name;
		// 		this.uploadList.push(io);
		// 	});
    // });
      }

      showimageHeaderPreviewPDF:boolean
      showimageHeaderPreview:boolean
      jpgUrls:any;
      pdfurl:any;
      fileview(files) {
        console.log("file data to view ", files)
        let stringValue = files.name.split('.')
        if (stringValue[1] === "PNG" || stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" || stringValue[1] === "JPG" || stringValue[1] === "JPEG") {
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
     
    deleteUpload(s, index) {
      this.uploadList.forEach((s, i) => {
        if (index === i) {
          this.uploadList.splice(index, 1)
          this.images.splice(index, 1);
        }
      })
    }
  onCancelClick() {
  this.onCancel.emit()
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if ((charCode < 45 || charCode >46)  && (charCode < 48 || charCode > 57) ){ 
      return false;
      }
      return true;
    }
      

 }
class document {
  partner_id: number;
  docgroup_id: any;
  period: any;
  remarks: any;
  
}