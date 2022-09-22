import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { masterService } from '../master.service'
import { ShareService } from '../share.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import {  MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

export interface Emplistss {
  id: string;
  full_name: string;
}
export interface comlistss {
  id: string;
  name: string;
}

// const uuidv4 = require("uuid/v4")


@Component({
  selector: 'app-delmat-maker',
  templateUrl: './delmat-maker.component.html',
  styleUrls: ['./delmat-maker.component.scss']
})
export class DelmatMakerComponent implements OnInit {
  delmatmakerForm: FormGroup;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isvisible:boolean=false;
  ismultilevel:boolean=false;
  ismultilevelflage:boolean=false;
  employeeList     : Array<Emplistss>;
  employeeList_new     : Array<Emplistss>=[];
  employee_id      = new FormControl();
  yesorno = [{ 'value': 1, 'display': 'Yes' }, { 'value': 0, 'display': 'No' }]
  commodityList    : Array<comlistss>;
  commodity_id     = new FormControl();
  gstyesno:any;
  finallevel:any;
  issubmit:boolean=false;
  delmattypeList       : Array<any>;
  delmatList: Array<any>=[];
  presentpagedel: number = 1;
  has_nextdel = true;
  has_previousdel = true;
  comdat:any;
  maxfindsub:boolean
  pageSize = 10;
  comid:any;
  delmatfor:FormGroup;
  empname:any;
  comname:any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild('com') matcomAutocomplete: MatAutocomplete;
  @ViewChild('comInput') comInput: any;


