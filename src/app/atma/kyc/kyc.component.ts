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

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent implements OnInit {
  kycform:FormGroup;
  // Documentlist:Array<documentListss>;
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
  
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  uploadList = [];
  images:string  []  =  [];
  orgname:any;
  keyname: any;
  individualList = [];
  soleProprietorList = [];
  publicListedList = [];
  publicUnListedList = [];
  sanction = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }] 
  matchfound = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }]
  @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  @ViewChild('docInput') docInput: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();


  constructor(private formBuilder: FormBuilder,private notification:NotificationService,
    private toastr: ToastrService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private router:Router,private atmaService:AtmaService,private shareService: ShareService
    ) { }

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
    this.kycform=this.formBuilder.group({
      kyc_entity: [''],
      organization_name: [''],
      authorised_signatories:[''],
      beneficial_owners:[''],
      sanctions_conducted: [''],
      match_found: [''],
    })
 }

//  addKYC() {
//   let kyc_bene = this.kycform.value.kyc_beneficial
//   let kyc_dire = this.kycform.value.kyc_director
//   let kyc_indi = this.kycform.value.organization_name
//   let kyc_enty = this.kycform.value.kyc_entity
//   let kyc_sole = this.kycform.value.kyc_sole_propri
//   let kyc_auth = this.kycform.value.kyc_authorised
//   let kyc_san = this.kycform.value.kyc_sanctions_screening
//   let kyc_matchfd = this.kycform.value.kyc_d_match
//   // for individual
//   if(this.orgname == "Individual"){
//     if (kyc_indi == ""){
//       this.notification.showWarning("Please Enter Individual")
//     }
//     else if (kyc_san ==""){
//       this.notification.showWarning("Please Fill Sanctions Screening Conducted")
//     }
//         else if (kyc_matchfd == ""){
//           this.notification.showWarning("Please Fill Match Found")
//         }
        
//          else {
//           let data = {
//             kyc_indivi: kyc_indi,
//             kyc_sanctions_screening:kyc_san,
//             kyc_d_match:kyc_matchfd,
//             attachment: this.images
//           }
//             this.individualList.push(data);
//             console.log("array", this.individualList)
//             this.kycform.controls["kyc_indivi"].reset('');
//             this.kycform.controls["kyc_sanctions_screening"].reset('');
//             this.kycform.controls["kyc_d_match"].reset('');
//             // this.kycform.controls.kyc.get('kyc_indivi').reset('');
//             // this.kycform.controls.kyc.get('kyc_sanctions_screening').reset('');
//             // this.kycform.controls.kyc.get('kyc_d_match').reset(''); 
//             this.images = [];
//             this.fileInput.nativeElement.value = ""
//         }
//   }
  
//   // for sole
//   if(this.orgname == "Sole Proprietorship"){
//     if (kyc_enty == ""){
//       this.notification.showWarning("Please Fill Entity")
//     }
//     else if (kyc_sole == ""){
//       this.notification.showWarning("Please Fill Soleproprietor")
//     } 
//     else if (kyc_san ==""){
//       this.notification.showWarning("Please Fill Sanctions Screening Conducted")
//     }
//         else if (kyc_matchfd == ""){
//           this.notification.showWarning("Please Fill Match Found")
//         }
        
//          else {
//           let data = {
//             kyc_entity: kyc_enty,
//             kyc_sole_propri: kyc_sole,
//             kyc_sanctions_screening:kyc_san,
//             kyc_d_match:kyc_matchfd,
//             attachment: this.images
//           }
//             this.soleProprietorList.push(data);
//             console.log("array", this.soleProprietorList)
//             // this.vendorAddForm.controls.kyc.get('kyc_entity').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_sole_propri').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_sanctions_screening').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_d_match').reset(''); 
//             this.kycform.controls["kyc_entity"].reset('');
//             this.kycform.controls["kyc_sole_propri"].reset('');
//             this.kycform.controls["kyc_sanctions_screening"].reset('');
//             this.kycform.controls["kyc_d_match"].reset('');
//             this.images = [];
//             this.fileInput.nativeElement.value = ""
//         }
//   }
 
