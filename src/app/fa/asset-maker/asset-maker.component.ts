import { Component, OnInit, Inject, ViewChild, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { TriggerService } from "../TriggerService";
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, map, takeUntil } from 'rxjs/operators';

import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

export interface Bucketname {
  id: number;
  name: string;
  doctype: number;
}




@Component({
  selector: 'app-asset-maker',
  templateUrl: './asset-maker.component.html',
  styleUrls: ['./asset-maker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AssetMakerComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('supnames') matsupname:MatAutocomplete;
  @ViewChild('supnameids') supname:any;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  regcount:number=0;
  cwipcount:number=0;
  buccount:number=0;
  assetcatlist: Array<any>=[];
  assetmakerblist: Array<any>=[];
  assetmakerreglist: Array<any>=[];
  assetmakerwbcwlist: Array<any>=[];
  assetmakerwbbuclist: Array<any>=[];
  bucketnamelist: Array<any>=[];
  checkboxselectlist: any[] = [];
  checkboxselectchiplist:any[]=[];
  checkboxselectreglist:any[]=[];
  checklist: any;
  isbuc: boolean = true
  supnamelist:Array<any>=[];
  selectIndex:any=0;

  assetmakerSearchForm:any= FormGroup;

  bucketlist: Array<any>
  // bucketlist: any[] = [];


  selectedGender: any

  checkedValuesreg: boolean[]

  checkedValuescwip: boolean[]
  checkedValuesbuc: boolean[]
  ischeck: boolean = false

  isbuce: boolean = true;
  ISBUC: boolean;

  ISREG: boolean = true;

  ISCWIP: boolean;
  is_buc:boolean=true;
  is_cwip:boolean=true;
  is_reg:boolean=true;
  

  iscwip: boolean;

  bucketform:any= FormGroup;
  bucketnameform: FormGroup
  d:number=0;

  defaultSelected = "REGULAR"
  unlockdatalist:Array<any>=[];

  selectedValue: string;
  red: any


  cwbuc = "CWIP";

  buckettlist = [{ 'id': 1, 'name': 'REGULAR' }, { 'id': 2, 'name': 'CWIP' }, { 'id': 3, 'name': 'BUC' }]




  isassetmaker: boolean
  isassetbuk: boolean
  isassetbucbuk: boolean
  isassetregbuk: boolean
  isassetcwipbuk: boolean
  iswithbuk:boolean=false;
  iswithoutbuk:boolean=false;
  add_btn_enb:boolean=true;
  add_atn_enb_buc:boolean=true;
  add_btn_enb_reg:boolean=true;
  isinvoice: boolean
  isassetwbuk: boolean
  view: String = "View"
  ismakerCheckerButton: boolean;
  has_nextwbuk = true;
  has_previouswbuk = true;
  presentpagewbuk: number = 1;

  has_nextbuk = true;
  has_previousbuk = true;
  presentpagebuk: number = 1;
  pageSize = 10;
  test: string
  isb: boolean;
  iswb: boolean;
  isLoading = false;
  isgrp:string;
  bucket_id:number=0;
  supid:number;
  // buck
  has_nextcom_product=true;
  currentpagecom_product=1;
  has_previouscom=false;
  value: any;
  page:number=1;
  constructor(private fb: FormBuilder, private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }
  // public onValueChange() {
  //   this.selectedValue = this.value;
  //   this.withoutbucBtn()
  //     if (this.value === "REGULAR") {
  //       this.bucketform.get("doctype").setValue(this.value);}
  //       if (this.value === "CWIP") {
  //         this.bucketform.get("doctype").setValue(this.value);}
  //         if (this.value === "BUC") {
  //           this.bucketform.get("doctype").setValue(this.value);

  //     }


  // }

  public onValueChange(value) {
    this.selectIndex=0;
    this.test=value;
    this.selectedValue = value;
    this.selectIndex=this.d;
    this.withoutbucBtn(this.d);
    if (value === "REGULAR") {
      this.bucketform.get("doctype").setValue(value);
    }
    if (value === "CWIP") {
      this.bucketform.get("doctype").setValue(value);
    }
    if (value === "BUC") {
      this.bucketform.get("doctype").setValue(value);

    }


  }
  public onSelect(value) {
    this.selectedValue = value;
  }
  selectedObjects: any[];



  abcd: any
  ngOnInit() {
    this.spinner.show();
    this.ISREG = true;
    this.cwbuc = 'CWIP'
    this.red = 2
    this.bucket();
    this.test = "REGULAR";
    

    this.selectedObjects = [{ id: 1, text: 'REGULAR' }];





    this.bucketform = this.fb.group({
      'name': new FormControl(),

      'doctype':new FormControl(['REGULAR', Validators.required]),



    })



    this.assetmakerSearchForm = this.fb.group({

      'invno': new FormControl(),
      'invoicedate': new FormControl(),
      'suppliername':new FormControl(),
      'crno':new FormControl()
    })

    this.bucketnameform = this.fb.group({
      'bucketname': new FormControl(),



    });
    this.Faservice.getassetsuppliername("",1).subscribe(data=>{
      console.log("dd=",data['data']);
      this.supnamelist=data['data'];
      let pagination=data['pagination'];
      if(this.supnamelist.length>0){
        this.has_nextbuk=pagination.has_next;
        this.has_previouswbuk=pagination.has_previous;
        this.presentpagewbuk=pagination.index;
      }
    });
    this.assetmakerSearchForm.get('suppliername').valueChanges.pipe(
      debounceTime(100),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetsuppliername(this.assetmakerSearchForm.get('suppliername').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log(data);
      this.supnamelist=data['data']
    })
    let bucvalue: String = "";
    this.bucketnameSearch(bucvalue);

    this.bucketnameform.get('bucketname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.bucketnameSearch(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bucketnamelist = datas;

      })
      this.withoutbucBtn(this.d);
      this.onValueChange('REGULAR');
    console.log('hi=',this.assetmakerSearchForm.value);
  }



  public displayFnBuc(bucket?: Bucketname): string | undefined {

    return bucket ? bucket.name : undefined;
  }

  get bank() {
    return this.bucketnameform.get('bucketname');
  }



  private bucketnameSearch(bucvalue) {
    this.Faservice.bucketnameSearch(bucvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bucketnamelist = datas;
        console.log("bucname", datas)

      })






  }




  getassetmakerbsummary(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.Faservice.getassetmakerbsummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("asset", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        // this.assetmakerblist = datass;


        // console.log("asset", this.assetmakerblist)
        if (this.assetmakerblist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();
      }
      
      );
      

  }
  bucBtn() {
    console.log('hii here function called 2nd one');
    this.isassetbuk = false;    //
    // this.isbuce=!this.isbuce
    // this.getassetmakerbsummary();
    // this.isassetregbuk = false;
    // this.iswb = false;
    // this.isb = true;
    this.isassetcwipbuk = false;   //
    this.isassetbucbuk = false;
    this.isassetregbuk = false;   
    //below code newly added
    if (this.test === "CWIP") {
      this.page=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerwbcwipsummary();
      this.isassetcwipbuk = true;
      this.isassetbuk = false;
      this.isassetbucbuk = false;
      this.isassetregbuk = false;
      




    }
    if (this.test === "BUC") {
      this.page=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerwbbucsummary();
      this.isassetbucbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetregbuk = false;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');





    } if (this.test === "REGULAR") {
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerregsummary()
      this.isassetregbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetbucbuk = false;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      // this.assetmakerwbcwlist=this.assetmakerreglist.filter(data=> data.groupno==1);





    }



  }

  withoutbucBtn(d:any) {
    this.d=d;
    console.log(d);
    if(d==0){
    // this.iswb = true;
    this.selectIndex=0;
    this.isb = false;



    if (this.test === "CWIP") {
      this.page=1;
      this.presentpagewbuk=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp='N';
      this.iswithoutbuk=true;
      this.iswithbuk=false;
      this.getassetmakerwbcwipsummary();
      this.isassetcwipbuk = true;
      this.isassetbuk = false;
      this.isassetbucbuk = false;
      this.isassetregbuk = false;

       



    }
    if (this.test === "BUC") {
      this.page=1;
      this.presentpagewbuk=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.isgrp='N';
      this.iswithoutbuk=true;
      this.iswithbuk=false;
      this.getassetmakerwbbucsummary();
      this.isassetbucbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetregbuk = false;
      






    } if (this.test === "REGULAR") {
      
      this.isgrp='N';
      this.iswithoutbuk=true;
      this.iswithbuk=false;
      console.log('regularenter;')
      this.getassetmakerregsummary()
      this.isassetregbuk = true;
      
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetbucbuk = false;
      
    
    }
  }
  if(d==1){
    this.selectIndex=1;
    this.isassetbuk = false;    //
    // this.isbuce=!this.isbuce
    // this.getassetmakerbsummary();
    // this.isassetregbuk = false;
    // this.iswb = false;
    // this.isb = true;
    this.isassetcwipbuk = false;   //
    this.isassetbucbuk = false;
    this.isassetregbuk = false;   
    //below code newly added
    if (this.test === "CWIP") {
      this.page=1;
      this.presentpagewbuk=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.page=1;
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerwbcwipsummary();
      this.isassetcwipbuk = true;
      this.isassetbuk = false;
      this.isassetbucbuk = false;
      this.isassetregbuk = false;
      





    }
    if (this.test === "BUC") {
      this.presentpagewbuk=1;
      this.page=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.page=1;
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerwbbucsummary();
      this.isassetbucbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetregbuk = false;
       





    } if (this.test === "REGULAR") {
      this.page=1;
      this.currentpagecom_product=1;
      this.assetmakerSearchForm.get('invno').patchValue('');
      this.assetmakerSearchForm.get('invoicedate').patchValue('');
      this.assetmakerSearchForm.get('suppliername').patchValue('');
      this.assetmakerSearchForm.get('crno').patchValue('');
      this.page=1;
      this.isgrp="Y";
      this.iswithoutbuk=false;
      this.iswithbuk=true;
      this.getassetmakerregsummary()
      this.isassetregbuk = true;
      this.isassetbuk = false;
      this.isassetcwipbuk = false;
      this.isassetbucbuk = false;
      // this.assetmakerwbcwlist=this.assetmakerreglist.filter(data=> data.groupno==1);
       




    }


  }




  }


  invoiceBtn() {
    this.isinvoice = true;
  }

  expenseBtn() {
    this.isinvoice = false;


  }
  BackBtn() {
    this.router.navigate(['/fa/fatransactionsummary'], { skipLocationChange: true });


  }



  assetView(id:any) {
    setTimeout(()=>{
      this.spinner.show();
      
    });
    
    // console.log(id)
    // console.log(this.test);
    this.shareservice.regular.next(this.test);
    this.shareservice.asset_id.next(id);
    
    // console.log(this.shareservice.asset_id.value);
    // console.log("logs:",this.test);   //
    // console.log(this.shareservice.regular.next(this.test));  //
    this.router.navigate(['/fa/assetmakeradd'], { skipLocationChange: true });

  }




  buknextClick() {

    if (this.has_nextbuk === true) {

      this.getassetmakerbsummary(this.presentpagebuk + 1, 10)

    }
  }

  bukpreviousClick() {

    if (this.has_previousbuk === true) {

      this.getassetmakerbsummary(this.presentpagebuk - 1, 10)

    }
  }
  unlockdata(){
    if(this.unlockdatalist.length==0){
      this.notification.showWarning('Please Select The Data');
      return false;
    }
    let d:any={'id':[],'status':'UNLOCK'};
    for(let i=0;i<this.unlockdatalist.length;i++){
      d['id'].push(this.unlockdatalist[i]['id']);
    }
      this.Faservice.faunlockdata(d).subscribe(data=>{
        if(data['status']=="success"){
          this.notification.showSuccess(data['message']);
        }
        else{
          this.notification.showWarning(data['code']);
          this.notification.showWarning(data['description']);
        }
      },(error)=>{
        this.spinner.hide();

      }
      
      )
  }
  getassetmakerregsummary(pageNumber = 1, pageSize = 10) {
    this.checkboxselectreglist=[];
    let data:any={};
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let search:string="page="+this.page+"&Doc_type="+id+"&Is_Grp="+this.isgrp;
    data['page']=search;
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
   
    console.log('dear1=',data);
    this.spinner.show();
    this.Faservice.getassetmakerregsummary(pageNumber, pageSize,data)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("asset", result)
        let datass = result['data'];
        
        let datapagination = result["pagination"];
        // this.assetmakerreglist = datass;
        this.assetmakerreglist=datass;
       this.regcount=result['count'];
        // this.checkedValuesreg = this.assetmakerreglist.map(() => false);
        this.checkedValuesreg = this.assetmakerreglist.map(b => b===false)
        console.log("assetreg=", this.assetmakerreglist)
        if (this.assetmakerreglist.length >= 0) {
          this.has_nextwbuk = datapagination.has_next;
          this.has_previouswbuk = datapagination.has_previous;
          this.presentpagewbuk = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();
      }
      );
      
      console.log('hii=',this.assetmakerSearchForm.valid);

  }

  wbuknextClick() {

    if (this.has_nextwbuk === true) {
      this.page=this.page+1;
      this.getassetmakerregsummary(this.presentpagewbuk + 1, 10)

    }
  }

  wbukpreviousClick() {

    if (this.has_previouswbuk === true) {
      this.page=this.page-1;
      this.getassetmakerregsummary(this.presentpagewbuk - 1, 10);

    }
  }


  getassetmakerwbcwipsummary(pageNumber = 1, pageSize = 10) {
    this.checkboxselectlist=[];
    let data:any={};
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let search:string="page="+this.presentpagebuk+"&Doc_type="+id+"&Is_Grp="+this.isgrp;
    data['page']=search;
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
   
    console.log('dear1=',data);
    this.spinner.show();
    this.Faservice.getassetmakerwbCWIPsummary(pageNumber, pageSize ,data)
      .subscribe((result) => {
        console.log("welcome")
        console.log("assetasasas", result);
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetmakerwbcwlist = datass;
        this.cwipcount=result['count'];
        this.checkedValuescwip = this.assetmakerwbcwlist.map(() => false);
        this.spinner.hide();
        this.cwipcount=result['count'];

        console.log("assetwip", this.assetmakerwbcwlist)
        if (this.assetmakerwbcwlist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();

      }
      );
     


  }
  wbuknextClickbuc() {
    
    if (this.has_nextbuk === true) {
      this.page=this.page+1;
      this.getassetmakerwbcwipsummary(this.presentpagewbuk + 1, 10)

    }
  }

  wbukpreviousClickbuc() {

    if (this.has_previousbuk === true) {
      this.page=this.page-1;
      this.getassetmakerwbcwipsummary(this.presentpagewbuk - 1, 10);

    }
  }

  getassetmakerwbbucsummary(pageNumber = 1, pageSize = 10) {
    let data:any={};
      this.checkboxselectchiplist=[];
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp }
    let search:string="page="+this.presentpagebuk+"&Doc_type="+id+"&Is_Grp="+this.isgrp;
    data['page']=search;
    this.spinner.show();
    this.Faservice.getassetmakerwbBUCsummary(pageNumber, pageSize,data)
      .subscribe((result) => {
        console.log("asset", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetmakerwbbuclist = datass;

        this.spinner.hide();
        this.buccount=result['count'];
        this.checkedValuesbuc = this.assetmakerwbbuclist.map(() => false);
        this.buccount=result['count'];

        console.log("assetbuc", this.assetmakerwbbuclist)
        if (this.assetmakerwbbuclist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();
      }
      );
      

  }

  wbuknextClickbucc() {
    
    if (this.has_nextbuk === true) {
      this.page=this.page+1;
      this.getassetmakerwbbucsummary(this.presentpagewbuk + 1, 10)

    }
  }

  wbukpreviousClickbucc() {

    if (this.has_previousbuk === true) {
      this.page=this.page-1;
      this.getassetmakerwbbucsummary(this.presentpagewbuk - 1, 10);

    }
  }


  iscwi() {
    return this.checkedValuescwip.some(b => b);
  }
  // ischeckss:boolean= this.checkedValuesreg.some((b:boolean) => b);
  ischeckss() {
    // return this.checkedValuesreg.some(b => b);
    return this.checkedValuesreg.some((b:boolean) => b);
  }

  isbu() {
    return this.checkedValuesbuc.some(b => b);
  }


  private bucket() {
    this.Faservice.bucket()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bucketlist = datas;
        console.log("bucket", datas)
      })

  }

  buccreateForm() {
    // if (this.bucketform.value.doctype===""){
    //   this.toastr.error('Add Depreciation type Field','Empty value inserted' ,{timeOut: 1500});
    //   return false;
    // }
    // if (this.bucketform.value.depgl===""){
    //   this.toastr.error('Add GL Number  Field','Empty value inserted' ,{timeOut: 1500});
    //   return false;
    // }
    if(this.bucketform.get('name').value ==null || this.bucketform.get('name').value =='' ||  this.bucketform.get('name').value =="" ){
      this.notification.showError('Please Enter The Bucket Name');
      return false;
    }
    if(this.bucketform.get('doctype').value ==null || this.bucketform.get('doctype').value =='' ||  this.bucketform.get('doctype').value =="" ){
      this.notification.showError('Please Select The Doctype');
      return false;
    }

    let data = this.bucketform.value;
    console.log('edata=',data)
    this.Faservice.bucCreateForm(data)
      .subscribe(

        (data)=>{
          if(data.id==undefined || data.id==0 || data.id==''){
            this.notification.showError(data['code']);
            this.notification.showError(data['description']);
          }
          else{
            this.notification.showSuccess("Saved Successfully!...");
          }
        
        },
        (error)=>{
          this.notification.showError('Failed To Upload');
        }
        // this.onSubmit.emit();
        // this.router.navigate(['/fa/famastersummary'], { skipLocationChange: true })



        
      )
      this.bucketform.get('name').patchValue(" ");

  }

  filterResults(obj: any, e: any) {
   



    if (e.currentTarget.checked == true) {
      this.checkboxselectlist.push({'id':obj.id});
      this.unlockdatalist.push({"id":obj.id,"status":"UNLOCK"});
      console.log("chekclist", this.checkboxselectlist)
      this.shareservice.checklist.next(this.checkboxselectlist);
      this.is_cwip=true;
      this.add_btn_enb=false;
     
    }
    else {
      const index = this.checkboxselectlist.indexOf(obj.id)
      const indexs = this.unlockdatalist.indexOf(obj.id)
      this.checkboxselectlist.splice(index, 1);
      this.unlockdatalist.splice(indexs,1);
      console.log('liste', this.checkboxselectlist);
      this.is_cwip=false;
      this.add_btn_enb=true;
      
    }
    if(this.checkboxselectlist.length>=1){
      this.add_btn_enb=false;
    }
    
  }
  selectata(data:any){
    console.log('ee=',data);
    this.bucket_id=data.code;
  }
  filterResults_buc(obj:any,e:any){
    if (e.currentTarget.checked == true) {
      this.checkboxselectchiplist.push({'id':obj.id});
      this.unlockdatalist.push({"id":obj.id,"status":"UNLOCK"});
      console.log("chekclist", this.checkboxselectchiplist)
      this.shareservice.checklist.next(this.checkboxselectlist);
      this.is_buc=true;
      this.add_atn_enb_buc=false;
      // if(this.checkboxselectchiplist.length >=1){
      //   this.add_atn_enb_buc=false;
      // }
      // else{
      //   this.add_atn_enb_buc=true;
      // }

    }
    else {
      const index = this.checkboxselectchiplist.indexOf(obj.id);
      const indexs = this.unlockdatalist.indexOf(obj.id);
      this.checkboxselectchiplist.splice(index, 1);
      this.unlockdatalist.splice(indexs,1);
      console.log('liste', this.checkboxselectchiplist);
      this.is_buc=false;
      this.add_atn_enb_buc=true;
     
    }
   
    if(this.checkboxselectchiplist.length>=1){
      this.add_atn_enb_buc=false;
    }

  }
  filterResults_reg(obj:any,e:any){
    console.log('click')
    if (e.currentTarget.checked == true) {
      this.checkboxselectreglist.push({'id':obj.id});
      this.unlockdatalist.push({"id":obj.id,"status":"UNLOCK"});
      console.log("chekclist", this.checkboxselectreglist)
      this.shareservice.checklist.next(this.checkboxselectreglist);
      this.is_reg=true;
      this.add_btn_enb_reg=false;
      

    }

    else {
      const index = this.checkboxselectreglist.indexOf(obj.id);
      const indexs = this.unlockdatalist.indexOf(obj.id)
      this.checkboxselectreglist.splice(index, 1);
      this.unlockdatalist.splice(indexs,1);
      this.is_reg=false;
      this.add_btn_enb_reg=true;
    }
    if(this.checkboxselectreglist.length>=1){
      this.add_btn_enb_reg=false;
    }
   console.log(this.checkboxselectreglist.length);
    
  }

  bucketnameCreateForm() {
    console.log( this.bucketnameform.get('bucketname').value)
    if(this.bucketnameform.get('bucketname').value =="" || this.bucketnameform.get('bucketname').value ==null ||this.bucketnameform.get('bucketname').value ==undefined){
      this.notification.showWarning("Please Select Valid Bucket Name");
      return false;
    }
    let data = this.bucketnameform.value;
   const a= {
      "clearing_header":  this.checkboxselectlist ,
      "bucket_code":this.bucket_id
      }
    console.log('jj=',a);
    this.spinner.show();
    this.Faservice.bucnameCreateForm(a)
      .subscribe((res:any) => {
        console.log(res);
        if(res.status=="success"){
       
        this.spinner.hide();
        this.notification.showSuccess(res.message)
        
        this.getassetmakerwbcwipsummary();

        return true;
        }
        else{
          this.spinner.hide();
          this.notification.showWarning(res.description);
        }
      },
      (error)=>{
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
      }
      )
      this.add_btn_enb=true;
      this.add_btn_enb_reg=true;
      this.add_atn_enb_buc=true;
      this.bucketnameform.get('bucketname').patchValue("");
     


  }

  bucketnameCreateForm_buc() {
    console.log( this.bucketnameform.get('bucketname').value)
    if(this.bucketnameform.get('bucketname').value =="" || this.bucketnameform.get('bucketname').value ==null ||this.bucketnameform.get('bucketname').value ==undefined){
      this.notification.showWarning("Please Select Valid Bucket Name");
      return false;
    }
    let data = this.bucketnameform.value;
    
    const a= {
      "clearing_header": this.checkboxselectchiplist,
      "bucket_code":this.bucket_id 
      }
    console.log('jj=',a);
    this.spinner.show();
    this.Faservice.bucnameCreateForm(a)
      .subscribe((res:any) => {

        if(res.status=="success"){
          this.spinner.hide();
        this.notification.showSuccess(res.message);
        this.getassetmakerwbbucsummary();
        }
        else{
          this.spinner.hide();
          this.notification.showError(res.description);
        }


        return true;
      },
      (error)=>{
        console.log(error);
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
      }
      )
      this.add_btn_enb=true;
      this.add_btn_enb_reg=true;
      this.add_atn_enb_buc=true;
      this.bucketnameform.get('bucketname').patchValue("");
      


  }
  bucketnameCreateForm_reg() {
    console.log( this.bucketnameform.get('bucketname').value)
    if(this.bucketnameform.get('bucketname').value =="" || this.bucketnameform.get('bucketname').value ==null ||this.bucketnameform.get('bucketname').value ==undefined){
      this.notification.showWarning("Please Select Valid Bucket Name");
      return false;
    }
    // let data = this.bucketnameform.value;

    const a= {
      "clearing_header": this.checkboxselectreglist ,
      "bucket_code":  this.bucket_id
      };
      console.log(this.checkboxselectreglist);
    console.log('jjreg=',a);
    this.spinner.show();
    this.Faservice.bucnameCreateForm(a)
      .subscribe((res:any) => {
        console.log(res)
        if(res.status=="success"){
          this.spinner.hide();
          this.notification.showSuccess(res.message);
          this.getassetmakerregsummary();
        }
        else{
          
          this.spinner.hide();
          this.notification.showError(res.description);

        }
       



        return true;
      },
      (error)=>{
        console.log(error);
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
      }
      );
      this.add_btn_enb=true;
      this.add_btn_enb_reg=true;
      this.add_atn_enb_buc=true;
      this.bucketnameform.get('bucketname').patchValue("");
     



  }




  createFormate() {
    let data = this.assetmakerSearchForm.controls;
    let assetmakersearchclass = new assetmakerSearchtype();
    assetmakersearchclass.invno = data['invno'].value;
    assetmakersearchclass.invoicedate = data['invoicedate'].value
    assetmakersearchclass.suppliername = data['suppliername'].value;
    assetmakersearchclass.crno = data['crno'].value
    return assetmakersearchclass;
  }

  j: any
  k: any
  assetmakercreateForm() {
    this.presentpagebuk=1;
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
    let data:any={};
    let search:string='page='+this.presentpagewbuk+'&Doc_type='+id+"&Is_Grp="+this.isgrp;
    if(this.assetmakerSearchForm.get('invno').value !=null && this.assetmakerSearchForm.get('invno').value !="" ){
      search=search+"&invno="+this.assetmakerSearchForm.get('invno').value;
      
    }
    if(this.assetmakerSearchForm.get('invoicedate').value !=null && this.assetmakerSearchForm.get('invoicedate').value !="" ){
      let datevalue=this.assetmakerSearchForm.get('invoicedate').value;
      search=search+"&invdate="+this.datePipe.transform(datevalue,'yyyy-MM-dd');
      
    }
    if(this.assetmakerSearchForm.get('suppliername').value !=null && this.assetmakerSearchForm.get('suppliername').value !="" ){
      search=search+"&supname="+this.supid;
     
    }
    if(this.assetmakerSearchForm.get('crno').value !=null && this.assetmakerSearchForm.get('crno').value !="" ){
      search=search+"&crno="+this.assetmakerSearchForm.get('crno').value;
      
    }
    
    data['page']=search;
    console.log('dear1=',dear);
    this.spinner.show();
    this.Faservice.getassetmakerwbCWIPsummary(this.presentpagebuk, 10 ,data)
      .subscribe((result) => {
        console.log("welcome")
        console.log("assetasasas", result);
        let datass = result['data'];
        let datapagination = result["pagination"];
        
        this.checkedValuescwip = this.assetmakerwbcwlist.map(() => false);
        this.spinner.hide();
        if(result['data'].lenght==0){
          this.spinner.hide();
          this.notification.showWarning('Matching Data Not Found..')
          this.assetmakerwbcwlist = [];
        }
        else{
          this.spinner.hide();
          this.assetmakerwbcwlist=result['data'];
          this.cwipcount=result['count'];
        }

        console.log("assetwip", this.assetmakerwbcwlist)
        if (this.assetmakerwbcwlist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();

      }
      );
    
  }
  reset() {
    this.assetmakerSearchForm.get('invno').patchValue('');
    this.assetmakerSearchForm.get('invoicedate').patchValue('');
    this.assetmakerSearchForm.get('suppliername').patchValue('');
    this.assetmakerSearchForm.get('crno').patchValue('');
    this.getassetmakerwbcwipsummary();
  }

  assetmakerbuccreateForm() {
    this.presentpagebuk=1;
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
    let data:any={};
    let search:string='page='+this.presentpagebuk +'&Doc_type='+id+"&Is_Grp="+this.isgrp;
    if(this.assetmakerSearchForm.get('invno').value !=null && this.assetmakerSearchForm.get('invno').value !="" ){
      search=search+"&invno="+this.assetmakerSearchForm.get('invno').value;
      
    }
    if(this.assetmakerSearchForm.get('invoicedate').value !=null && this.assetmakerSearchForm.get('invoicedate').value !="" ){
      let datevalue=this.assetmakerSearchForm.get('invoicedate').value;
      search=search+"&invdate="+this.datePipe.transform(datevalue,'yyyy-MM-dd');
      
    }
    if(this.assetmakerSearchForm.get('suppliername').value !=null && this.assetmakerSearchForm.get('suppliername').value !="" ){
      search=search+"&supname="+this.supid;
     
    }
    if(this.assetmakerSearchForm.get('crno').value !=null && this.assetmakerSearchForm.get('crno').value !="" ){
      search=search+"&crno="+this.assetmakerSearchForm.get('crno').value;
      
    }
    
    dear['page']=search;
    console.log('dear1=',dear);
    this.spinner.show();
    this.Faservice.getassetmakerwbBUCsummary(1, 10,dear)
      .subscribe((result) => {
        console.log("asset", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        
        this.spinner.hide();
        this.checkedValuesbuc = this.assetmakerwbbuclist.map(() => false);
        if(result['data'].length==0){
          this.assetmakerwbbuclist =[];
          this.notification.showWarning('Matching Data Not Found..');
          this.spinner.hide();
        }
        else{
          this.assetmakerwbbuclist=result['data'];
          this.spinner.hide();
          this.buccount=result['count'];
        }

        console.log("assetbuc", this.assetmakerwbbuclist)
        if (this.assetmakerwbbuclist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();
      }
      );
    
  }
  resets() {
    this.assetmakerSearchForm.get('invno').patchValue('');
    this.assetmakerSearchForm.get('invoicedate').patchValue('');
    this.assetmakerSearchForm.get('suppliername').patchValue('');
    this.assetmakerSearchForm.get('crno').patchValue('');
    this.getassetmakerwbbucsummary();
  }


  assetmakerregcreateForm() {
    this.presentpagewbuk=1;
    let doc_type:any=this.buckettlist.filter(data=>data.name==this.test);
    let id=doc_type[0]['id'];
    let dear={'Doc_Type':id,"Is_Grp":this.isgrp}
    let data:any={};
    let search:string='page='+this.presentpagewbuk +'&Doc_type='+id+"&Is_Grp="+this.isgrp;
    if(this.assetmakerSearchForm.get('invno').value !=null && this.assetmakerSearchForm.get('invno').value !="" ){
      search=search+"&invno="+this.assetmakerSearchForm.get('invno').value;
      
    }
    if(this.assetmakerSearchForm.get('invoicedate').value !=null && this.assetmakerSearchForm.get('invoicedate').value !="" ){
      let datevalue=this.assetmakerSearchForm.get('invoicedate').value;
      search=search+"&invdate="+this.datePipe.transform(datevalue,'yyyy-MM-dd');
      
    }
    if(this.assetmakerSearchForm.get('suppliername').value !=null && this.assetmakerSearchForm.get('suppliername').value !="" ){
      search=search+"&supname="+this.supid;
     
    }
    if(this.assetmakerSearchForm.get('crno').value !=null && this.assetmakerSearchForm.get('crno').value !="" ){
      search=search+"&crno="+this.assetmakerSearchForm.get('crno').value;
      
    }
    data['page']=search;
    this.spinner.show();
    this.Faservice.getassetmakerregsummary(this.presentpagewbuk,10,data)
      .subscribe((result) => {
        console.log("asset", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        // this.assetmakerreglist = datass;
        
        this.spinner.hide();
        if(result['data'].length==0){
          this.assetmakerreglist=[];
          this.spinner.hide();
          this.notification.showWarning('Matching Data Not Found');
        }
        else{
          this.assetmakerreglist=datass;
          this.spinner.hide();
          this.regcount=result['count'];
        }
        // this.checkedValuesreg = this.assetmakerreglist.map(() => false);
        this.checkedValuesreg = this.assetmakerreglist.map(b => b===false)
        console.log("assetreg=", this.assetmakerreglist)
        if (this.assetmakerreglist.length >= 0) {
          this.has_nextwbuk = datapagination.has_next;
          this.has_previouswbuk = datapagination.has_previous;
          this.presentpagewbuk = datapagination.index;
        }

      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
        this.spinner.hide();
      }
      );
  }
  resetss() {
    this.assetmakerSearchForm.get('invno').patchValue('');
    this.assetmakerSearchForm.get('invoicedate').patchValue('');
    this.assetmakerSearchForm.get('suppliername').patchValue('');
    this.assetmakerSearchForm.get('crno').patchValue('');
    this.getassetmakerregsummary();
  }
  supnameid(data:any){
    this.supid=data.id;
  }
  autocompletecommodityScroll_product() {
    console.log('ente')
    setTimeout(() => {
      if (
        this.matsupname&&
        this.autocompletetrigger &&
        this.matsupname.panel
      ) {
        console.log('enter1')
        fromEvent(this.matsupname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_product === true) {
                this.Faservice.getassetsuppliername(this.supname.nativeElement.value, this.currentpagecom_product+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.supnamelist = this.supnamelist.concat(datas);
                    console.log(datapagination);
                    if (this.supnamelist.length >= 0) {
                      this.has_nextcom_product = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_product = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

}


class assetmakerSearchtype {
  invno: string;
  invoicedate: any;
  suppliername:string;
  crno:any;

} 