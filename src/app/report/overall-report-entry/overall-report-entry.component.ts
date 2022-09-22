import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-overall-report-entry',
  templateUrl: './overall-report-entry.component.html',
  styleUrls: ['./overall-report-entry.component.scss']
})
export class OverallReportEntryComponent implements OnInit {
  reportForm:any = FormGroup
  operatorData:any = [];
  presentpage: number=1;
  reportList:any = [];
  has_next: boolean=false;
  has_previous: boolean=false;
  pageSize = 10;
  isLoading = false;
  moduleList: any = [];
  moduleNameList: any = [];
  module_id: any;
  module_name__id: any;
  module_name: any;
  constructor(private service: ReportService, private formBuilder:FormBuilder,
    private toastr:ToastrService, private spinner: NgxSpinnerService, 
    public dialog: MatDialog, private router:Router) { }

  ngOnInit(): void {
    this.reportForm = this.formBuilder.group({
      module: [''],
      report: [''],
      template: [''],
      displaycolumn: [''],
      parameter: [''],
    })

    this.service.getModuleList()
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('INVALID DATA')
        }
        else{
        let datas = results["data"];
        this.moduleList = datas
        }
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      })
  }

  moduleType(data){
    this.module_id = data.id
    this.module_name = data.code
    this.service.getModuleNameList(data.id)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
        }
        else{
          let datas = results["data"];
          this.moduleNameList = datas
          for(let i=0; i<this.moduleNameList.length; i++){
            this.moduleNameList[i]['condition_display'] = false;
            this.moduleNameList[i]['condition_parameter'] = false;
            // this.moduleNameList[i]['value2'] = false;
            // this.moduleNameList[i]['value2date'] = false;
          }
        }        
      })
  }

  moduleNameType(data){
    this.module_name__id = data.id
    this.module_id = data.id;
    this.module_name = data.code;
    this.service.getDisplayName(data.code)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
        }
        else{
          let datas = results["DATA"];
          this.reportList = datas
          console.log(this.reportList)
        }
      })  
  }
  schedule_trigger(){
    this.spinner.show();
    this.service.schedule_trigger().subscribe((results:any)=>{
      this.spinner.hide();
      if(results.code !=undefined && results.code !=""){
        this.toastr.warning(results['code']);
        this.toastr.warning(results['description']);
      }
      else{
        this.toastr.warning(results['status']);
        this.toastr.warning(results['message']);    
      }  
  },(error)=>{
    this.spinner.hide();
  })
}
 

  displaycolumn(entry,event,i){
    if(event.target.checked==true){
      this.reportList[i]['condition_display'] = true;
    }
    else if(event.target.checked==false){
      this.reportList[i]['condition_display'] = false;
    }
  }

  parameter(entry,event,i){
    if(event.target.checked==true){
      this.reportList[i]['condition_parameter'] = true;
    }
    else if(event.target.checked==false){
      this.reportList[i]['condition_parameter'] = false;
    }
  }

  report(){

  }

  reportCreate(){
    this.spinner.show();
    if(this.reportForm.get('template').value==null || this.reportForm.get('template').value=="" || '' ){
      this.toastr.warning('Enter Template Name');
      this.spinner.hide();
      return false;
     }
    let report = []
    let column = []
    let flag: Array<any>=[];
    let flag2: Array<any>=[];
    let a:any;
    let b:any;
    
    for(let i=0;i<this.reportList.length;i++){
      if(this.reportList[i].condition_display==true){
        let v:any={'columnname':this.reportList[i].name};
        console.log(v)
        flag.push(v)
        a=flag
      }

      if(this.reportList[i].condition_parameter==true){
        let d:any={'columnname':this.reportList[i].name};
        console.log(d)
        flag2.push(d)
        b=flag2
      }
    }
    
    if (a !=undefined){
      report.push(a)
    }
    if (b !=undefined){
      column.push(b)
    }

    let data_int = {
        "data": {"REPORT_FILTER": report},
        "data_filter_report": {"column_list": column},
        "module_id":this.module_id,
        "report_id":this.module_name__id,
        "rep_temp_name":this.reportForm.get('template').value}
      
    // console.log(data_int)
    this.service.parameterSave(data_int)
    .subscribe((results: any) => {
      console.log("saveEntry", results);
      if(results.status == 'success'){
        this.toastr.success('SUCCESS')
        this.spinner.hide();
      }
      if(results.code == 'INVALID_DATA'){
        this.toastr.error('Duplicate entry')
        this.spinner.hide()
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    }
)}
}
