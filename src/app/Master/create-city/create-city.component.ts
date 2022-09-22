import { Component, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { EventEmitter } from 'stream';
import { masterService } from '../master.service';
import { NotificationService } from 'src/app/service/notification.service';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { Console } from 'console';

export interface pincode{
  id:string;
  no:string
}
export interface state{
  id:string;
  name:string;
  country_id:string;
}
export interface district{
  id:string;
  name:string;
}
export interface city{
  id:string;
  name:string;
}
export interface country{
  id:string;
  name:string;
}
@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss']
})
export class CreateCityComponent implements OnInit {
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  @ViewChild('snameref') matstate:MatAutocomplete;
  @ViewChild('stateinput') stateInput:any;
  @ViewChild('snamerefd') matdstate:MatAutocomplete;
  @ViewChild('Dstateinput') dstateInput:any;

  @ViewChild('snamerefcd') matcdstate:MatAutocomplete;
  @ViewChild('cdstateinput') cdstateInput:any;
  @ViewChild('cdistrictnameref') matcdstatec:MatAutocomplete;
  @ViewChild('cdistrictinputdata') ccdstateInput:any;
  @ViewChild('cdnameref') matcdcityc:MatAutocomplete;
  @ViewChild('citynamec') ccdcityInput:any;

  @ViewChild('districtinput') districtInput;
  @ViewChild('districtnameref') matdistrict:MatAutocomplete;
  @ViewChild('districtinputdata') districtInputdata;
  @ViewChild('districtnamerefdata') matdistrictdata:MatAutocomplete;
  @ViewChild('cnameref') matcity:MatAutocomplete;
  @ViewChild('cityname') cityInput;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger:MatAutocompleteTrigger;
  isLoading:boolean=false;
  countryform:any=FormGroup;
  stateform:any=FormGroup;
  cityform:any=FormGroup;
  districtform:any=FormGroup;
  statenamelist:Array<any>=[];
  statelist: Array<any>=[];
  cstatelist: Array<any>=[];
  citynamelist:Array<any>=[];
  citylist: Array<any>=[];
  districtnamelist:Array<any>=[];
  districtlist: Array<any>=[];
  cdistrictlist: Array<any>=[];
  ccitylist: Array<any>=[];
  pincodelist:Array<any>=[];
  countryList:Array<any>=[];
  cityenb:boolean=true;
  cityenbbtn:boolean=false;
  cityenbcan:boolean=false;
  citysenb:boolean=true;
  citysenbbtn:boolean=false;
  citysenbcan:boolean=false;
  cityssenb:boolean=true;
  cityssenbbtn:boolean=false;
  cityssenbcan:boolean=false;
  has_statenxt:boolean=true;
  has_statepre:boolean=false;
  has_statepage:number=1;
  has_districtnxt:boolean=true;
  has_districtpre:boolean=false;
  has_districtpage:number=1;
  has_citynxt:boolean=true;
  has_citypre:boolean=false;
  has_cittpage:number=1;
  statenamelistNew:Array<any>=[];
  citynamelistNew:Array<any>=[];
  districtnamelistNew:Array<any>=[];
  pincodelistNew:Array<any>=[];
  newcitynamelist:Array<any>=[];
  constructor(private fb:FormBuilder,private masterService:masterService,private notofication:NotificationService) { }

