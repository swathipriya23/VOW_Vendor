import { Component, OnInit,EventEmitter,Output,ViewChild,ElementRef } from '@angular/core';
import { FormGroup,FormBuilder, FormArray, FormControl } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import {JvService} from '../jv.service';
import { NotificationService } from '../notification.service';
import {ExceptionHandlingService} from '../exception-handling.service';
import { NgxSpinnerService } from "ngx-spinner";




export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}



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
  selector: 'app-jv-upload',
  templateUrl: './jv-upload.component.html',
  styleUrls: ['./jv-upload.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class JvUploadComponent implements OnInit {

  JVcreationForm:FormGroup
  TypeList:any
  sum:any
  jvamt:any
  @Output() linesChange = new EventEmitter<any>();

  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  Branchlist: Array<branchListss>;

  formData: any = new FormData();
  file_length:number = 0
  list:any
  fileextension:any
  totalcounts:any
  base64textString =[]
  fileData:any
  pdfimgview:any
  file_ext: any = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image'];
  images: string[] = [];
  showreasonattach: boolean = true;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  // totalcount = 1
  today = new Date()
  uploadeddata:any
  jvdetaildata:any[]=[]
  @ViewChild('fileInputs', { static: false }) InputVar: ElementRef;
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  showjv = false
  
  creditsum:any
  debitsum:any
  totalcount:any

  constructor(private fb:FormBuilder,private datePipe: DatePipe,private jvservice:JvService,
    private notification:NotificationService,private errorHandler:ExceptionHandlingService,
    private spinnerservice:NgxSpinnerService) { }

  ngOnInit(): void {
    this.JVcreationForm = this.fb.group({
      jetype:[''],
      jemode:[''],
      jetransactiondate:[''],
      jebranch:[''],
      jecrno:[''],
      jerefno:[''],
      jedescription:[''],
      jeamount:[''],
      jestatus:[''],
      filekeys:new FormArray([]),
      filevalue:new FormArray([])

      

    })

    this.getjournaltype()

    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.JVcreationForm.get('jebranch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.jvservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
        // console.log("Branchlist", datas)
      })



  }

  getbranchdropdown(){
    this.branchdropdown('');
  }

  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;

  }

  get branchtyperole() {
    return this.JVcreationForm.get('jebranch');
  }


  branchdropdown(branchkeyvalue) {
    this.jvservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
      if(results){
        let datas = results["data"];
        this.Branchlist = datas;
      }

      })
  }

  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.jvservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
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
  uplimage:any [] = []
  uploadList = []
  fileupload(event){
    let imagesList = [];
    for (var i = 0; i < event?.target?.files?.length; i++) {
      if(event?.target?.files?.length > 1){
        this.notification.showError("Please Upload Only One File");
        this.InputVar.nativeElement.value = '';
        return false
      }
      this.uplimage.push(event?.target?.files[i]);
      this.JVcreationForm?.value?.filekeys?.push(event?.target?.files[i])
    }
    this.InputVar.nativeElement.value = '';
    imagesList.push(this.uplimage);
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
        this.uplimage.splice(index, 1);
        this.JVcreationForm?.value?.filekeys?.splice(index,1)
        this.uploadeddata = []
        this.creditsum = ''
        this.debitsum = ''
        this.totalcount = ''
      }
    })
  }

  uplimages:any [] = []
  uploadLists = []
  fileuploads(event){
    let imagesLists = [];
    for (var i = 0; i < event?.target?.files?.length; i++) {
      this.uplimages.push(event?.target?.files[i]);
      this.JVcreationForm?.value?.filevalue?.push(event?.target?.files[i])
     
    }
    this.InputVars.nativeElement.value = '';
    imagesLists.push(this.uplimages);
    this.uploadLists = [];
    imagesLists.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadLists.push(io);
      });
    });

  }

  deleteUploads(s, index) {
    this.uploadLists.forEach((s, i) => {
      if (index === i) {
        this.uploadLists.splice(index, 1)
        this.uplimages.splice(index, 1);
        let value = this.JVcreationForm?.value?.filevalue
        value.splice(index,1)
        
      }
    })
  }

  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any

  filepreview(files) {

    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true

      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
     stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }


  }

  
  


  JVHeader(){
    let group = new FormGroup({
      id : new FormControl(''),
     jedtype : new FormControl(''),
     jeddescription : new FormControl(''),
     jedamount: new FormControl(''),
     jedcat_code : new FormControl(''),
     jedsubcat_code : new FormControl(''),
     jedglno :  new FormControl(''),
     jedcc_code : new FormControl(''),
     jedbs_code : new FormControl(''),
     jedbranch : new FormControl ('')
    

    })
    return group

  }
  
  getuploaddata(){

    this.spinnerservice.show()
    this.jvservice.jvbulkupload(this.uplimage).subscribe(result=>{
      if(result){
        this.spinnerservice.hide()
      // console.log("upres",result)
      this.uploadeddata = result['data']
      let totalcount =  this.uploadeddata?.length
      this.uploadeddata.splice(totalcount-1,1)
      this.totalcount = this.uploadeddata?.length
      let credit = this.uploadeddata?.filter(x=>x.EntryType_id == "Credit")
      let creditamount = credit?.map(c=>c.Amount)
      this.creditsum = creditamount?.reduce((a, b) => a + b, 0)
      let debit = this.uploadeddata?.filter(x=>x.EntryType_id == "Debit")
      let debitamount = debit?.map(c=>c.Amount)
      this.debitsum = debitamount?.reduce((a, b) => a + b, 0)
      this.sum = Number( this.debitsum)+Number(this.creditsum )
      // console.log("sum",this.sum)
      
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })

  }

  getjournaltype(){
    this.jvservice.getjournaltype()
    .subscribe(result =>{
      if(result){
      let  TypeList = result['data']
      this.TypeList = TypeList?.filter(x=>x.id != 4)
      }
    },(error) => {
      this.errorHandler.handleError(error);
    })
  }

  getheadertype(data){
    if(data.id == 1){
      this.showjv = false
    }else{
      this.showjv = true 
    }
  }
  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }

  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  
 

  goback(){
    this.onCancel.emit()
  }

  searchcrno(){

    let jvrecords = this.JVcreationForm?.value
    // console.log("jvrecords",jvrecords)
    if(jvrecords?.jerefno == "" || jvrecords?.jerefno == null || jvrecords?.jerefno == undefined){
      this.notification.showError("Please Enter CR Number")
      return false
    }
    //  console.log("jvrecords1",jvrecords.jerefno)
    this.spinnerservice.show()
     this.jvservice.crnosearch(jvrecords?.jerefno)
     .subscribe(res =>{
      // console.log("jvrecords2",res)
      //  if(res['data'].length == 0){
      //    this.notification.showError("CR Number Not Found")
      //  }
       
      //  if(res['data'].length != 0){
      //    this.notification.showSuccess("CR Number Found")
      //  }

      if(res.message == 'Found'){
        this.notification.showSuccess("CR Number Found")
        this.spinnerservice.hide()
      }else{
        this.notification.showError("CR Number Not Found")
        this.spinnerservice.hide()
        return false
      }
       
     },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
     })
  }

  searchjvno(){

    let jvrecords = this.JVcreationForm?.value
    if(jvrecords?.jerefno == "" || jvrecords?.jerefno == null || jvrecords?.jerefno == undefined){
      this.notification.showError("Please Enter JV Number")
      return false
    }
   
    
     this.spinnerservice.show()
     this.jvservice.jvnosearch(jvrecords?.jerefno)
     .subscribe(res =>{
      
      if(res.code == "Invalid JVCRNO"){
        this.notification.showError(res.description)
        this.spinnerservice.hide()
        return false;
      }
      if(res.status == "success"){
        this.notification.showSuccess("JV Number Found")
        this.spinnerservice.hide()
      }
       
     },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
     })
  }

  submitjv(){
    const jvheaderdata = this.JVcreationForm?.value

    if(jvheaderdata?.jetype == "" || jvheaderdata?.jetype == null || jvheaderdata?.jetype == undefined){
      this.notification.showError("Please Select Header Type")
      return false
    }
    if(jvheaderdata?.jetransactiondate == "" || jvheaderdata?.jetransactiondate == null || jvheaderdata?.jetransactiondate == undefined){
      this.notification.showError("Please Select Transaction Date")
      return false
    }

    if(jvheaderdata?.jebranch == "" || jvheaderdata?.jebranch == null || jvheaderdata?.jebranch == undefined){
      this.notification.showError("Please Select Header Branch")
      return false
    }

    if(jvheaderdata?.jedescription == "" || jvheaderdata?.jedescription == null || jvheaderdata?.jedescription == undefined){
      this.notification.showError("Please Enter Header Description")
      return false
    }

    if(jvheaderdata?.filevalue?.length == 0){
      this.notification.showError("Please Choose File")
      return false
    }
    if(this.debitsum != this.creditsum){
      this.notification.showError("Debit And Credit Total Amount Must be Equal")
      return false
    }
   

    jvheaderdata.jetransactiondate = this.datePipe.transform(jvheaderdata?.jetransactiondate,'yyyy-MM-dd')
    jvheaderdata. jebranch = jvheaderdata?.jebranch?.id
    jvheaderdata.jeamount =  this.sum

    
    
   for(let ind in this.uploadeddata){
     let value = {
      "jedtype" : this.uploadeddata[ind]?.EntryType,
      "jeddescription": this.uploadeddata[ind]?.Description,
      "jedamount": this.uploadeddata[ind]?.Amount,
      "jedcat_code" : this.uploadeddata[ind]?.Category?.code,
      "jedsubcat_code" : this.uploadeddata[ind]?.Subcategory?.code,
      "jedglno":  this.uploadeddata[ind]?.CBSGL,
      "jedcc_code" : this.uploadeddata[ind]?.CC?.code,
      "jedbs_code" : this.uploadeddata[ind]?.BS?.code,
      "jedbranch" : this.uploadeddata[ind]?.Branch?.id


     }
    //  console.log("value",value)
     this.jvdetaildata.push(value)
    //  console.log("jvdetaildata",this.jvdetaildata)
   }
    let jvdata = {
      "jemode":jvheaderdata?.jemode,
      "jebranch": jvheaderdata?.jebranch,
      "jetype":jvheaderdata?.jetype,
      "jerefno":jvheaderdata?.jerefno,
      "jedescription":jvheaderdata?.jedescription,
      "jetransactiondate": jvheaderdata?.jetransactiondate,
      "jeamount":jvheaderdata?.jeamount,
      "JournalDetail":this.jvdetaildata

    }

  //  console.log("jvdata",jvdata)

  
    this.spinnerservice.show()
    this.jvservice.createjv(jvdata,this.uplimages)
    .subscribe(result =>{
      if(result.id != undefined){
      this.notification.showSuccess("JV Created Successfully")
      this.spinnerservice.hide()
      this.onSubmit.emit()
      }else{
        this.notification.showError(result.description)
        this.spinnerservice.hide()
        return false
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
     })
  }

  downloadtemplate() {
    this.spinnerservice.show()
    this.jvservice.templatedownload()
    .subscribe((results) => {
      
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "SampleExcel.xlsx";
      link.click();
      this.spinnerservice.hide()
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
     })
  }

  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }


    



  










}
