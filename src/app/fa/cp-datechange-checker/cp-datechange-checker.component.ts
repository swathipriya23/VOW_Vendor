import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray,FormBuilder,FormControl,FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { data } from 'jquery';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, formatDate } from '@angular/common';
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
@Component({
  selector: 'app-cp-datechange-checker',
  templateUrl: './cp-datechange-checker.component.html',
  styleUrls: ['./cp-datechange-checker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class CpDatechangeCheckerComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('assetid') matassetid:MatAutocomplete;
  @ViewChild('inputassetid') inputassetid:any;

  @ViewChild('category') matcategory:MatAutocomplete;
  @ViewChild('inputcategory') inputcategory:any;

  @ViewChild('branch') matbranch:MatAutocomplete;
  @ViewChild('inputbranch') inputbranch:any;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  has_next:boolean=true;
  has_previous:boolean=false;
  has_presendpage:number=1;
  presentpage:number=1;
  pagesize:number=10;
  has_nextbranch:boolean=true;
  has_previousbranch:boolean=false;
  has_presentpage:number=1;

  has_nextassetid:boolean=true;
  has_previousassetid:boolean=false;
  has_presentpageasset:number=1;

  has_nextcategory:boolean=true;
  has_previouscategory:boolean=false;
  has_presentpagecategory:number=1;
  reason:any;
  checkedall:boolean=false;
  cpdatechecker:any=FormGroup;
  categorylist:Array<any>=[];
  branchlist:Array<any>=[];
  assetidlist:Array<any>=[];
  cpdatecheckerlist:Array<any>=[];
  isLoading:boolean=false;
  btn_enabled:boolean=true;
  assetid:any='';
  category:any='';
  branch:any='';
  page:number=1;
  // reasons:any=FormControl;
  reasonform:any=FormGroup;
  constructor(private datepipe:DatePipe,private toast:ToastrService,private fb:FormBuilder,private Faservice:faservice,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.cpdatechecker=this.fb.group({
      'assetidd':new FormControl(''),
      'assetvalue':new FormControl(),
      'capdate':new FormControl(),
      'category':new FormControl(''),
      'branch':new FormControl()
    });
    this.reasonform=this.fb.group({
      'reasons':new FormControl('')
    });
    this.Faservice.getcpdatecheckerassetid('',1).subscribe(data=>{
      this.assetidlist=data['data'];
      console.log(this.categorylist);
    });
    this.Faservice.getassetcategorynew('',1).subscribe(data=>{
      this.categorylist=data['data'];
      console.log(this.categorylist);
    });
    this.cpdatechecker.get('category').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetcategorynew(this.cpdatechecker.get('category').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.categorylist=data['data'];
      
    });
    // this.cpdatechecker.get('assetid').valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   map(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap((value:any)=>this.Faservice.getcpdatecheckerassetid(value,1).pipe(
    //     finalize(()=>{
    //       console.log(value)
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.assetidlist=data['data'];
      
    // });

    this.Faservice.getassetbranchdata('',1).subscribe(data=>{
      this.branchlist=data['data'];
    });
    this.cpdatechecker.get('branch').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetbranchdata(this.cpdatechecker.get('branch').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      console.log('enter')
      this.branchlist=data['data'];
    });

    this.cpdatechecker.get('assetidd').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((x:any)=>{
        this.isLoading=true;
        console.log(x)
      }),
      switchMap(v => this.Faservice.getcpdatecheckerassetid(this.cpdatechecker.get('assetidd').value,1).pipe(
        finalize(()=>{
          console.log(v)
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.assetidlist=data['data'];
    });
    this.getcpdatecheckerdata();
  }
  getcpdatecheckerdata(){
    let data:any={};
    let searh:string="page="+this.has_presendpage;
    if(this.cpdatechecker.get('assetvalue').value !=null && this.cpdatechecker.get('assetvalue').value !=""){
      console.log('ent')
     searh=searh+"&asset_value="+this.cpdatechecker.get('assetvalue').value;
    }
    if(this.cpdatechecker.get('assetidd').value !=null && this.cpdatechecker.get('assetidd').value !=""){
      searh=searh+"&assetid="+this.cpdatechecker.get('assetidd').value
     }
     if(this.cpdatechecker.get('capdate').value !=null && this.cpdatechecker.get('capdate').value !=""){
      let dateValue = this.datepipe.transform(this.cpdatechecker.get('capdate').value,'yyyy-MM-dd');
      searh=searh+"&capdate="+dateValue;
      console.log(dateValue)
     }
     if(this.cpdatechecker.get('category').value !=null && this.cpdatechecker.get('category').value !=""){
      searh=searh+"&cat="+this.category;
     }
     if(this.cpdatechecker.get('branch').value !=null && this.cpdatechecker.get('branch').value !=''){
      searh=searh+"&branch="+this.branch;
     }
    data['page']=searh;
    this.spinner.show();
    this.Faservice.getcpdatecheckerapprove(data).subscribe(data=>{
      this.cpdatecheckerlist=data['data'];
      console.log('fa=',data);
      let pagination=data['pagination'];
      this.spinner.hide();
      if(this.cpdatecheckerlist.length>0){
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.has_presendpage=pagination.index;
        this.page=pagination.index;
      }
    },
    (error)=>{
      this.spinner.hide();
    }
    );
    for(let i=0;i<this.cpdatecheckerlist.length;i++){
      this.cpdatecheckerlist[i]['is_checked']=false;
    }
    this.reasonform.reset('');
    // this.btn_enabled=true;

  }
  autocompletebranch(){
    setTimeout(()=>{
      if(this.matbranch && this.autocompletetrigger && this.matbranch.panel){
        fromEvent(this.matbranch.panel.nativeElement,'scroll').pipe(
          map(()=>this.matbranch.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          const scrollTop=this.matbranch.panel.nativeElement.scrollTop;
          const scrollHeight=this.matbranch.panel.nativeElement.scrollHeight;
          const elementHeight=this.matbranch.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1<=scrollTop+elementHeight;
          if(atBottom){
            if(this.has_nextbranch){
              this.Faservice.getassetbranchdata(this.inputbranch.nativeElement.value,this.has_presentpage+1).subscribe(data=>{
                let dts=data['data'];
                let pagination=data['pagination'];
                this.branchlist=this.branchlist.concat(dts);
                if(this.branchlist.length>0){
                  this.has_nextbranch=pagination.has_next;
                  this.has_previousbranch=pagination.has_previous;
                  this.has_presentpage=pagination.index;
                }
              })
            }

          }
        })
      }
    })
  }

  autocompletecategory(){
    setTimeout(()=>{
      if(this.matcategory && this.autocompletetrigger && this.matcategory.panel){
        fromEvent(this.matcategory.panel.nativeElement,'scroll').pipe(
          map(()=>this.matcategory.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          const scrollTop=this.matcategory.panel.nativeElement.scrollTop;
          const scrollHeight=this.matcategory.panel.nativeElement.scrollHeight;
          const elementHeight=this.matcategory.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1<=scrollTop+elementHeight;
          if(atBottom){
            if(this.has_nextcategory){
              this.Faservice.getassetcategorynew(this.inputbranch.nativeElement.value,this.has_presentpagecategory+1).subscribe(data=>{
                let dts=data['data'];
                let pagination=data['pagination'];
                this.categorylist=this.categorylist.concat(dts);
                if(this.categorylist.length>0){
                  this.has_nextcategory=pagination.has_next;
                  this.has_previouscategory=pagination.has_previous;
                  this.has_presentpagecategory=pagination.index;
                }
              })
            }

          }
        })
      }
    })
  }
  autocomplteasseid(){
    console.log('enter')
    setTimeout(()=>{
      if(this.matassetid && this.autocompletetrigger && this.matassetid.panel){
        fromEvent(this.matassetid.panel.nativeElement,'scroll').pipe(
          map(()=>this.matassetid.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          console.log('enter')
          const scrollTop=this.matassetid.panel.nativeElement.scrollTop;
          const scrollHeight=this.matassetid.panel.nativeElement.scrollHeight;
          const elementHeight=this.matassetid.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop + elementHeight;
          console.log('enter1',atBottom)
          if(atBottom){
            console.log('enter2')
            if(this.has_nextassetid){
              this.Faservice.getcpdatecheckerassetid(this.inputassetid.nativeElement.value,this.has_presentpageasset+1).subscribe(data=>{
                let dta=data['data'];
                let pagination=data['pagination'];
                this.assetidlist=this.assetidlist.concat(dta);
                if(this.assetidlist.length>0){
                  this.has_nextassetid=pagination.has_next;
                  this.has_previousassetid=pagination.has_previous;
                  this.has_presentpageasset=pagination.index;
                }
              })
            }
          }
        })
      }
    })
  }
  btn_next(){
    if(this.has_next){
      this.has_presendpage=this.has_presendpage+1;
      this.getcpdatecheckerdata();
    }
  }
  btn_previous(){
    if(this.has_previous){
      this.has_presendpage=this.has_presendpage-1;
      this.getcpdatecheckerdata();
    }
  }
  reasoncheckoff(data:any){
    this.reason=data.reason;
  }
  approvedata(data:any,event:any){
    if(event.currentTarget.checked){
      this.btn_enabled=false;
      for(let i=0;i<this.cpdatecheckerlist.length;i++){
        
        if(this.cpdatecheckerlist[i].id==data.id){
        this.cpdatecheckerlist[i].is_checked=true;
       
        }
      }
    }
    else{
      this.checkedall=false;
      this.btn_enabled=true;
      for(let i=0;i<this.cpdatecheckerlist.length;i++){
        if(this.cpdatecheckerlist[i].id==data.id){
        this.cpdatecheckerlist[i].is_checked=false;
      }}
    }
    for(let d of this.cpdatecheckerlist){
      if(d.is_checked){
        this.btn_enabled=false;
        break;
      }
    }
  }
  arrovealldata(event:any){
    
    if(event.currentTarget.checked){
      
      for(let i=0;i<this.cpdatecheckerlist.length;i++){
        this.checkedall=true;
        this.btn_enabled=false;
        this.cpdatecheckerlist[i].is_checked=true;
      }
    }
    else{
      this.checkedall=false;
      this.btn_enabled=true;
      for(let i=0;i<this.cpdatecheckerlist.length;i++){
        this.cpdatecheckerlist[i].is_checked=false;
      }
    }
  }
  finalapprovedata(){
    let dta:any={'capdate_id':[],"status":"APPROVE"};
    for(let i=0;i<this.cpdatecheckerlist.length;i++){
      if(this.cpdatecheckerlist[i].is_checked){
        dta['capdate_id'].push(this.cpdatecheckerlist[i].id);
      }
    }
    console.log(dta);
    this.spinner.show();
    this.Faservice.getcpdatecheckerfinalappove(dta).subscribe(data_obj=>{
      console.log('here')
      console.log(data_obj);

      if (data_obj['status']=='success'){
        this.getcpdatecheckerdata();
        this.spinner.hide();
        this.toast.success('Succesfully Updated..');
        this.btn_enabled=true;
      }
      else{
        this.spinner.hide();
        this.toast.error(data_obj['code']);
        this.toast.error(data_obj['description']);
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toast.error("Failed To Approve");
    }
    )


  }
  finalrejecteddata(){
    if(this.reasonform.get('reasons').value =='' || this.reasonform.get('reasons').value =="" || this.reasonform.get('reasons').value==null || this.reasonform.get('reasons').value==undefined){
      this.toast.warning('Please Enter The Reason');
      return false;
    }
    let dta:any={'capdate_id':[],"status":"REJECT",'reason':this.reasonform.get('reasons').value};
    for(let i=0;i<this.cpdatecheckerlist.length;i++){
      if(this.cpdatecheckerlist[i].is_checked){
        dta['capdate_id'].push(this.cpdatecheckerlist[i].id);
      }
    }
    console.log(dta);
    this.spinner.show();
    this.Faservice.getcpdatecheckerfinalreject(dta).subscribe(data=>{
      console.log(data);
      this.getcpdatecheckerdata();
      this.spinner.hide();
      if (data['status']=='success'){
        this.toast.success('Successfully Rejected');

      }
      else{
        this.toast.error(data['code'])
        this.toast.error(data['description'])

      }
      this.reasonform.reset('');
      this.btn_enabled=true;
    },
    (error)=>{
      console.log(error);
      this.spinner.hide();
      this.toast.error('Failed To Reject');
    }
    )
  };
  assetofid(data:any){
    this.assetid=data.assetdetails_id;
  }
  categorydata(data:any){
    this.category=data.id;
  }
  branchdata(data:any){
    this.branch=data.id;
  }
  resets(){
    this.cpdatechecker.get('assetvalue').patchValue('');
    this.cpdatechecker.get('assetidd').patchValue('');
    this.cpdatechecker.get('capdate').patchValue('');
    this.cpdatechecker.get('category').patchValue('');
    this.cpdatechecker.get('branch').patchValue('');
    this.btn_enabled=true;
    this.getcpdatecheckerdata();
  }
  searchdata(){
    let data:any={};
    let searh:string="page="+this.has_presendpage;
    if(this.cpdatechecker.get('assetvalue').value !=null && this.cpdatechecker.get('assetvalue').value !=""){
      console.log('ent')
     searh=searh+"&asset_value="+this.cpdatechecker.get('assetvalue').value;
    }
    if(this.cpdatechecker.get('assetidd').value !=null && this.cpdatechecker.get('assetidd').value !=""){
      searh=searh+"&assetid="+this.cpdatechecker.get('assetidd').value
     }
     if(this.cpdatechecker.get('capdate').value !=null && this.cpdatechecker.get('capdate').value !=""){
      let dateValue = this.datepipe.transform(this.cpdatechecker.get('capdate').value,'yyyy-MM-dd');
      searh=searh+"&capdate="+dateValue;
      console.log(dateValue)
     }
     if(this.cpdatechecker.get('category').value !=null && this.cpdatechecker.get('category').value !=""){
      searh=searh+"&cat="+this.category;
     }
     if(this.cpdatechecker.get('branch').value !=null && this.cpdatechecker.get('branch').value !=''){
      searh=searh+"&branch="+this.branch;
     }
     data['page']=searh;
     console.log(searh);
     this.spinner.show();
      this.Faservice.getcpdatecheckerapprove(data).subscribe(data=>{
        this.spinner.hide();
        console.log(data);
        let pagination=data['pagination'];
        
        if(data['data'].length==0){
          this.spinner.hide();
          this.cpdatecheckerlist=[];
          this.toast.warning('Matching Record Not Found');
        }
        else{
          this.cpdatecheckerlist=data['data'];
          this.spinner.hide();
        }
        if(this.cpdatecheckerlist.length>0){
          this.has_next=pagination.has_next;
          this.has_previous=pagination.has_previous;
          this.has_presendpage=pagination.index;
          this.page=pagination.index;
        }
        for(let i=0;i<this.cpdatecheckerlist.length;i++){
          this.cpdatecheckerlist[i]['is_checked']=false;
        }
      },
      (error)=>{
        this.spinner.hide();
        console.log(error);
      }
      )
  }


}
