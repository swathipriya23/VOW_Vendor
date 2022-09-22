import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from 'src/app/service/notification.service';
import { TaService } from '../ta.service';

@Component({
  selector: 'app-onbehalf-master',
  templateUrl: './onbehalf-master.component.html',
  styleUrls: ['./onbehalf-master.component.scss']
})
export class OnbehalfMasterComponent implements OnInit {

  datatable: any
  branchlist: any
  onbehalfform: FormGroup
  branchtable: any

  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('modalclose') public modalclose:ElementRef;
  @ViewChild('autocompleteemp') matemp:any;
  @ViewChild('emp') emp:any;


  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true
  branchid: any;
  branchemployee: any;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: number = 1;
  employeedata: any
  empselectedname: any
  statusarray: any = [];
  statusupdatebranchid: any
  color:boolean;
  pagenumb:any=1
  has_presentids:boolean=true;
  has_presenntids:any;1
  maker:any;

  logindata:any;


  constructor(private taservice: TaService, private formbuilder: FormBuilder, private notification: NotificationService) { }

  ngOnInit(): void {

    this.onbehalfform = this.formbuilder.group(
      {
        branch: [''],
        employee: ['']
      }
    )

    this.logindata=JSON.parse(localStorage.getItem("sessionData"))
    this.maker=this.logindata['employee_id']
    console.log(this.maker,'this.maker')

    this.getonbehalfdata(this.has_presentid)

    this.onbehalfform.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        console.log("Branch List", this.branchlist)
      });

      this.onbehalfform.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getemployeevaluechanges(this.statusupdatebranchid,value))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchemployee = datas;
        console.log("Branch List", this.branchlist)
      });


    this.getbranch()

  }
  search() {
    console.log(this.onbehalfform.value)
  }
  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentids = pagination.has_previous;
                  this.has_presenntids = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }

  autocompleteemps() {
    setTimeout(() => {
      if (this.matemp && this.autocompletetrigger && this.matemp.panel) {
        fromEvent(this.matemp.panel.nativeElement, 'scroll').pipe(
          map(x => this.matemp.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matemp.panel.nativeElement.scrollTop;
          const scrollHeight = this.matemp.panel.nativeElement.scrollHeight;
          const elementHeight = this.matemp.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          // console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getonbehalfemployeepage(this.statusupdatebranchid, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                let pagination = data['pagination'];
                this.branchemployee = this.branchemployee.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentids = pagination.has_previous;
                  this.has_presenntids = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }





  getbranch() {
    this.taservice.getbranchname().subscribe(
      x => {
        this.branchlist = x['data']
      }
    )

  }

  branchname(branch) {
    this.statusupdatebranchid = branch.id
    console.log(this.statusupdatebranchid)


    this.taservice.getonbehalfemployeeget(this.statusupdatebranchid)
      .subscribe(result => {

        this.branchemployee = result['data']
        console.log('eee', this.branchemployee.name)
        console.log('emp', result)


      })

  }

  getonbehalfdata(page) {
    this.taservice.getonbehalf(page).subscribe(
      results => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.datatable = datas;
        if (this.datatable.length > 0) {
          this.has_nextid = datapagination.has_next;
          this.has_previousid = datapagination.has_previous;
          this.has_presentid = datapagination.index;
        }
      }
    )


  }

  previousClick() {
    if (this.has_previousid === true) {

      this.getonbehalfdata(this.has_presentid - 1)
    }
  }

  nextClick() {
    if (this.has_nextid === true) {
      this.getonbehalfdata(this.has_presentid + 1)
    }
  }

  firstClick() {
    if (this.has_previousid === true) {
      this.getonbehalfdata(1)
    }
  }

  // selectBranch(e){
  //   console.log("e",e.value)
  //   let branchvalue = e
  //   this.branchid = branchvalue
  //   var value = ''
  //   this.taservice.setemployeeValue(value,branchvalue)
  //   .subscribe(results => {
  //     this.employeelist = results
  //     console.log("employee", this.employeelist)
  //   })
  // }

  employeenameselect(value) {
    this.empselectedname = value.id
    let name = value.id
    // this.getemployeedetails(name, this.has_presentemp)

    this.getemployeeonbehalf(this.statusupdatebranchid,name,this.pagenumb,this.empselectedname)

  }


  getemployeeonbehalf(branch,empid,pagenumb,maker){
    this.taservice.getemployeeonbehalf(branch,empid,pagenumb,maker).subscribe(
      results=>{
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.employeedata = datas;
        console.log('empdataaa',this.employeedata)
        if (this.employeedata.length > 0) {
          this.has_nextemp = datapagination.has_next;
          this.has_previousemp = datapagination.has_previous;
          this.has_presentemp = datapagination.index;
      }
    
  })
}


  // getemployeedetails(val, page) {
  //   this.taservice.getemployeedetail(val, page).subscribe(
  //     results => {
  //       let datas = results["data"];
  //       let datapagination = results["pagination"];
  //       this.employeedata = datas;
  //       if (this.employeedata.length > 0) {
  //         this.has_nextemp = datapagination.has_next;
  //         this.has_previousemp = datapagination.has_previous;
  //         this.has_presentemp = datapagination.index;
  //       }
  //     }

  //   )
  // }
  empnextclick() {

    if (this.has_nextemp == true) {
      this.getemployeeonbehalf(this.statusupdatebranchid,this.empselectedname, this.has_presentemp + 1,this.empselectedname)
    }
  }
  emppreviousclick() {

    if (this.has_previousemp == true) {
      this.getemployeeonbehalf(this.statusupdatebranchid,this.empselectedname, this.has_presentemp - 1,this.empselectedname)
    }
  }
  empfirstclick() {
    this.has_presentemp=1
    if (this.has_nextemp == true) {
      this.getemployeeonbehalf(this.statusupdatebranchid,this.empselectedname, this.has_presentemp,this.empselectedname)
    }
  }
  getbool(v, e) {

    let obj = {
      "employeegid": v.employee.id,
      "branchgid": this.statusupdatebranchid,
      "onbehalf_employeegid": this.empselectedname,
    }
    console.log(v.employee.id)
    console.log(v, e.target.checked)
    if(e.target.checked) 
    {
      this.statusarray.push(obj)
    }
    if(!e.target.checked){
      for(let i=0;i<this.statusarray.length;i++){
        if(this.statusarray[i].onbehalf_employeegid==v.employee.id){
          this.statusarray.splice(i,1)
        }
      }
    }
    console.log('statusarrays',this.statusarray)
  }


  updatestatus(status) {
    this.taservice.getonbehalfstatusupdate(status).subscribe(
      x => {
        if (x.status === "success") {
          this.notification.showSuccess("success")
        }
        else {
          this.notification.showError(x.message)
        }
      }
    )
  }

  submit() {
    if(this.statusarray.length==0){
      this.notification.showError('Please select Employee')
    }
    else{
      this.updatestatus(JSON.stringify(this.statusarray))
      console.log( JSON.stringify( this.statusarray))
    }
    this.modalclose.nativeElement.click();
    this.onbehalfform.reset()
    this.employeedata.splice(0,this.employeedata.length)
    this.statusarray.splice(0,this.statusarray.length)

  }

  gettablestatusupdate(data){
    this.taservice.getonbehalftablestatusupdate(data).subscribe(
      x=>{
        if(x.status === "success" ){
          this.notification.showSuccess("success")
        }
        else{
          this.notification.showError(x.message)
        }
      }
    )
  }

  activate(value){
    

    for(let i=0;i<this.datatable.length;i++){
      if(value.id==this.datatable[i].id){
        if( this.datatable[i].status==1){
        this.datatable[i].status=0;
        let passvalue={
          "id":value.id,
          "status":0
        }
        this.gettablestatusupdate(JSON.stringify(passvalue))
        console.log(JSON.stringify(passvalue))

        }
        else{
          let passvalue={
            "id":value.id,
            "status":1
          }
          this.datatable[i].status=1;
          this.gettablestatusupdate(JSON.stringify(passvalue))
          console.log(JSON.stringify(passvalue))
        }
      }
    }
    
  }

  resetall(){
    this.onbehalfform.reset()
    this.employeedata.splice(0,this.employeedata.length)
    this.modalclose.nativeElement.click();
    this.statusarray.splice(0,this.statusarray.length)
  }
  


}
