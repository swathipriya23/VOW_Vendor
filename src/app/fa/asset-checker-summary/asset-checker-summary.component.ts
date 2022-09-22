import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder,FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { faservice } from '../fa.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { faShareService } from '../share.service'; 
 import { ToastrService } from 'ngx-toastr';  
 import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
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

@Component({
  selector: 'app-asset-checker-summary',
  templateUrl: './asset-checker-summary.component.html',
  styleUrls: ['./asset-checker-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AssetCheckerSummaryComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('assetcat') matcheckassetcatAutocomplete: MatAutocomplete;
  @ViewChild('inputassetcatcheck') Inputassetcat: any;

  @ViewChild('branch') matbranchAutocomplete:MatAutocomplete;
  @ViewChild('inputbranch') inputbranch:any;
  
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  checkersum:any=FormGroup;
  assetcatslist:Array<any>=[];
  isLoading:boolean;
  checker_assetcat:any=[];
  checker_branch:any=[];
  asset_id:any;
  branch_id:any='';
  page:number=1;
  has_nextasset:boolean=false;
  has_previousasset:boolean=false;;
  checked: boolean = false
  presentpageasset:number=0;
  presentpageloc:number=1;
  isassetcheckers = true;
  reajectfrom:any=FormGroup;
  rejectReason:any=FormControl;
  check:boolean=true;
  ischeck:boolean=true;
    // this.getassetcategorysummary(); 
  isassetmaker = false;
  isassetcheckerse = false;
  iscpdatemaker = false;
  has_nextassetcat:boolean=true;
  has_preassetcat :boolean=true ;
  // has_preassetcat :boolean;
  // presentpageloc: number = 1;
  currentpagecomasset :number=1;
  pageSize = 10;
  // currentpagecomasset:boolean;
  list2:any=[];
  list1:any=[];
  has_previousloc:boolean;
  has_nextloc:boolean;
  Grb_by:string='Y';

  has_nextbranch:boolean=true;
  has_previbranchlocation:boolean=true;
  has_presentpage:number=1;

  constructor(private errorHandler:ErrorHandlerService,private datepipe:DatePipe,private Toast:ToastrService,private router:Router,private shareservice:faShareService,private fb:FormBuilder,private Faservice:faservice,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    
    this.reajectfrom=this.fb.group({
      'rejectReason':new FormControl('')
    });
    this.checkersum=this.fb.group({
      'date':new FormControl(),
      'assetcat':new FormControl(),
      'branch':new FormControl(),
      'crno':new FormControl()
    });
    this.Faservice.getassetcategorynew('',1).subscribe(data=>{
      this.checker_assetcat=data['data'];
    })
    this.checkersum.get('assetcat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any) => this.Faservice.getassetcategorynew( this.checkersum.get('assetcat').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).
      subscribe((results: any[]) => {
        this.checker_assetcat=results['data']
          
        console.log('assetcat=',results)
      });
      this.Faservice.getassetbranchdata('',1).subscribe(data=>{
        this.checker_branch=data['data'];
      })
      this.checkersum.get('branch').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:any) => this.Faservice.getassetbranchdata( this.checkersum.get('branch').value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).
        subscribe((results: any[]) => {
            this.checker_branch=results['data']
            // console.log('branch_name=',results)
        });
        this.getassetcategorysummary();
  }

  checkersubmit_data(){
    this.presentpageloc=1;
    let dear:any={};
    let search:string="page="+this.presentpageloc+'&Grp_by='+this.Grb_by;
    if(this.checkersum.get('date').value !=null && this.checkersum.get('date').value!=""){
      let dateval=this.datepipe.transform(this.checkersum.get('date').value,"yyyy-MM-dd");
      search=search+'&capdate='+dateval;
    }
    if(this.checkersum.get('assetcat').value !=null && this.checkersum.get('assetcat').value!=""){
      
      search=search+'&cat='+this.asset_id;
      
    }
   
    if(this.checkersum.get('branch').value !=null && this.checkersum.get('branch').value!=""){
      
      search=search+'&branch='+this.branch_id;
    }
    if(this.checkersum.get('crno').value !=null && this.checkersum.get('crno').value!=""){
      
      search=search+'&crno='+this.checkersum.get('crno').value;
    }
    dear['page']=search;
    this.spinner.show();
    this.Faservice.getassetcategorysummary1(this.page,dear)
    .subscribe((result:any) => {
     this.spinner.hide();
      console.log("landlord-1", result);
      let datass = result['data'];
      
      let datapagination = result["pagination"];
      this.assetcatslist=result['data'];
      if(this.assetcatslist.length==0){
        this.assetcatslist=[];
        this.spinner.hide();
        this.Toast.warning('No Records Found..');
      }
      else{
        this.assetcatslist = result['data'];
        this.spinner.hide();
        for(let i=0;i<this.assetcatslist.length;i++){
          this.assetcatslist[i]['is_checked']=false;
          
        }
      }
      this.spinner.hide();
      console.log("landlord", this.assetcatslist)
      if (this.assetcatslist.length >= 0) {
        this.has_nextasset = datapagination.has_next;
        this.has_previousasset = datapagination.has_previous;
        this.presentpageasset = datapagination.index;
        this.presentpageloc=datapagination.index;
      }
      

    },
    (error:HttpErrorResponse)=>{
      console.log(error);
       this.errorHandler.errorHandler(error,'');
      this.spinner.hide();
    }
    );

  }
  getassetcategorysummary(pageNumber = 1, pageSize = 10) {
    // setTimeout(()=>{
     
    // },100);
    this.shareservice.asset_id.next(1);
    let d:any={};
    let search:string="page="+this.presentpageloc+"&Grp_by="+this.Grb_by+"&capdate="+"&branch="+"&cat=";
    d['page']=search;
     console.log(d);
     this.spinner.show();
    
     this.Faservice.getassetcategorysummary1(this.presentpageloc,d)
       .subscribe((result:any) => {
        // this.spinner.hide();
         console.log("landlord-1", result);
         let datass = result['data'];
        
         let datapagination = result["pagination"];
         this.assetcatslist = result['data'];
         this.spinner.hide();
         console.log("landlord", this.assetcatslist)
         if (this.assetcatslist.length >= 0) {
           this.has_nextasset = datapagination.has_next;
           this.has_previousasset = datapagination.has_previous;
           this.presentpageasset = datapagination.index;
           this.presentpageloc=datapagination.index;
         }
         
 
       },
       (error:HttpErrorResponse)=>{
         console.log(error);
         this.errorHandler.errorHandler(error,'');
         this.spinner.hide();
       }
       );
       for(let i=0;i<this.assetcatslist.length;i++){
         this.assetcatslist[i]['is_checked']=false;
         
       }
       console.log('has_nextasset',this.has_nextasset);
       console.log('has_previousasset',this.has_previousasset);
       ;
      //  setTimeout(()=>{
       
      //  },100)
       
   }
   checkedoff(data:any,event){
    console.log(data);
    if(event.currentTarget.checked){
      for(let i=0;i<this.assetcatslist.length;i++){
        if(this.assetcatslist[i].assetdetails_id == data.assetdetails_id){

          this.assetcatslist[i].is_checked=true;
        }
        else{
          this.assetcatslist[i].is_checked=false;
        }
      } 
      if(data.assetdetails_status == 'ENTRY_FAILED'){
        // this.check=false;
        // this.ischeck=true;
        this.check=true;
        this.ischeck=false;
      } 
      else{
        // this.check=true;
        // this.ischeck=false;
        this.check=false;
        this.ischeck=true;
      }
     
    }
    else{
      for(let i=0;i<this.assetcatslist.length;i++){
        this.assetcatslist[i].isChecked=false;
        this.check=true;
        this.ischeck=true;
      }
    
    }


   }
   assetgrp() {
    this.presentpageloc = 1;
    this.isassetcheckers = true;
    this.Grb_by='Y';
    this.shareservice.asset_id.next(1);
    this.getassetcategorysummary(); 
    this.isassetmaker = false;
    this.isassetcheckerse = false;
    this.iscpdatemaker = false;
  }
  assetnongrp() {
    this.assetcatslist=[];
    this.presentpageloc = 1;
    console.log('in',this.presentpageloc)
    this.Grb_by='N';
    this.isassetcheckerse = true;
    this.getassetcategorysummary();
    this.shareservice.asset_id.next(0); 
    // this.isassetmaker = false;
    this.isassetcheckers = false;
    this.iscpdatemaker = false;
  }
  locpreviousClick() {
    setTimeout(() => {
      this.spinner.show();
    });
    if (this.has_previousasset === true) {
      // this.currentpage= this.presentpage - 1;
      this.presentpageloc=this.presentpageloc-1;
      this.page=this.page - 1;
      this.getassetcategorysummary(this.presentpageloc - 1, 10)

    }
  }

  locnextClick() {
    setTimeout(() => {
      this.spinner.show();
    });
    if (this.has_nextasset === true) {
      // this.currentpage= this.presentpage + 1
      this.page=this.page + 1;
      this.presentpageloc=this.presentpageloc+1;
      this.getassetcategorysummary(this.presentpageloc + 1, 10)

    }
  }
  autocompletecommodityScroll_assetcat() {
    console.log('called')
    setTimeout(() => {
      if (
        this.matcheckassetcatAutocomplete &&
        this.autocompleteTrigger &&
        this.matcheckassetcatAutocomplete.panel
      ) {
        fromEvent(this.matcheckassetcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcheckassetcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcheckassetcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcheckassetcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcheckassetcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log('first');
              if (this.has_nextassetcat === true) {
               
                this.Faservice.getassetcategorynew( this.Inputassetcat.nativeElement.value,this.currentpagecomasset +1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('hii')
                    console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.checker_assetcat = this.checker_assetcat.concat(datas);
                    if (this.checker_assetcat.length >= 0) {
                      this.has_nextassetcat = datapagination.has_next;
                      this.has_preassetcat = datapagination.has_previous;
                      this.currentpagecomasset = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  };

 autocompletebranch(){
   console.log('second');
   setTimeout(()=>{
     if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
       fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
         map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
         takeUntil(this.autocompleteTrigger.panelClosingActions)
       ).subscribe(
         x=>{
           const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
           const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
           const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
           const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
           if(atBottom){
            if(this.has_nextbranch){
              
              this.Faservice.getassetbranchdata(this.inputbranch.nativeElement.value,this.has_presentpage+1).subscribe((data:any)=>{
                let dear:any=data['data'];
                console.log('second');
                let pagination=data['pagination']
                this.checker_branch=this.checker_branch.concat(dear);
                if(this.checker_branch.length>0){
                  this.has_nextbranch=pagination.has_next;
                  this.has_previbranchlocation=pagination.has_previous;
                  this.has_presentpage=pagination.index;
                }
              })
            }
           }
         }
       )
     }
   })
 }
  checket_asset(data){
    this.asset_id=data.id;

  }
  checker_branchs(data){
    this.branch_id=data.id;
 };
 assetcheckerrepost(){
   let data:any={"assetgroup":[],"assetdetails_id":[]};
   for(let i=0;i<this.assetcatslist.length;i++){
     if(this.assetcatslist[i].is_checked){
      data['assetgroup']=this.assetcatslist[i].assetgroup_id;
      data['assetdetails_id']=this.assetcatslist[i].assetdetails_id;
     }
   }
   console.log('hii=',data);

   this.spinner.show();
   this.Faservice.getcheckersumrepost(data).subscribe((data:any)=>{
    if(data.status=="success"){
     this.spinner.hide();
     this.Toast.success('Repost Data Success');
     console.log(data);
     this.getassetcategorysummary();
    }
    else{
      this.spinner.hide();
      this.Toast.warning(data.code);
    }
   },
   (error:HttpErrorResponse)=>{
     console.log(error);
     this.errorHandler.errorHandler(error,'');
    //  this.Toast.error(error.status + error.statusText)
     this.spinner.hide();
   }
   );

 }
 assetcheckerreject(){
  if(this.reajectfrom.get('rejectReason').value =='' || this.reajectfrom.get('rejectReason').value ==null || this.reajectfrom.get('rejectReason').value ==undefined || this.reajectfrom.get('rejectReason').value ==""){
    this.Toast.warning('Please Select The Reason');
    return false;
  };
  let data:any;
  for(let i=0;i<this.assetcatslist.length;i++){
    if(this.assetcatslist[i].is_checked && this.assetcatslist[i]['assetdetails_status']=="PENDING"){
     data=this.assetcatslist[i].id;
    }
  }
  let reason:any=this.reajectfrom.get('rejectReason').value;
  console.log('hii',data);
  console.log('hii',this.reajectfrom.get('rejectReason').value);
  this.spinner.show();
  this.Faservice.getcheckerreject(data,reason).subscribe((data:any)=>{
    console.log('after=',data);
    if(data.status=="success"){
      this.spinner.hide();
      
      this.Toast.success('Successfully Rejected');
      this.getassetcategorysummary();
    }
    else{
      this.spinner.hide();
      console.log(data);
      this.Toast.warning(data.code,"",{timeOut: 5000});
      this.Toast.warning(data.description,"",{timeOut: 5000})
    }
   
  },
  (error)=>{
    console.log(error);
    this.errorHandler.errorHandler(error,'');
    this.spinner.hide();
    // this.Toast.error(error.status+error.statusText);
  }
  );
 }
 h: any[] = [];

  databtn(obj: any) {
    if ((obj.subcatname === "APsubcat" || "test")) {
      obj.subcatname = "FAILED"


    }


    this.h.push(obj)



    console.log("list2", this.list2)
    this.getassetcategorysummary()




  }
  assetcheckerView(obj: any) {
    console.log(obj)
    this.list1.push(obj);
    if(this.Grb_by=='Y'){
      // let data:any={'assetgroup_id':obj.assetgroup_id,'assetdetails_id':obj.assetdetails_id};
      let data:any="assetgroup=" + obj['assetgroup_id']+'&assetdetails_id='+obj['assetdetails_id'];
      this.shareservice.checkerlist.next(data);
    }
    else{
      // let data:any={'assetgroup_id':obj.id};
      let data:any="asset_id=" + obj['id'];
      this.shareservice.checkerlist.next(data);//assetgroup
    }
    
    console.log("chee", this.shareservice.checkerlist.value);

    console.log("list1", this.list1);
    this.router.navigate(['/fa/assetcheckerview'], { skipLocationChange: true })
   



  }
  isinvoice: boolean=true;
  isexpense: boolean
  invoiceBtn(e:number) {
    if(e==0){
    this.isinvoice = true;
    this.isexpense = false;
    }
    else{
      this.isexpense = true;
    this.isinvoice = false;
    }
  }
  abcd:boolean;
  btn() {
    window.alert("Error hit in CBS");



    this.abcd = true
    this.list2.push(this.h[this.h.length - 1])

    this.getassetcategorysummary()
  }
  resets(){
    this.checkersum.get('date').patchValue('');
    this.checkersum.get('assetcat').patchValue('');
    this.checkersum.get('branch').patchValue("");
    this.checkersum.get('crno').patchValue('');
    this.getassetcategorysummary();
  }
}