  limit:any;
  constructor(private fb: FormBuilder, private prposhareService: ShareService,
    private dataService: masterService, private toastr:ToastrService,private router: Router, private SpinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {
    this.delmatmakerForm = this.fb.group({
      employee_id     :['',   this.SelectionValidator],
      commodity_id    :['',   this.SelectionValidator],
      type            :[null,  Validators.required],
      limit           :[null,  Validators.required],
      enb:['',Validators.required],
      empname:['',Validators.required],
      final_approver:[''],
      level_of_approver:['']
    });
    // console.log("hai",uuidv4())
    this.delmatfor = this.fb.group({
      id:[''],
      type:[''],
      employee_id:[''],
      commodity_id:[''],
      level_of_approver: [''],
      final_approver: [''],
      limit:[]
    })

    let empkeyvalue: String = "";
    this.getemployeeFK(empkeyvalue);
    this.delmatmakerForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getemployeeFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      },(error) => {
        this.SpinnerService.hide();
      });
      let empkeyvalues: String = "";
      this.getemployeeFK_new(empkeyvalues);
      this.delmatmakerForm.get('empname').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.dataService.getemployeeFKdd(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.employeeList_new = datas;
  
        },(error) => {
          this.SpinnerService.hide();
        });


      let comkeyvalue: String = "";
    this.getcommodityFK(comkeyvalue);
    this.delmatmakerForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getcommodityFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;

      },(error) => {
        this.SpinnerService.hide();
      })

      this.getdelmattype();

  }
  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getemployeeFKdd(this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  enb(){
    if(this.delmatmakerForm.get('enb').value==false){
      this.isvisible=true;
    }
    else{
      this.isvisible=false;
    }
    
  }
  public displayFnemp(emp?: Emplistss): string | undefined {
    console.log('id', emp.id);
    console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }

  get emp() {
    return this.delmatmakerForm.get('employee_id');
  }
  getemployeeFK(empkeyvalue){
    this.SpinnerService.show();
    this.dataService.getemployeeFK(empkeyvalue)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.employeeList = datas;
          console.log("employeeList", datas)
        },(error) => {
          this.SpinnerService.hide();
        })
  }
  getemployeeFK_new(empkeyvalue){
    this.SpinnerService.show();
    this.dataService.getemployeeFK(empkeyvalue)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.employeeList_new = datas;
          console.log("employeeList", datas)
        },(error) => {
          this.SpinnerService.hide();
        })
  }

  autocompletecomScroll() {
    setTimeout(() => {
      if (
        this.matcomAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomAutocomplete.panel
      ) {
        fromEvent(this.matcomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getcommodityFKdd(this.comInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityList = this.commodityList.concat(datas);
                    // console.log("emp", datas)
                    if (this.commodityList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFncom(com?: comlistss): string | undefined {
    console.log('id', com.id);
    console.log('name', com.name);
    this.comid=com.id
    return com ? com.name : undefined;  
  }
  findmulti(com)
  {
    this.dataService.getCommodity(com.id).subscribe((results) => {
      console.log(results)
      let commodi=results
      this.ismultilevelflage=commodi.is_multilevel
      this.finallevel=commodi.Approval_level
    
    })
  }

  get com() {
    return this.delmatmakerForm.get('commodity_id');
  }
  getcommodityFK(comkeyvalue){
    this.SpinnerService.show();
    this.dataService.getcommodityFK(comkeyvalue)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.SpinnerService.hide();
          this.commodityList = datas;
          console.log("commodityList", datas)
        },(error) => {
          this.SpinnerService.hide();
        })
  }
  getdelmattype(){
    this.SpinnerService.show();
    this.dataService.getdelmattype()
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.delmattypeList = datas;
          console.log("delmattypeList", datas)
        },(error) => {
          this.SpinnerService.hide();
        })
  }
  private SelectionValidator(fcvalue: FormControl) {
    if (typeof fcvalue.value === 'string') {
      return { incorrectValue: `Selected value only Allowed` }
    }
    return null;
  }
                          
  delmatmakerSubmit(){
    console.log("this.",this.delmatmakerForm.value)
    if (this.delmatmakerForm.value.employee_id===""){
      this.toastr.error('Please Select The Employee Name','' ,{timeOut: 1500});
      return false;
    }if (this.delmatmakerForm.value.commodity_id===""){
      this.toastr.error('Please Select The Commodity Name','' ,{timeOut: 1500});
      return false;
    }
    // if (this.delmatmakerForm.value.commodity_id==='string'){
    //   this.toastr.error('Add Proper Commodity Field','Please Select the Commodity' ,{timeOut: 1500});
    //   return false;
    // }
    if (this.delmatmakerForm.value.type===null){
      this.toastr.error('Please Select Delmat Type','' ,{timeOut: 1500});
      return false;
    }
    if (this.delmatmakerForm.value.limit===null || this.delmatmakerForm.value.limit===undefined){
      this.toastr.error('Please Enter The Limit','' ,{timeOut: 1500});
      return false;
    }
    if(this.ismultilevelflage==true)
    {
      if (this.delmatmakerForm.value.final_approver===null || this.delmatmakerForm.value.final_approver===undefined || this.delmatmakerForm.value.final_approver===''){
        this.toastr.error('Please Enter Value for final_approver','' ,{timeOut: 1500});
        return false;
      }
      if (this.delmatmakerForm.value.level_of_approver===null || this.delmatmakerForm.value.level_of_approver===undefined || this.delmatmakerForm.value.level_of_approver===''){
        this.toastr.error('Please Enter The level for approver','' ,{timeOut: 1500});
        return false;
      }
      if (this.delmatmakerForm.value.level_of_approver ==  this.finallevel){
        if(this.delmatmakerForm.value.final_approver != 1)
        {
          this.toastr.error('Please Select Final Approver As True','' ,{timeOut: 1500});
          return false;
        }
      }
      if(this.finallevel > this.delmatmakerForm.value.level_of_approver)
      {
        if(this.delmatmakerForm.value.final_approver == 1)
        {
          this.toastr.error('Please Select Final Approver As No','' ,{timeOut: 1500});
          return false;
        }
      }
      if(this.finallevel < this.delmatmakerForm.value.level_of_approver)
      {
        this.toastr.error('Approver Level Exceed','' ,{timeOut: 1500});
        return false;
      }
    }
    
      
  this.delmatmakerForm.value.employee_id=this.delmatmakerForm.value.employee_id.id;
  this.delmatmakerForm.value.commodity_id=this.delmatmakerForm.value.commodity_id.id;
  // if(this.ismultilevelflage){
  //   this.delmatmakerForm.value['two_level_approval']=1
  //   this.delmatmakerForm.value['two_level_employee_id']=this.delmatmakerForm.value.empname.id;
  // }
  // else{
  //   this.delmatmakerForm.value['two_level_approval']=0;
  //   this.delmatmakerForm.value['two_level_employee_id']=0;
  // }
  this.SpinnerService.show();

  this.dataService.delmatmakercreate(this.delmatmakerForm.value)
  .subscribe(res => {
    this.issubmit=true;
    this.SpinnerService.hide();
    if (res?.code === "INVALID_DATA" ||res?.code ==="INVALID_HIERARCHY_ID") {
      this.SpinnerService.hide();
      this.toastr.error(res?.description)
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.SpinnerService.hide();
      this.toastr.error("Duplicate Data! ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.SpinnerService.hide();
      this.toastr.error("INVALID_DATA!...")
    }
     else {
      //  this.delmatmakerForm.reset();
       this.delmatmakerForm.reset({
      commodity_id:
      this.delmatmakerForm.get('commodity_id').value })
      //  this.comInput.nativeElement.value=''
       this.empInput.nativeElement.value=''
      //  this.delmatmakerForm.value.type=''
      //  this.delmatmakerForm.value.final_approver=''
      //  this.delmatmakerForm.value.level_of_approver=''
      //  this.delmatmakerForm.value.limit=''
      this.SpinnerService.hide();
       this.toastr.success("Successfully Created ")
       if(this.maxfindsub==true)
       {
          this.onSubmit.emit();
       }  
       this.getdelmat(1)
     }
       console.log("this.delmatmakerForm.value Form SUBMIT", res)
       return true
     },(error) => {
      this.SpinnerService.hide();
    }) 
  }

  omit_special_char(event)
{   
  var k;  
  k = event.charCode;  
  return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}
omit_special_num(event)
{   
  var k;  
  k = event.charCode;  
  return((k == 188) ||(k == 46) || (k >= 48 && k <= 57)); 
}
 onCancelClick() {

  this.onCancel.emit()
 }
 kyenbdata(event:any){
  let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
  console.log(d.test(event.key))
  if(d.test(event.key)==true){
    return false;
  }
  return true;
}
GSTstatus(data) {
  this.gstyesno = data.value
}

getdelmat(presentpagedel) {
  this.maxfindsub=false
  if(this.delmatmakerForm.value.type ===null || this.delmatmakerForm.value.type ===undefined || this.delmatmakerForm.value.type==='')
  {
    this.comdat={
      "commodity_id":this.delmatmakerForm.value.commodity_id.id
    }
  }
  else if(this.delmatmakerForm.value.commodity_id.id===null || this.delmatmakerForm.value.commodity_id.id===undefined || this.delmatmakerForm.value.commodity_id.id==='')
  {
    this.comdat={
      "type": this.delmatmakerForm.value.type
    }
  }
  else if((this.delmatmakerForm.value.type ===null || this.delmatmakerForm.value.type ===undefined || this.delmatmakerForm.value.type==='') &&(this.delmatmakerForm.value.commodity_id.id===null || this.delmatmakerForm.value.commodity_id.id===undefined || this.delmatmakerForm.value.commodity_id.id===''))
  {
    this.comdat={ }
  }
  else
  {
    this.comdat={
      "commodity_id":this.delmatmakerForm.value.commodity_id.id,
      "type": this.delmatmakerForm.value.type
    }
  }
  
  this.SpinnerService.show()
  this.dataService.getdelmatSearch_neww(this.comdat,2,presentpagedel)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.SpinnerService.hide();
      let datapagination = results["pagination"];
      this.delmatList = datas;
      if (this.delmatList.length > 0) {
        this.has_nextdel = datapagination.has_next;
        this.has_previousdel = datapagination.has_previous;
        this.presentpagedel = datapagination.index;
      }
      for(let i=0;i< this.delmatList.length;i++)
      {
        if(this.delmatList[i].level_of_approver==this.finallevel)
        {
          this.maxfindsub=true
          break;
        }
      }
      console.log("this.maxfindsub",this.maxfindsub)
    }
    );
}
nextClickdel() {
  if (this.has_nextdel === true) {
    this.presentpagedel += 1;
    this.getdelmat(this.presentpagedel)
  }
}

previousClickdel() {
  if (this.has_previousdel === true) {
    this.presentpagedel -=1;
    this.getdelmat(this.presentpagedel)
  }
}
forInactivedel(data) {
  let datas = data.id
  let status: number = 0
  // this.SpinnerService.show()
  this.dataService.activeInactivedel(datas, status)
    .subscribe((results: any[]) => {
      // this.SpinnerService.hide()
      this.toastr.success('Successfully InActivated!')
      this.getdelmat(this.presentpagedel);
      return true
    },(error) => {
      // this.errorHandler.handleError(error);
      // this.SpinnerService.hide();
    })
}
foractivedel(data) {
  let datas = data.id
  let status: number = 1
  // this.SpinnerService.show()
  this.dataService.activeInactivedel(datas, status)
    .subscribe((results: any[]) => {
      // this.SpinnerService.hide()
      this.toastr.success('Successfully Activated!')
      this.getdelmat(this.presentpagedel);
      return true
    },(error) => {
      // this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}
delmatsingle(com)
  {
    this.SpinnerService.show()
    this.delmatfor.value.id = com.id
    this.empname=com.employee_id.name;
    this.comname=com.commodity_id.name
    console.log("this.commodityfor.value.id",this.delmatfor.value.id)
    console.log("comm",com)
    this.delmatfor.patchValue(
      {
        employee_id:com?.employee_id?.id,
        commodity_id:com?.commodity_id.id,
        id:com?.id,
        level_of_approver: com?.level_of_approver,
        final_approver: com?.final_approver,
        type:com?.type_id,
        limit:com?.limit
      }
    )
    this.SpinnerService.hide()
  }
editdel()
  {
    if(this.ismultilevelflage==true)
    {
      if (this.delmatfor.value.level_of_approver ==  this.finallevel){
        if(this.delmatfor.value.final_approver != 1 || this.delmatfor.value.final_approver != true)
        {
          this.toastr.error('Please Select Final Approver As True','' ,{timeOut: 1500});
          return false;
        }
      }
      if(this.finallevel > this.delmatfor.value.level_of_approver)
      {
        if(this.delmatfor.value.final_approver == 1 || this.delmatfor.value.final_approver == true)
        {
          this.toastr.error('Please Select Final Approver As No','' ,{timeOut: 1500});
          return false;
        }
      }
      if(this.finallevel < this.delmatfor.value.level_of_approver)
      {
        this.toastr.error('Approver Level Exceed','' ,{timeOut: 1500});
        return false;
      }
    }
    console.log("com",this.delmatfor.value)
    this.dataService.delmatmakercreate(this.delmatfor.value)
    .subscribe((results) => {
      if(results?.code =="INVALID_DATA" || results?.code =="INVALID_DELMAT_ID" || results?.code =="UNEXPECTED_ERROR" || results?.code=="INVALID_HIERARCHY_ID" )
      {
        this.toastr.error(results?.description)
      }
      else
      {
        this.toastr.success("Updated Successfully!...")
      }
      this.getdelmat(this.presentpagedel);
    })
    
  }
}
