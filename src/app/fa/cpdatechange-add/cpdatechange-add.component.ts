import { Component, OnInit, Inject, ViewChild, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
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
  selector: 'app-cpdatechange-add',
  templateUrl: './cpdatechange-add.component.html',
  styleUrls: ['./cpdatechange-add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class CpdatechangeAddComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger:MatAutocompleteTrigger;
  @ViewChild('category') matcategory:MatAutocomplete;
  @ViewChild('inputcategory') inputcategory;any;

  @ViewChild('branch') matbranchAutocomplete:MatAutocomplete;
  @ViewChild('inputbranch') inputbranch:any;

  @ViewChild('assetid') matassetidauto:MatAutocomplete;
  @ViewChild('inputassetid') inputasset:any;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  cpdatechangeadd:any=FormGroup;
  assetcatlist: Array<any>=[];
  assetcatid:Array<any>=[];
  has_next = true;
  has_previous = true;
  iscpdatemakeradd: boolean;
  ismakerCheckerButton: boolean;
  checkedValues: boolean=false;
  has_nextcpadd = false;
  has_previouscpadd = false;
  presentpagecpadd: number = 1;
  date=new Date();
  // year=this.date.getFullYear()+'-04'+'-1';
  month:any=this.date.getMonth();
  year=this.date.getFullYear().toString()+'-'+this.month.toString()+'-'+this.date.getDate().toString();
  // startdate:any=(this.date.getFullYear()+1)+'-03'+'-31';
  startdate:any=this.date;
  isLoading:boolean=false;
  categorylist:Array<any>=[];
  branchlist:Array<any>=[];
  pageSize = 10;
  // has_next:boolean=true;
  // has_previous:boolean=true;
  has_presentpage:number=1;

  has_nextbrach:boolean=true;
  has_previousbranch:boolean=true;
  has_presentpagebranch:number=1;

  has_nextid:boolean=true;
  has_previousid:boolean=true;
  has_presentid:number=1;
  assetid:any;
  category:any;
  branch:any;
  reasonform:any=FormGroup;
  enb_data:boolean=false;
  page:number=1;
  minDate:any;
  constructor(private datepipe:DatePipe,private toast:ToastrService,private notification: NotificationService, private router: Router
    , private Faservice: faservice,private fb:FormBuilder,private spinner:NgxSpinnerService ) { }

  ngOnInit(): void {
    let d:any={"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sept":9,"Oct":10,"Nov":11,"Dec":12};
    //console.log('h=',this.startdate.toString().split(" ")[1])
    if(d[this.startdate.toString().split(" ")[1]] >= 4){
      this.minDate=this.startdate.getFullYear().toString()+'-'+'04-01';
      //console.log('1=',this.minDate)
    }
    else{
      let year:any=this.startdate.getFullYear()-1;
      this.minDate=year.toString()+'-'+'04-01';
      //console.log('2=',this.minDate);
    }
    //console.log(this.date)
    this.cpdatechangeadd=this.fb.group({
      'assetid':new FormControl(),
      'assetvalue':new FormControl(),
      'cpdate':new FormControl(),
      'category':new FormControl(''),
      'branch':new FormControl()

    });
    this.reasonform=this.fb.group({
      'reason':new FormControl(),
      'dates':new FormControl()
    })
    this.Faservice.getassetcategorynew('',1).subscribe(data=>{
      this.categorylist=data['data'];
      
    });
    this.cpdatechangeadd.get('category').valueChanges.pipe(
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetcategorynew( this.cpdatechangeadd.get('category').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.categorylist=data['data'];
    });
    this.Faservice.getassetbranchdata('',1).subscribe(data=>{
      this.branchlist=data['data'];
    });
    this.cpdatechangeadd.get('branch').valueChanges.pipe(
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getassetbranchdata(this.cpdatechangeadd.get('branch').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchlist=data['data'];
    });
    this.Faservice.getcpdatecheckerassetid('',1).subscribe(data=>{
      console.log('ravi=',data['data'])
      this.assetcatid=data['data'];
    })
    this.cpdatechangeadd.get('assetid').valueChanges.pipe(
      map(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getcpdatecheckerassetid(this.cpdatechangeadd.get('assetid').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.assetcatid=data['data'];
    })

    this.getassetcategorysummary();
    

  }
  autocompletecategory(){
    setTimeout(()=>{
    if(this.matcategory && this.autocompletetrigger && this.matcategory.panel){
      fromEvent(this.matcategory.panel.nativeElement,'scroll').pipe(
        map((x:any)=>this.matcategory.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletetrigger.panelClosingActions)

      ).subscribe(
        x=>{
          const scrollTop = this.matcategory.panel.nativeElement.scrollTop;
          const scrollHeight = this.matcategory.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcategory.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            if(this.has_next == true){
              this.Faservice.getassetcategorynew(this.inputcategory.nativeElement.value, this.has_presentpage+1).subscribe(data=>{
                // this.assetcategorylist=data['data'];
                let datapagination=data['pagination'];
                this.categorylist=this.categorylist.concat(data['data']);
                if(this.categorylist.length>0){
                  this.has_next=datapagination.has_next;
                  this.has_previous=datapagination.has_previous;
                  this.has_presentpage=datapagination.index;
                }
              })
            }
          }
        }
      )
    }
  })
  };
  autocompletecategorybranch(){
    setTimeout(()=>{
    if(this.matbranchAutocomplete && this.autocompletetrigger && this.matbranchAutocomplete.panel){
      fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
        map((x:any)=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletetrigger.panelClosingActions)

      ).subscribe(
        x=>{
          const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            if(this.has_nextbrach == true){
              this.Faservice.getassetbranchdata(this.inputbranch.nativeElement.value,this.has_presentpagebranch+1).subscribe(data=>{
                // this.assetcategorylist=data['data'];
                let datapagination=data['pagination'];
                this.branchlist=this.branchlist.concat(data['data']);
                if(this.branchlist.length>0){
                  this.has_nextbrach=datapagination.has_next;
                  this.has_previousbranch=datapagination.has_previous;
                  this.has_presentpagebranch=datapagination.index;
                }
              })
            }
          }
        }
      )
    }
  })
}
  autocompleteid(){
    setTimeout(()=>{
      if(this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel){
        fromEvent(this.matassetidauto.panel.nativeElement,'scroll').pipe(
          map(x=> this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          const scrollTop=this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight=this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight=this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1<=scrollTop +elementHeight;
          if(atBottom){
            if(this.has_nextid){
              this.Faservice.getcpdatecheckerassetid(this.inputasset.nativeElement.value,this.has_presentid+1).subscribe(data=>{
                let dts=data['data'];
                console.log('h--=',data);
                let pagination=data['pagination'];
                this.assetcatid=this.assetcatid.concat(dts);
                if(this.assetcatid.length>0){
                  this.has_nextid=pagination.has_next;
                  this.has_presentid=pagination.has_previous;
                  this.has_presentid=pagination.index;
                }
              })
            }
          }
        })
      }
    })
  }


  getassetcategorysummary(pageNumber = 1, pageSize = 10) {
    let data:any={};
    let searh:string="page="+this.presentpagecpadd;
    if(this.cpdatechangeadd.get('assetvalue').value !=null && this.cpdatechangeadd.get('assetvalue').value !=""){
      console.log('ent')
     searh=searh+"&asset_value="+this.cpdatechangeadd.get('assetvalue').value;
    }
    if(this.cpdatechangeadd.get('assetid').value !=null && this.cpdatechangeadd.get('assetid').value !=""){
      searh=searh+"&assetid="+this.cpdatechangeadd.get('assetid').value
     }
     if(this.cpdatechangeadd.get('cpdate').value !=null && this.cpdatechangeadd.get('cpdate').value !=""){
      let dateValue = this.datepipe.transform(this.cpdatechangeadd.get('cpdate').value,'yyyy-MM-dd');
      searh=searh+"&capdate="+dateValue;
      console.log(dateValue)
     }
     if(this.cpdatechangeadd.get('category').value !=null && this.cpdatechangeadd.get('category').value !=""){
      searh=searh+"&cat="+this.category
     }
     if(this.cpdatechangeadd.get('branch').value !=null && this.cpdatechangeadd.get('branch').value !=""){
      searh=searh+"&branch="+this.branch;
     }
    data['page']=searh;
    this.spinner.show();
    this.Faservice.getcpdateaddsummary(data)
      .subscribe((result) => {
        console.log("landlord", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        for(let i=0;i<this.assetcatlist.length;i++){
          this.assetcatlist[i]['is_checked']=false;
        }
        // this.checkedValues = this.assetcatlist.map(() => false);
        this.spinner.hide();
        console.log("landlord", this.assetcatlist)
        if (this.assetcatlist.length >= 0) {
         
          this.has_nextcpadd = datapagination.has_next;
          this.has_previouscpadd = datapagination.has_previous;
          this.presentpagecpadd = datapagination.index;
        }
        for(let i=0;i<this.assetcatlist.length;i++){
          this.assetcatlist[i]['is_checked']=false;
          if(this.assetcatlist[i]['validations'] =={}){
            this.assetcatlist[i]['valid']=false;
          }
          else{
            this.assetcatlist[i]['valid']=true;
          }
          
        }

      },
      (error)=>{
        this.spinner.hide();
      }
      )

  }
  // assetBtn() {
  //   this.iscpdatemakeradd = true;
  //   this.getassetcategorysummary();





  //   yourfunc(e) {
  //     this.ischeck=true

  //  }

  //  checkBtn() {
  //   this.ischeck = !this.ischeck;
  // }

  // get ischeck() {
  //   if(this.checkedValues.length==0){
  //     return false
  //   }
  //   else{
  //     return true;
  //   }
    // return this.checkedValues.some(b => b);
  





  // }







  // assetcheckerView(){
  //   this.router.navigate(['/fa/assetcheckerview'], { skipLocationChange: true })


  // }




  nextClick() {

    if (this.has_nextcpadd === true) {
      this.presentpagecpadd=this.presentpagecpadd+1;
      this.getassetcategorysummary(this.presentpagecpadd + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previouscpadd === true) {
      this.presentpagecpadd=this.presentpagecpadd-1;
      this.getassetcategorysummary(this.presentpagecpadd - 1, 10)

    }
  }


  trade = [
    { label: ' Check', selected: false },

  ];

  allTrades(event) {
    const checked = event.target.checked;
    this.trade.forEach(item => item.selected = checked);
  }
  assetidss(data:any){
    this.assetid=data.id;
  }

  categorys(data:any){
    this.category=data.id;
  }
  branchs(data:any){
    console.log(data);
    this.branch=data.id;
    console.log(this.branch)
  }

  trd: string

  handleSelected($event, trd) {
    trd.selected = $event.target.checked;
  }
submitteddata(data:any,event){
  console.log(event.currentTarget.checked);
  console.log(data);
  if(event.currentTarget.checked){
    
  for(let i=0;i<this.assetcatlist.length;i++){
    if(this.assetcatlist[i].id==data.id){
      this.assetcatlist[i].is_checked=true;
      this.checkedValues=true;
      this.startdate=this.datepipe.transform(this.assetcatlist[i].createdate,"yyyy-MM-dd");
      this.reasonform.reset();
      // this.date=this.datepipe.transform(this.assetcatlist[i].createdate,"yyyy-MM-dd");
      // this.minDate=this.datepipe.transform(this.assetcatlist[i].createdate,"yyyy-MM-dd");
      console.log(this.startdate);
    }
    // else{
    //   this.assetcatlist[i].is_checked=false;
    //   this.checkedValues=true;
    // }
  }
}
else{
  this.enb_data=false;
  for(let i=0;i<this.assetcatlist.length;i++){
    if(this.assetcatlist[i].id==data.id){
      this.assetcatlist[i].is_checked=false;
      this.checkedValues=false;
    }
  }

}
for(let d of this.assetcatlist){
  if(d.is_checked){
    this.checkedValues=true;
  }
}
}

cpdatesummary(){
  if(this.reasonform.get('reason').value ==null || this.reasonform.get('reason').value ==''){
    this.notification.showWarning('Please Enter The Reason');
    return false;
  }
  if(this.reasonform.get('dates').value ==null || this.reasonform.get('dates').value ==''){
    this.notification.showWarning('Please Select Valid Date');
    return false;
  }
  console.log(this.reasonform.value);
  let data:any=[];
  let dear:any={};
  for(let i=0;i<this.assetcatlist.length;i++){
    if(this.assetcatlist[i].is_checked){
      data.push(this.assetcatlist[i].id);
    }
  }
  if(data.length==0){
    this.toast.warning('Please Select The Any Data:');
    return false;
  }
  dear['assetid_list']=data;
  dear['reason']=this.reasonform.get('reason').value;
  let da:any=this.datepipe.transform(this.reasonform.get('dates').value,"yyyy-MM-dd");
  dear['capdate']=da;
  console.log(dear['capdate']);
  console.log(dear);
  this.spinner.show();
  this.Faservice.getcpdateaddapprove(dear).subscribe(data=>{
    this.checkedValues=false;
    console.log(data);
    if(data['status']=='success'){
      this.toast.success('Successfully Updated..');
      this.cpdatechangeadd.get('assetvalue').patchValue('');
  this.cpdatechangeadd.get('assetid').patchValue("");
  this.cpdatechangeadd.get('cpdate').patchValue("");
  this.cpdatechangeadd.get('category').patchValue('');
  this.cpdatechangeadd.get('branch').patchValue('');
    this.getassetcategorysummary();
    this.spinner.hide();
    }
    else{
      this.toast.error(data['description']);
    }
    
  },
  (error)=>{
    this.toast.error('Failed to Upload')
    this.spinner.hide();
  }
  )

}
approvealldata(event:any){
  if(event.currentTarget.checked){
    if(this.assetcatlist.length>0){
      this.enb_data=true;
      this.checkedValues=true;
    }
   
    for(let i=0;i<this.assetcatlist.length;i++){
      if(!this.assetcatlist[i]['validations']['disable']){
        this.assetcatlist[i].is_checked=true;
      }
      else{
        this.assetcatlist[i].is_checked=false;
      }
      
    }
  }
  else{
    this.enb_data=false;
    this.checkedValues=false;
    for(let i=0;i<this.assetcatlist.length;i++){
      this.assetcatlist[i].is_checked=false;
    }
  }
}
assetcheckermove(){
  this.router.navigate(['fa/cpdatechangesummary']);
}
resets(){
  this.presentpagecpadd=1;
  this.cpdatechangeadd.get('assetvalue').patchValue('');
  this.cpdatechangeadd.get('assetid').patchValue("");
  this.cpdatechangeadd.get('cpdate').patchValue("");
  this.cpdatechangeadd.get('category').patchValue('');
  this.cpdatechangeadd.get('branch').patchValue('');
  this.getassetcategorysummary();
}
searchdata(){
  this.presentpagecpadd=1;
  let data:any={};
  let searh:string="page="+this.presentpagecpadd;
  if(this.cpdatechangeadd.get('assetvalue').value !=null && this.cpdatechangeadd.get('assetvalue').value !=""){
    console.log('ent')
   searh=searh+"&asset_value="+this.cpdatechangeadd.get('assetvalue').value;
  }
  if(this.cpdatechangeadd.get('assetid').value !=null && this.cpdatechangeadd.get('assetid').value !=""){
    searh=searh+"&assetid="+this.cpdatechangeadd.get('assetid').value;
   }
   if(this.cpdatechangeadd.get('cpdate').value !=null && this.cpdatechangeadd.get('cpdate').value !=""){
    let dateValue = this.datepipe.transform(this.cpdatechangeadd.get('cpdate').value,'yyyy-MM-dd');
    searh=searh+"&capdate="+dateValue;
    console.log(dateValue)
   }
   if(this.cpdatechangeadd.get('category').value !=null && this.cpdatechangeadd.get('category').value !=""){
    searh=searh+"&cat="+this.category;
   }
   if(this.cpdatechangeadd.get('branch').value !=null && this.cpdatechangeadd.get('branch').value !=""){
    searh=searh+"&branch="+this.branch;
   }
   data['page']=searh;
   console.log(searh);
   this.spinner.show();
    this.Faservice.getcpdateaddsummary(data).subscribe(data=>{
      console.log(data);
      let datapagination=data['pagination'];
      if(data['data'].length==0){
        this.assetcatlist=[];
        this.toast.warning('No Records Not Found');
        this.spinner.hide();
      }
      else{
        this.assetcatlist=data['data'];
        this.spinner.hide();
      }
      if (this.assetcatlist.length > 0) {
        this.enb_data=false;
        this.checkedValues=false;
        this.has_nextcpadd = datapagination.has_next;
        this.has_previouscpadd = datapagination.has_previous;
        this.presentpagecpadd = datapagination.index;
      }
      this.spinner.hide();
      for(let i=0;i<this.assetcatlist.length;i++){
        this.assetcatlist[i]['is_checked']=false;
        if(this.assetcatlist[i]['validations'] =={}){
          this.assetcatlist[i]['valid']=false;
        }
        else{
          this.assetcatlist[i]['valid']=true;
        }
        
      }
    },
    (error)=>{
      this.spinner.hide();
      console.log(error);
    }
    )
}
}