  ngOnInit(): void {
    this.cityform=this.fb.group({
      'cstate':new FormControl(''),
      'cdistrict':new FormControl(''),
      'ccityname':new FormControl(''),
      'newcityname':new FormControl(''),
      'cpincode':new FormControl('')
    });
    this.districtform=this.fb.group({
      'statename':new FormControl(''),
      'districtname':new FormControl(''),
      'newdistrict':new FormControl('')
    });
    this.stateform=this.fb.group({
      'country':new FormControl(''),
      'name':new FormControl(''),
      'newstate':new FormControl(''),
      'newstategst':new FormControl('')
    });
    // this.districtform=this.fb.group({
    //   'statename':new FormControl(''),
    //   'districtname':new FormControl(''),
    //   'newdistrict':new FormControl('')
    // });
    // this.cityform.get('cstate').valueChanges.pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap(value=> this.masterService.getstatedatafilter(this.stateform.get('country').value.id,value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //       console.log(value);
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.cstatelist=data['data'];
    // });
   
    // this.stateform.get('name').valueChanges.pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap(value=> this.masterService.getstatedatafilter(this.stateform.get('country').value.id,value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.statenamelist=data['data'];
    // // });
    // this.districtform.get('statename').valueChanges.pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap(value=> this.masterService.getstatedatafilter(this.stateform.get('country').value.id,value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.statelist=data['data'];
    // });
    
   
    this.cityform.get('cpincode').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterService.getPincodeList(value,'asc',1,10).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.pincodelist=data['data'];
    });
    this.districtform.get('districtname').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterService.getdistrictdatafilter(this.districtform.get('statename').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.districtnamelist=data['data'];
    });
    // this.cityform.get('cdistrict').valueChanges.pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap((value:any)=>this.masterService.getdistrictdatafilter(this.cityform.get('cstate').value.id,value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.districtnamelist=data['data'];
    // });
    this.cityform.get('ccityname').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterService.getcitydatafilter(this.cityform.get('cstate').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ccitylist=data['data'];
    });
  }
  getstatelistdataNew(){
    console.log('o')
    if(this.stateform.get('country').value.id==undefined || this.stateform.get('country').value=='' || this.stateform.get('country').value==null || this.stateform.get('country').value==""){
      this.notofication.showError('Please Select The Country');
      return false;
    }
    this.masterService.getstatedatafilter(this.stateform.get('country').value.id,'',1).subscribe(data=>{
      this.cstatelist=data['data'];
      console.log(this.statenamelist)
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    );
    this.cityform.get('cstate').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterService.getstatedatafilter(this.stateform.get('country').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.cstatelist=data['data'];
    })
  }
  getdistrictnamelistNew(){
        console.log(this.cityform.value)
        if(this.cityform.get('cstate').value.id==undefined || this.cityform.get('cstate').value=='' || this.cityform.get('cstate').value==""){
          this.notofication.showError('Please Select The State');
          return false;
        }
        this.masterService.getdistrictdatafilter(this.cityform.get('cstate').value.id,'',1).subscribe(data=>{
          this.cdistrictlist=data['data'];
        },
        (errror)=>{
          this.notofication.showError(errror.status+errror.statusText);
        }
        );
        this.cityform.get('cdistrict').valueChanges.pipe(
          tap(()=>{
            this.isLoading=true;
          }),
          switchMap((value:any)=>this.masterService.getdistrictdatafilter(this.cityform.get('cstate').value.id,value,1).pipe(
            finalize(()=>{
              this.isLoading=false;
            })
          ))
        ).subscribe(data=>{
          this.cdistrictlist=data['data'];
        })
    }
    getcitynamelistNew(){
      console.log('U')
      if(this.cityform.get('cstate').value.id==undefined || this.cityform.get('cstate').value.id==null || this.cityform.get('cstate').value==''){
        this.notofication.showError('please Select The State');
        return false;
      }
      if(this.cityform.get('cdistrict').value.id==undefined || this.cityform.get('cdistrict').value.id==null || this.cityform.get('cdistrict').value==''){
        this.notofication.showError('please Select The District');
        return false;
      }
  
      this.masterService.getcitydatafilter(this.cityform.get('cstate').value.id,'',1).subscribe(data=>{
        this.ccitylist=data['data'];
      },
      (error)=>{
        this.notofication.showError(error.status+error.statusText);
      }
      );
     
    }
    autocompleteDeptScrollstateNew() {
      setTimeout(() => {
        if (
          this.matstate &&
          this.autocompleteTrigger &&
          this.matstate.panel
        ) {
          fromEvent(this.matstate.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matstate.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matstate.panel.nativeElement.scrollTop;
              const scrollHeight = this.matstate.panel.nativeElement.scrollHeight;
              const elementHeight = this.matstate.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_statenxt === true) {
                  this.masterService.getstatedatafilter(this.stateform.get('country').value.id,this.stateInput.nativeElement.value,this.has_statepage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.statenamelistNew = this.statenamelistNew.concat(datas);
                      if (this.statenamelistNew.length >= 0) {
                        this.has_statenxt = datapagination.has_next;
                        this.has_statepre = datapagination.has_previous;
                        this.has_statepage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
    autocompleteDeptScrolldistrictNew() {
      console.log(2)
      setTimeout(() => {
        if (
          this.matdistrictdata &&
          this.autocompleteTrigger &&
          this.matdistrictdata.panel
        ) {
          fromEvent(this.matdistrictdata.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matdistrictdata.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matdistrictdata.panel.nativeElement.scrollTop;
              const scrollHeight = this.matdistrictdata.panel.nativeElement.scrollHeight;
              const elementHeight = this.matdistrictdata.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_districtnxt === true) {
                  this.masterService.getdistrictdatafilter(this.cityform.get('cstate').value.id,this.districtInput.nativeElement.value,this.has_districtpage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.districtnamelist = this.districtnamelist.concat(datas);
                      if (this.districtnamelist.length >= 0) {
                        this.has_districtnxt = datapagination.has_next;
                        this.has_districtpre = datapagination.has_previous;
                        this.has_districtpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    
    }
    autocompletescrolldistrict() {
      console.log('call');
      setTimeout(() => {
        if (
          this.matdistrict &&
          this.autocompleteTrigger &&
          this.matdistrict.panel
        ) {
          fromEvent(this.matdistrict.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matdistrict.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matdistrict.panel.nativeElement.scrollTop;
              const scrollHeight = this.matdistrict.panel.nativeElement.scrollHeight;
              const elementHeight = this.matdistrict.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_districtnxt === true) {
                  this.masterService.getdistrictdatafilter(this.districtform.get('statename').value.id,this.districtInput.nativeElement.value,this.has_districtpage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.districtnamelist = this.districtnamelist.concat(datas);
                      if (this.districtnamelist.length >= 0) {
                        this.has_districtnxt = datapagination.has_next;
                        this.has_districtpre = datapagination.has_previous;
                        this.has_districtpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    
    }
    autocompletescrolldistrictc() {
      console.log('call');
      setTimeout(() => {
        if (
          this.matcdstatec &&
          this.autocompleteTrigger &&
          this.matcdstatec.panel
        ) {
          fromEvent(this.matcdstatec.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matcdstatec.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matcdstatec.panel.nativeElement.scrollTop;
              const scrollHeight = this.matcdstatec.panel.nativeElement.scrollHeight;
              const elementHeight = this.matcdstatec.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_districtnxt === true) {
                  this.masterService.getdistrictdatafilter(this.cityform.get('cstate').value.id,this.districtInput.nativeElement.value,this.has_districtpage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.cdistrictlist = this.cdistrictlist.concat(datas);
                      if (this.cdistrictlist.length >= 0) {
                        this.has_districtnxt = datapagination.has_next;
                        this.has_districtpre = datapagination.has_previous;
                        this.has_districtpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    
    }
    autocompleteDeptScrollcityNew() {
      console.log('i')
      setTimeout(() => {
        if (
          this.matcdcityc &&
          this.autocompleteTrigger &&
          this.matcdcityc.panel
        ) {
          fromEvent(this.matcdcityc.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matcdcityc.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matcdcityc.panel.nativeElement.scrollTop;
              const scrollHeight = this.matcdcityc.panel.nativeElement.scrollHeight;
              const elementHeight = this.matcdcityc.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_citynxt === true) {
                  this.masterService.getcitydatafilter(this.cityform.get('cstate').value.id,this.ccdcityInput.nativeElement.value,this.has_cittpage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.ccitylist = this.ccitylist.concat(datas);
                      if (this.ccitylist.length >= 0) {
                        this.has_citynxt = datapagination.has_next;
                        this.has_citypre = datapagination.has_previous;
                        this.has_cittpage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    
    }
  public getdislaypincodeinterface(data?:pincode):string | undefined{
    return data?data.no:undefined;
  }
  public getdisplaystateinterface(data?:state):string | undefined{
    return data?data.name:undefined;
  }
  public getdisplaydistrictinterface(data?:district):string | undefined{
    return data?data.name:undefined;
  }
  public getdisplaycityinterface(data?:city):string | undefined{
    return data?data.name:undefined;
  }
  public getdisplaycountryinterface(data?:country):string | undefined{
    return data? data.name:undefined;
  }
  getcountrylist(){
    this.masterService.getCountryList('','asc',1,10).subscribe(data=>{
      this.countryList=data['data'];
    });
  }
  getpincodelist(){
    this.masterService.getPincodeList().subscribe(data=>{
      this.pincodelist=data['data'];
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    );
  }
  getstatelistdata(){
    console.log('hii')
    if(this.stateform.get('country').value.id==undefined || this.stateform.get('country').value=='' || this.stateform.get('country').value==null || this.stateform.get('country').value==""){
      this.notofication.showError('Please Select The Country');
      return false;
    }
    this.masterService.getstatedatafilter(this.stateform.get('country').value.id,'',1).subscribe(data=>{
      this.statenamelist=data['data'];
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    );
  }
  getdistrictnamelist(){
    console.log(this.districtform.value)
    if(this.districtform.get('statename').value.id==undefined || this.districtform.get('statename').value=='' || this.districtform.get('statename').value==""){
      this.notofication.showError('Please Select The State');
      return false;
    }
    this.masterService.getdistrictdatafilter(this.districtform.get('statename').value.id,'',1).subscribe(data=>{
      this.districtnamelist=data['data'];
    },
    (errror)=>{
      this.notofication.showError(errror.status+errror.statusText);
    }
   
    );
    console.log(this.districtnamelist)
    
  }
  getcitynamelist(){
    if(this.cityform.get('cstate').value.id==undefined || this.cityform.get('cstate').value.id==null || this.cityform.get('cstate').value==''){
      this.notofication.showError('please Select The State');
      return false;
    }
    if(this.cityform.get('cdistrict').value.id==undefined || this.cityform.get('cdistrict').value.id==null || this.cityform.get('cdistrict').value==''){
      this.notofication.showError('please Select The District');
      return false;
    }

    this.masterService.getcitydatafilter(this.cityform.get('cstate').value.id,'',1).subscribe(data=>{
      this.citynamelist=data['data'];
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    )
  }
  addstate(){
    this.cityenb=!this.cityenb;
    this.cityenbbtn=!this.cityenbbtn;
    this.cityenbcan=!this.cityenbcan;
  }
  adddistrict(){
    this.citysenb=! this.citysenb;
    this.citysenbbtn=!this.citysenbbtn;
    this.citysenbcan=!this.citysenbcan;
  }
  addcity(){
    this.cityssenb=!this.cityssenb;
    this.cityssenbbtn=!this.cityssenbbtn;
    this.cityssenbcan=!this.cityssenbcan;
  }
  createstate(){
    console.log(this.stateform.value);
    if(this.stateform.get('country').value.id==undefined || this.stateform.get('newstate').value=="" || this.stateform.get('newstate').value=='' || this.stateform.get('newstate').value==''){
      this.notofication.showError('Please Enter The New Sate');
      return false;
    }
    if(this.stateform.get('newstate').value.toString().trim()==undefined || this.stateform.get('newstate').value=="" || this.stateform.get('newstate').value=='' || this.stateform.get('newstate').value==''){
      this.notofication.showError('Please Enter The New Sate');
      return false;
    }
    if(this.stateform.get('newstategst').value.toString().trim()==undefined || this.stateform.get('newstategst').value=="" || this.stateform.get('newstate').value=='' || this.stateform.get('newstategst').value==''){
      this.notofication.showError('Please Enter The State GST No');
      return false;
    }
    let data:any={'name':this.stateform.get('newstate').value.toString().trim(),"country_id":this.stateform.get('country').value.id,'gst_code':this.stateform.get('newstategst').value};
    console.log(data);    
    this.masterService.createStateForm(data).subscribe(res=>{
      if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
        this.notofication.showError("[INVALID_DATA! ...]")
      }
      else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
        this.notofication.showWarning("Duplicate Data! ...")
      }
      else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notofication.showWarning("Duplicate Data! ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notofication.showError("INVALID_DATA!...")
      }
       else {
         this.notofication.showSuccess("Successfully created!...");
          // this.onSubmit.emit();
          this.cityenb=!this.cityenb;
         this.cityenbbtn=!this.cityenbbtn;
          this.cityenbcan=!this.cityenbcan;
       }
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    );
  }
  createdistrict(){
    console.log(this.districtform.value);
    if(this.districtform.get('statename').value.id==undefined || this.districtform.get('statename').value=='' || this.districtform.get('statename').value==undefined || this.districtform.get('statename').value==null){
      this.notofication.showError('Please Enter The State Name');
      return false;
    }
    if(this.districtform.get('newdistrict').value.toString().trim()=="" || this.districtform.get('newdistrict').value.toString().trim()=='' || this.districtform.get('newdistrict').value==undefined || this.districtform.get('newdistrict').value==null){
      this.notofication.showError('Please Enter The New District Name');
      return false;
    }
    let data:any={'name':this.districtform.get('newdistrict').value.toString().trim(),"state_id":this.districtform.get('statename').value.id};
    console.log(data);
    this.masterService.createDistrictForm(data).subscribe(res=>{
      if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
        this.notofication.showError("[INVALID_DATA! ...]")
      }
      else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notofication.showWarning("Duplicate Data! ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notofication.showError("INVALID_DATA!...")
      }
      else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
        this.notofication.showWarning("Duplicate Data! ...")
      }
       else {
         this.notofication.showSuccess("Successfully created!...")
          // this.onSubmit.emit();
          this.citysenb=! this.citysenb;
    this.citysenbbtn=!this.citysenbbtn;
    this.citysenbcan=!this.citysenbcan;
       }
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    );
  }
  getcitydata(){
    console.log(this.cityform.value);
    if(this.cityform.get('cstate').value.id=="" || this.cityform.get('cstate').value=='' || this.cityform.get('cstate').value==undefined || this.cityform.get('cstate').value==null){
      this.notofication.showError('Please Enter The State Name');
      return false;
    }
    if(this.cityform.get('cdistrict').value.id=="" || this.cityform.get('cdistrict').value=='' || this.cityform.get('cdistrict').value==undefined || this.cityform.get('cdistrict').value==null){
      this.notofication.showError('Please Enter The District Name');
      return false;
    }
    if(this.cityform.get('newcityname').value.toString().trim()=="" || this.cityform.get('newcityname').value.toString().trim()=='' || this.cityform.get('newcityname').value==undefined || this.cityform.get('newcityname').value==null){
      this.notofication.showError('Please Enter The New City Name');
      return false;
    }
    if(this.cityform.get('cpincode').value.toString().length ==6){
      console.log(this.cityform.get('cpincode').value);
    }
    else{
      this.notofication.showWarning('Please Enter The 6 digits only');
      return false;
    }
    if(this.cityform.get('cpincode').value=="" || this.cityform.get('cpincode').value=='' || this.cityform.get('cpincode').value==undefined || this.cityform.get('cpincode').value==null){
      this.notofication.showError('Please Enter The PinCode');
      return false;
    }
    let data:any={'name':this.cityform.get('newcityname').value.toString().trim(),'state_id':this.cityform.get('cstate').value.id,'no':this.cityform.get('cpincode').value,
    'district':this.cityform.get('cdistrict').value.id
  };
    console.log(data)
    this.masterService.createCityForm(data).subscribe(res=>{
      if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
        this.notofication.showError("[INVALID_DATA! ...]")
      }
      else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notofication.showWarning("Duplicate Data! ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notofication.showError("INVALID_DATA!...")
      }
      else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
        this.notofication.showWarning("Duplicate Data! ...")
      }
       else {
         this.notofication.showSuccess("Successfully created!...")
          // this.onSubmit.emit();
          this.cityssenb=!this.cityssenb;
          this.cityssenbbtn=!this.cityssenbbtn;
          this.cityssenbcan=!this.cityssenbcan;
       }
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    )
  }
  autocompleteDeptScrollstate() {
    setTimeout(() => {
      if (
        this.matstate &&
        this.autocompleteTrigger &&
        this.matstate.panel
      ) {
        fromEvent(this.matstate.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matstate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matstate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matstate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matstate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_statenxt === true) {
                this.masterService.getstatedatafilter(this.stateform.get('country').value.id,this.stateInput.nativeElement.value,this.has_statepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.statenamelist = this.statenamelist.concat(datas);
                    if (this.statenamelist.length >= 0) {
                      this.has_statenxt = datapagination.has_next;
                      this.has_statepre = datapagination.has_previous;
                      this.has_statepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteDeptScrollstated() {
    console.log('D');
    console.log(this.dstateInput)
    setTimeout(() => {
      if (
        this.matdstate &&
        this.autocompleteTrigger &&
        this.matdstate.panel
      ) {
        fromEvent(this.matdstate.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdstate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdstate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdstate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdstate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_statenxt === true) {
                this.masterService.getstatedatafilter(this.stateform.get('country').value.id,this.dstateInput.nativeElement.value,this.has_statepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.statelist = this.statelist.concat(datas);
                    if (this.statelist.length >= 0) {
                      this.has_statenxt = datapagination.has_next;
                      this.has_statepre = datapagination.has_previous;
                      this.has_statepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteDeptScrollstatecd() {
    console.log('E');
    console.log(this.dstateInput)
    setTimeout(() => {
      if (
        this.matcdstate &&
        this.autocompleteTrigger &&
        this.matcdstate.panel
      ) {
        fromEvent(this.matcdstate.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcdstate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcdstate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcdstate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcdstate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_statenxt === true) {
                this.masterService.getstatedatafilter(this.stateform.get('country').value.id,this.cdstateInput.nativeElement.value,this.has_statepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cstatelist = this.cstatelist.concat(datas);
                    if (this.cstatelist.length >= 0) {
                      this.has_statenxt = datapagination.has_next;
                      this.has_statepre = datapagination.has_previous;
                      this.has_statepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteDeptScrolldistrictdata(data:any) {
    console.log('data');
    if(data=='yes'){
    setTimeout(() => {
      if (
        this.matdistrict &&
        this.autocompleteTrigger &&
        this.matdistrict.panel
      ) {
        fromEvent(this.matdistrict.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdistrict.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdistrict.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdistrict.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdistrict.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_districtnxt === true) {
                this.masterService.getdistrictdatafilter(this.districtform.get('statename').value.id,this.districtInput.nativeElement.value,this.has_districtpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.districtnamelist = this.districtnamelist.concat(datas);
                    if (this.districtnamelist.length >= 0) {
                      this.has_districtnxt = datapagination.has_next;
                      this.has_districtpre = datapagination.has_previous;
                      this.has_districtpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  else{
    console.log('call');
    setTimeout(() => {
      if (
        this.matdistrict &&
        this.autocompleteTrigger &&
        this.matdistrict.panel
      ) {
        fromEvent(this.matdistrict.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdistrict.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdistrict.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdistrict.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdistrict.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_districtnxt === true) {
                this.masterService.getdistrictdatafilter(this.cityform.get('cstate').value.id,this.districtInput.nativeElement.value,this.has_districtpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.districtnamelist = this.districtnamelist.concat(datas);
                    if (this.districtnamelist.length >= 0) {
                      this.has_districtnxt = datapagination.has_next;
                      this.has_districtpre = datapagination.has_previous;
                      this.has_districtpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
 }
 autocompleteDeptScrollcity() {
  setTimeout(() => {
    if (
      this.matcity &&
      this.autocompleteTrigger &&
      this.matcity.panel
    ) {
      fromEvent(this.matcity.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matcity.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matcity.panel.nativeElement.scrollTop;
          const scrollHeight = this.matcity.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcity.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_citynxt === true) {
              this.masterService.getcitydatafilter(this.cityform.get('cstate').value.id,this.cityInput.nativeElement.value,this.has_cittpage+1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.citynamelist = this.citynamelist.concat(datas);
                  if (this.citynamelist.length >= 0) {
                    this.has_citynxt = datapagination.has_next;
                    this.has_citypre = datapagination.has_previous;
                    this.has_cittpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });

}
  getuserdata(){
    if(this.stateform.get('country').value.id==undefined || this.stateform.get('country').value=='' || this.stateform.get('country').value==null || this.stateform.get('country').value==""){
      this.notofication.showError('Please Select The Country');
      return false;
    }
    this.masterService.getstatedatafilter(this.stateform.get('country').value.id,'',1).subscribe(data=>{
      this.statelist=data['data'];
    },
    (error)=>{
      this.notofication.showError(error.status+error.statusText);
    }
    );
    return true;
  }
keypressnodigitstate(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
    return false;
  }
  let d:any;
  if(this.stateform.get('name').value==undefined || this.stateform.get('name').value=="" || this.stateform.get('name').value==null){
    d='';
  }
  else{
    d=event.target.value;
  }
  this.isLoading=true;
  this.masterService.getstatedatafilter(this.stateform.get('country').value.id,d,1).subscribe(data=>{
    this.statenamelist=data['data'];
    this.isLoading=false;
    console.log(this.statenamelist)
  },
  (error)=>{
    this.notofication.showError(error.status+error.statusText);
  }
  );
  return true;
}
keypressnodigitdistrictstate(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123) && charCode!=32) {
    return false;
  }
  let d:any;
  if(this.districtform.get('statename').value==undefined || this.districtform.get('statename').value=="" || this.districtform.get('statename').value==null){
    d='';
  }
  else{
    d=event.target.value;
  }
  this.isLoading=true;
  this.masterService.getstatedatafilter(this.stateform.get('country').value.id,d,1).subscribe(data=>{
    this.statelist=data['data'];
    this.isLoading=false;
  },
  (error)=>{
    this.isLoading=false;
    this.notofication.showError(error.status+error.statusText);
  }
  );
  return true;
}
keypressnodigit(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123) && charCode!=32) {
    return false;
  }
  return true;
}
keypressnodigitpincode(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
kyenbdatastategst(event:any){
  const charCode = (event.which) ? event.which : event.keyCode;
  console.log((charCode >= 48 && charCode <= 57))
  if((charCode >= 48 && charCode <= 57)){
    return true;
  }
  return false;
  // console.log('code='+charCode)
  // console.log(event.key);
  // let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/)
  // console.log(d.test(event.key));
  // if(d.test(event.key)==true){
  //   return false;
  // }
  // return true;
}

}