//   // for public list company
//   if(this.orgname == "Public Limited (listed)"){
//     if (kyc_enty == ""){
//       this.notification.showWarning("Please Fill Entity")
//     }
//     else if (kyc_dire == ""){
//       this.notification.showWarning("Please Fill Directors")
//     } else if (kyc_auth == ""){
//       this.notification.showWarning("Please Fill Authorised Signatories")
//     }
//     else if (kyc_san ==""){
//       this.notification.showWarning("Please Fill Sanctions Screening Conducted")
//     }
//         else if (kyc_matchfd == ""){
//           this.notification.showWarning("Please Fill Match Found")
//         }
        
//          else {
//           let data = {
//             kyc_entity: kyc_enty,
//             kyc_director: kyc_dire,
//             kyc_authorised: kyc_auth,
//             kyc_sanctions_screening:kyc_san,
//             kyc_d_match:kyc_matchfd,
//             attachment: this.images
//           }
//             this.publicListedList.push(data);
//             console.log("array", this.publicListedList)
//             // this.vendorAddForm.controls.kyc.get('kyc_entity').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_director').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_authorised').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_sanctions_screening').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_d_match').reset(''); 
//             this.kycform.controls["kyc_entity"].reset('');
//             this.kycform.controls["kyc_director"].reset('');
//             this.kycform.controls["kyc_authorised"].reset('');
//             this.kycform.controls["kyc_sanctions_screening"].reset('');
//             this.kycform.controls["kyc_d_match"].reset('');
//             this.images = [];
//             this.fileInput.nativeElement.value = ""
//         }
//   }
  
//   // for LLP company
//    if((this.orgname !="Individual" && this.orgname != "Sole Proprietorship" && this.orgname != "Public Limited (listed)")){
//     if (kyc_enty == ""){
//       this.notification.showWarning("Please Fill Entity")
//     }
//     else if (kyc_dire == ""){
//       this.notification.showWarning("Please Fill Directors")
//     } else if (kyc_auth == ""){
//       this.notification.showWarning("Please Fill Authorised Signatories")
//     }
//     else if (kyc_bene == ""){
//       this.notification.showWarning("Please Fill Beneficial Owners")
//     } 
//     else if (kyc_san ==""){
//       this.notification.showWarning("Please Fill Sanctions Screening Conducted")
//     }
//         else if (kyc_matchfd == ""){
//           this.notification.showWarning("Please Fill Match Found")
//         }
        
//          else {
//           let data = {
//             kyc_entity: kyc_enty,
//             kyc_director: kyc_dire,
//             kyc_authorised: kyc_auth,
//             kyc_beneficial: kyc_bene,
//             kyc_sanctions_screening:kyc_san,
//             kyc_d_match:kyc_matchfd,
//             attachment: this.images
//           }
//             this.publicUnListedList.push(data);
//             console.log("array", this.publicUnListedList)
//             // this.vendorAddForm.controls.kyc.get('kyc_entity').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_director').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_authorised').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_beneficial').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_sanctions_screening').reset('');
//             // this.vendorAddForm.controls.kyc.get('kyc_d_match').reset(''); 
//             this.kycform.controls["kyc_entity"].reset('');
//             this.kycform.controls["kyc_director"].reset('');
//             this.kycform.controls["kyc_authorised"].reset('');
//             this.kycform.controls["kyc_beneficial"].reset('');
//             this.kycform.controls["kyc_sanctions_screening"].reset('');
//             this.kycform.controls["kyc_d_match"].reset('');
//             this.images = [];
//             this.fileInput.nativeElement.value = ""
//         }

//    }
   
// }


kycFunctionList =[];
addKYC(){
  if (this.kycform.value.kyc_entity ===""){
    this.toastr.error('Please Fill Entity');
    return false;
  }
  if (this.kycform.value.organization_name == ""){
    if(this.orgname == "Individual"){
      this.toastr.error("Please Fill Individual");
    }
    if(this.orgname == "Sole Proprietorship"){
      this.toastr.error("Please Fill Sole Proprietor");
    }
    if(this.orgname != "Individual" && this.orgname != "Sole Proprietorship"){
      this.toastr.error("Please Fill Directors");
    }
    return false;
    
  }
  if((this.orgname != "Individual" && this.orgname != "Sole Proprietorship")){
    if (this.kycform.value.authorised_signatories == ""){
      this.toastr.error("Please Fill Authorised Signatories");
      return false;
    }
  }
  if((this.orgname != "Individual" && this.orgname != "Sole Proprietorship" && this.orgname != "Public Limited (listed)")){
    if (this.kycform.value.beneficial_owners == ""){
      this.toastr.error("Please Fill Beneficial Owners");
      return false;
    }
  }
  
  if (this.kycform.value.sanctions_conducted ==""){
    this.toastr.error("Please Fill Sanctions Screening Conducted");
    return false;
  }
  if (this.kycform.value.match_found == ""){
    this.toastr.error("Please Fill Match Found");
    return false;
  }

  if(this.images.length == 0){
    this.toastr.error('', 'Choose Upload Files ', { timeOut: 1500 });
    return false;
  }
   
 let dataArray = this.kycform.value
 let data ={
  kyc_entity: dataArray.kyc_entity,
  organization_name: dataArray.organization_name,
  authorised_signatories: dataArray.authorised_signatories,
  beneficial_owners: dataArray.beneficial_owners,
  sanctions_conducted: dataArray.sanctions_conducted,
  match_found: dataArray.match_found,
  // attachment: "",
  filekey: this.images
 }
 
 
 console.log("dataArray",data)
 this.kycFunctionList.push(data)
 console.log("array",this.kycFunctionList)  

 this.kycform.controls["kyc_entity"].reset('');
 this.kycform.controls["organization_name"].reset('');
 this.kycform.controls["authorised_signatories"].reset('');
 this.kycform.controls["beneficial_owners"].reset('');
 this.kycform.controls["sanctions_conducted"].reset('');
 this.kycform.controls["match_found"].reset('');
 this.images = [];
 this.fileInput.nativeElement.value = ""
  }


kycListDelete(index: number) {
    this.kycFunctionList.splice(index, 1);
    console.log("delete",this.kycFunctionList)
  }
  // //individual delete
  // individualNameDelete(index: number) {
  //   this.individualList.splice(index, 1);
  // }
  // //sole delete
  // soleNameDelete(index: number) {
  //   this.soleProprietorList.splice(index, 1);
  // } 
  //  //public list company delete
  //  public_listedNameDelete(index: number) {
  //   this.publicListedList.splice(index, 1);
  // }
  // //public un-list company delete
  // public_unlistedNameDelete(index: number) {
  //   this.publicUnListedList.splice(index, 1);
  // }

  submitForm() {
    this.SpinnerService.show();
    console.log("submit", this.kycFunctionList)

    if(this.kycFunctionList.length == 0){
      this.toastr.error('Please Fill All Details');
      this.SpinnerService.hide();
      return false;
    }

    let count= 0
    // for(let i=0;i<this.docFunctionList.length;i++)
    // {
    //   this.docFunctionList[i].attachment = 'file' + count++
    // }
    // console.log("ffff", this.docFunctionList)


    for(let i=0;i<this.kycFunctionList.length;i++)
    {
      if(this.kycFunctionList[i].sanctions_conducted.id != undefined){
        this.kycFunctionList[i].sanctions_conducted =this.kycFunctionList[i].sanctions_conducted.id;
      }
      if(this.kycFunctionList[i].match_found.id != undefined){
        this.kycFunctionList[i].match_found =this.kycFunctionList[i].match_found.id;
      }
    }
    console.log("list", this.kycFunctionList)


    let dataset = this.kycFunctionList
    const formData: FormData = new FormData();
    let datavalue = JSON.stringify(dataset)
    formData.append('kyc_details', datavalue);

    for(let i=0;i<this.kycFunctionList.length;i++)
    {
      let string_value:any = count++
      let file_list = this.kycFunctionList[i].filekey
      for (let individual in file_list) {
        formData.append(string_value, file_list[individual])
      }

    }
    
    this.atmaService.createKYCForm(this.vendorId,formData)
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
 
  
    fileChange(event) {
      this.images = [];
      for (var i = 0; i < event.target.files.length; i++) {
        this.images.push(event.target.files[i]);
      }
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
