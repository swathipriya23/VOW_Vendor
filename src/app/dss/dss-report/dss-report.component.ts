import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorhandlingService } from '../errorhandling.service';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { error } from 'console';
import { PprService } from 'src/app/ppr/ppr.service';
import { DssService } from '../dss.service';

// import { S } from '@angular/cdk/keycodes';
const { read, write, utils } = XLSX;
// const {  color } = stle;

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MMM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-dss-report',
  templateUrl: './dss-report.component.html',
  styleUrls: ['./dss-report.component.scss'],
  providers: [
    {
   provide: DateAdapter,
   useClass: MomentDateAdapter,
   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
 },

 {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
 DatePipe
],
})
export class DssReportComponent implements OnInit {
  dssreport_date=new FormControl('')
  dssreport=new FormControl('')
  dssreportfrom_date=new FormControl('')
  dssreportto_date=new FormControl('')
  dss_report_data: any;
  dss_date: any;
  end_date: any;
  index_expense: any;
  header_name: any[];
  exlcount: number=1;
  file_details: any;
  dss_report_param: { date: any; type: any; };
  filedata: any;
  dssuploaddetails: boolean=false;
  exldown: number=1;
  growth_uses: number;
  month_balance: number;
  uses_mtd: number;
  dss_average: any;
  average: any=false;
  report: any=true;
  average_view: boolean=false;
  fromdate: string;
  todate: string;
  average_download: number=1;
  constructor(private errorHandler: ErrorhandlingService,public datepipe: DatePipe,  private dataService: DssService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
  dss_report_view=false
  dss_report:boolean=false
  dss_averageshow=false
  upload_dss=true
  dssaverage:FormGroup
  current_date=new Date();
  ngOnInit(): void {
    this.dssaverage=this.formBuilder.group({
      averagefrom_date:[''],
      averageto_date:['']
    })
  }
  dss_summary_clear(){
    this.dssreport_date.reset('')
    this.dssaverage.controls['averagefrom_date'].reset('')
    this.dssaverage.controls['averageto_date'].reset('')

  }
  changeview:boolean
  dss_report_change(view){
    this.changeview=view
    if(view==true){
      this.SpinnerService.show()
      this.dataService.dss_report(this.dss_report_param).subscribe((data:any)=>{
        this.SpinnerService.hide()
        this.dss_report_view=true
        this.dssuploaddetails=false
        this.dss_report=true
        this.average_view=false
        this.upload_dss=true
      console.log("data=>",data['data'])
      let dssdata=data['data']
      this.dss_report_data=dssdata
      for (let level of this.dss_report_data) {
        level['Padding_left'] = "10px"
        level['tree_flag']='Y'
        // level['color']="blue"
        level['color']="#000"

      
      }
      console.log(this.dss_report_data)
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
    }
    if(view==false){
      let overall={
        date:this.dss_report_param.date
      }
      this.SpinnerService.show()
      this.dataService.dss_overall(overall).subscribe((results)=>{
        this.SpinnerService.hide()
        let dss_overall=results['data']
        let head_groups=[]
        dss_overall.findIndex((e, i) => {
          // console.log(e.name)
          if (e.name == 'Sources') {
            e['Padding_left'] = '10px';
            e['Padding'] = '5px';
            const { head_group, ...sourse } = this.dss_report_data[i];
            head_groups.push(sourse);
            e.head_group.findIndex((head, ind) => {
              e.head_group[ind]['Padding_left'] = '50px';
              e.head_group[ind]['Padding'] = '5px';
              const { sub_group, ...head_grp } = e.head_group[ind];
              head_groups.push(head_grp);
              head.sub_group.findIndex((sub, sub_ind) => {
                head.sub_group[sub_ind]['Padding_left'] = '100px';
                head.sub_group[sub_ind]['Padding'] = '5px';
                const { gl_subgroup, ...sub_grp } = head.sub_group[sub_ind];
                head_groups.push(sub_grp);
                sub?.gl_subgroup?.findIndex((gl, gl_ind) => {
                  sub.gl_subgroup[gl_ind]['Padding_left'] = '120px';
                  sub.gl_subgroup[gl_ind]['Padding'] = '5px';
                
                    let glcode=gl['name'].slice(0,6)
                    console.log("glcode=>",glcode)
                    if(glcode==112101){
                      gl['Padding_left'] = "120px"
                      gl['color']="#000"
                      gl['gl']='true'
                      // prl_ind=gl_ind
                      
                      
                    }else{
                      gl['Padding_left'] = "120px"
                      gl['color']="#000"
                      gl['gl']='false'
                     
                    }
                  head_groups.push(sub.gl_subgroup[gl_ind]);
                });
              });
            });
          }
          if (e.name == 'Uses') {
            const { head_group, ...uses } = this.dss_report_data[i];
            head_groups.push(uses);
            e.head_group.findIndex((head, ind) => {
              e.head_group[ind]['Padding_left'] = '50px';
              e.head_group[ind]['Padding'] = '5px';
              const { sub_group, ...head_grp } = e.head_group[ind];
              head_groups.push(head_grp);
              head.sub_group.findIndex((sub, sub_ind) => {
                head.sub_group[sub_ind]['Padding_left'] = '100px';
                head.sub_group[sub_ind]['Padding'] = '5px';
                const { gl_subgroup, ...sub_grp } = head.sub_group[sub_ind];
                head_groups.push(sub_grp);
                sub?.gl_subgroup?.findIndex((gl, gl_ind) => {
                  sub.gl_subgroup[gl_ind]['Padding_left'] = '120px';
                  sub.gl_subgroup[gl_ind]['Padding'] = '5px';
                  sub.gl_subgroup[gl_ind]['gl']='false'
                  head_groups.push(sub.gl_subgroup[gl_ind]);
                });
              });
            });
            // head_groups[0]['Uses']=uses
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        });
        let prl:any
        console.log(head_groups);
        for(let ind in head_groups){
          if(head_groups[ind]?.gl=='true'){
            this.SpinnerService.show()
            this.dataService.dss_report_profitorloss(overall).subscribe((results:any)=>{
              this.SpinnerService.hide()
              
          
            console.log("data=>",results['data'])
            let dssdata=results['data']
            
            this.growth_uses=((dssdata[0]?.value[0]?.closing_balance - dssdata[0]?.value[1]?.closing_balance) / dssdata[0]?.value[1]?.closing_balance) * 100
            this.uses_mtd= ((dssdata[0]?.value[0]?.closing_balance - dssdata[0]?.value[0]?.opening_balance) /dssdata[0]?.value[0]?.opening_balance) * 100
            for (var val of dssdata) {     
                val['Padding_left'] = "130px"
                val['tree_flag']='Y'
                val['color']="#66bb6a"                       
            }
            prl=val
            console.log(prl)
            let indexval=Number(ind)
            console.log(prl,indexval)
            head_groups.splice(indexval+1, 0, prl);
            }, error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            });
          
            break;
          }
        }
        this.dss_report_data = head_groups;
      })
    }
  }
  dss_summary_search(date,source){
  if(this.report==true){
     if(date==''){
      this.toastr.warning("","Please Select The Date", { timeOut: 1500 });
      return false;
    }
    
    console.log(date)
    let year =date._i.year
    let month = date._i.month
    let day = date._i.date
    const today = new Date()
    const yesterday = new Date(date)
    yesterday.setDate(yesterday.getDate() - 1)
    this.end_date =this.datepipe.transform(yesterday, 'yyyy-MM-dd');
    
    

    console.log("date=>",yesterday,this.end_date,day,month,year)
    this.dss_date = moment({year: year , month: month, day: day}).format('YYYY-MM-DD');
        // this.end_date = moment({year: year , month: month, day: yesterday}).format('YYYY-MM-DD');
        this.header_name=[this.dss_date,this.end_date]

    console.log("date",this.header_name,this.dss_date,this.end_date,source)
    this.dss_report_param={
      "date":this.dss_date,
      "type":source
    }
    this.changeview=true
    this.dss_report_change(this.changeview)
   
      //  let dssdata=this.dss_report['data'][0]
      // this.dss_report_data=dssdata
     
  }
  if(this.average==true){
    let average=this.dssaverage.value
    if(average.averagefrom_date=='' || average.averagefrom_date==undefined || average.averagefrom_date==null){
      this.toastr.warning("","Please Select The From Date", { timeOut: 1500 });
      return false;
    } if(average.averageto_date=='' || average.averageto_date==undefined || average.averageto_date==null){
      this.toastr.warning("","Please Select The To Date", { timeOut: 1500 });
      return false;
    }
    let from_date=average.averagefrom_date
    let year =from_date._i.year
    let month = from_date._i.month
    let day = from_date._i.date
    this.fromdate = moment({year: year , month: month, day: day}).format('YYYY-MM-DD');
    let to_date=average.averageto_date
    let to_date_year =to_date._i.year
    let to_date_month = to_date._i.month
    let to_date_day = to_date._i.date
    this.todate = moment({year: to_date_year , month: to_date_month, day: to_date_day}).format('YYYY-MM-DD');
    let dss_average_param={
      "from_date":this.fromdate,
      "to_date":this.todate,
      'type':1
    }
    console.log("datehidden=>",this.datehidden)
    this.SpinnerService.show()
    this.dataService.dss_average(dss_average_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
         if(results['data'].length==0){
        this.toastr.warning('','No Data Found',{timeOut:1500})
        
        
        return false;
      }else{
        let data=results['data']
        for(let val of data){
          val['Padding_left']='10px',
          val['tree']='s'
        }
        this.dss_average=data
        this.upload_dss=false
        this.dss_report_view=false
        this.dssuploaddetails=false
        this.dss_report=true
        this.average_view=true
      }
      
      
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

  }
  }

  treelevel_click(index,dssreport,dss_report_data){
    let a=[]
    let a2 = index + 1
    console.log("tree")
    if (dssreport.tree_flag == 'N') {
      if (dssreport.Padding_left == '10px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '50px')|| (a1.Padding_left == '100px')|| (a1.Padding_left == '120px')|| (a1.Padding_left == '130px')){
            a.push(i)
          }
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (dssreport.Padding_left == '50px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '100px')|| (a1.Padding_left == '120px')|| (a1.Padding_left == '130px')){
         
          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (dssreport.Padding_left == '100px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '120px')|| (a1.Padding_left == '130px')){

          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px')) { break; }

        }
      }
      if (dssreport.Padding_left == '120px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '130px')){

          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px') || (a1.Padding_left=='120px')) { break; }

        }
      }
      // a.pop()
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = dss_report_data.filter((value, i) =>  !a.includes(i));
      arrayWithValuesRemoved[index].tree_flag = 'Y'
      this.dss_report_data = arrayWithValuesRemoved;

     
    }else{
      if (dssreport.Padding_left == '10px') {
      let dss_report_param={
        "date":this.dss_date,
        "type":2,
        "id":dssreport.id
      }
      console.log(dssreport)
      this.dss_expand_data(index,dssreport,dss_report_data,dss_report_param)
    }
    if (dssreport.Padding_left == '50px') {
      let dss_report_param={
        "date":this.dss_date,
        "type":3,
        "id":dssreport.id
      }
      console.log(dssreport)
      this.dss_expand_data(index,dssreport,dss_report_data,dss_report_param)
    }
    if (dssreport.Padding_left == '100px') {
      let dss_report_param={
        "date":this.dss_date,
        "type":4,
        "id":dssreport.id
      }
      console.log(dssreport)
      this.dss_expand_data(index,dssreport,dss_report_data,dss_report_param)
    }
    if (dssreport.Padding_left == '120px' && dssreport.gl=='true') {
      let dss_report_param={
        "date":this.dss_date,
      }
      console.log(dssreport)
      let different=0
      this.calretain(different,index,dss_report_data,dss_report_param)
    }
    
  }
  
  }
  calretain(diff,ind,data,dss_report_param){
    this.index_expense = ind + 1
    this.SpinnerService.show()
    this.dataService.dss_report_profitorloss(dss_report_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      
   
    console.log("data=>",results['data'])
    let dssdata=results['data']
    this.dss_report_data=dssdata
    this.growth_uses=((this.dss_report_data[0]?.value[0]?.closing_balance - this.dss_report_data[0]?.value[1]?.closing_balance) / this.dss_report_data[0]?.value[1]?.closing_balance) * 100
    this.uses_mtd= ((this.dss_report_data[0]?.value[0]?.closing_balance - this.dss_report_data[0]?.value[0]?.opening_balance) /this.dss_report_data[0]?.value[0]?.opening_balance) * 100
    for (var val of dssdata) {     
        val['Padding_left'] = "130px"
        val['tree_flag']='Y'
        val['color']="#66bb6a"
        // val['color']="#000"
        data[ind]['tree_flag']='N'
      
    }
      data.splice(this.index_expense, 0, val);
      this.index_expense = this.index_expense + 1
    
      this.dss_report_data=data
    
    console.log(this.dss_report_data)

  },error =>{
    this.SpinnerService.hide()
  })
  }
  dss_expand_data(ind,singledata,data,dss_param){
    this.index_expense = ind + 1
    console.log("singledata=>",singledata)
    this.SpinnerService.show()
    this.dataService.dss_report(dss_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("level1=>",results['data'])
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
          if(dss_param['type']==2){
            val['Padding_left'] = "50px"
            val['tree_flag']='Y'
            // val['color']="#5d4037"
            val['color']="#000"
            data[ind]['tree_flag']='N'
          }
          if(dss_param['type']==3){
            val['Padding_left'] = "100px"
            val['tree_flag']='Y'
            // val['color']="#e27971"
            val['color']="#000"
            data[ind]['tree_flag']='N'

          }
          if(dss_param['type']==4){
            let glcode=val['name'].slice(0,6)
            console.log("glcode=>",glcode)
            if(glcode==112101){
              val['Padding_left'] = "120px"
              val['tree_flag']='Y'
              val['color']="#000"
              val['gl']='true'
              data[ind]['tree_flag']='N'
            }else{
              val['Padding_left'] = "120px"
              val['tree_flag']='Y'
              val['color']="#000"
              val['gl']='false'
              data[ind]['tree_flag']='N'
            }
            

          }
          let a = data

          data.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
        }
        console.log("data=>",data)
        // data[ind].tree_flag = 'N'  
        
          
        this.dss_report_data=data
        console.log("dss_report_data=>",this.dss_report_data)

        
        }
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  @ViewChild('tabledata')exceldownload_table : ElementRef;

  export(){
    let fileName="DSS-Report.xlsx"
    let element 
    if(this.dss_report_view==true){
      element = document.getElementById('commonstyle') as HTMLTableElement;
      if(this.exlcount==1){
        element.insertRow(0);
        element.insertRow(0);
      }
      this.exlcount=2
    }if(this.dssuploaddetails==true){
      element = document.getElementById('commonstyle1') as HTMLTableElement;
      if(this.exldown==1){
        element.insertRow(0);
        element.insertRow(0);
      }
      this.exldown=2

    }if(this.average_view==true){
      element = document.getElementById('average_file') as HTMLTableElement;
      if(this.average_download==1){
        element.insertRow(0);
        element.insertRow(0);
      }
      this.average_download=2
    }
  
    

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    for (let key in ws) {
        
      if (ws[key].v === '') {
        ws[key].v=0.00
        ws[key].t='f'
    }
  }


  let myNewData:string[][]
    // const myNewData = [['My header']];
    if(this.average_view==true){
     myNewData = [['','','',' Daily Statement Of Sources And Uses (DSS) Report','',''],[`From  Date:${this.fromdate}`,`To Date:${this.todate}`,'','','','','','','Amount In Corose']];
    }else{
     myNewData = [['','','',' Daily Statement Of Sources And Uses (DSS) Report','',''],['','','','','','','','','Amount In Corose']];
    }
    // var merge = { s: {r:0, c:3}, e: {r:0, c:9} };
    // var ws1 = XLSX.utils.aoa_to_sheet(data);
console.log("myNewData=>",myNewData)

XLSX.utils.sheet_add_aoa(ws, myNewData);

// ws['3:3']={font:{
//   color:"blue"
// }}
// if(!ws['!merges']) ws['!merges'] = [];
// ws['!merges'].push(merge)
console.log("ws=>",ws)

console.log("myNewData=>",ws)
    const newworkbook = XLSX.utils.book_new();
    console.log("newworkbook=>",newworkbook)

    
    XLSX.utils.book_append_sheet(newworkbook, ws,  'DSS-Report');
    // newworkbook.Sheets['DSS-Report'].A3.s = { font: { bold: true,color:'blue' } };
    // element.remove()
    XLSX.writeFile(newworkbook, fileName);
    // this.export()
    element=''
    // this.exlcount=2;
  }
  upload_file(e){
    console.log("event=>",e.target.files[0])
    let file_uplode=e.target.files[0]
   this.file_details=file_uplode
  }
  clear_filedetails(){
    this.dssreport.reset('')
    this.file_details=''
  }
  @ViewChild('closepop')closepop
  upload(){
    if(this.file_details==null || this.file_details==undefined || this.file_details==''){
      this.toastr.warning('', 'Please Select The Any .xlsx File', { timeOut: 1500 });
      return false;

    }
  //   this.dss_report_view=true
  //   this.dssuploaddetails=false
  //   let dss_report_data={
  //     "data": [
  //         {
  //             "BeginningBalance": 1907156.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Insurance premium payable to insurance company - LAP",
  //             "EndingBalance": 1907156.0,
  //             "date": {},
  //             "gl_no": 157132,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -418954981.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Collection Control Account - Pragati",
  //             "EndingBalance": -418954981.0,
  //             "date": {},
  //             "gl_no": 157134,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 1841945.72,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Asset - Leasehold Improvement",
  //             "EndingBalance": 1841945.72,
  //             "date": {},
  //             "gl_no": 211106,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 1789762.6,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Indian Overseas Bank CA -009102000006496",
  //             "EndingBalance": 1789762.6,
  //             "date": {},
  //             "gl_no": 233163,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -549008094.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Interest Income",
  //             "EndingBalance": -549008094.0,
  //             "date": {},
  //             "gl_no": 310101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -36808809.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Fee Income",
  //             "EndingBalance": -36808809.0,
  //             "date": {},
  //             "gl_no": 310102,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -2100926.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Preclosure Charges/ Penal Interest",
  //             "EndingBalance": -2100926.0,
  //             "date": {},
  //             "gl_no": 310104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -2881130.04,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Income from Discount on Commercial Paper",
  //             "EndingBalance": -2881130.04,
  //             "date": {},
  //             "gl_no": 310106,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -32204814.25,
  //             "Credits": 4636391.04,
  //             "Debits": 0.99,
  //             "Description": "Profit on Sale of Investment",
  //             "EndingBalance": -36841204.3,
  //             "date": {},
  //             "gl_no": 310107,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -522717604.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Interest Income-DO",
  //             "EndingBalance": -522717604.0,
  //             "date": {},
  //             "gl_no": 310109,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -34966230.52,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Processing Fee Income-DO",
  //             "EndingBalance": -34966230.52,
  //             "date": {},
  //             "gl_no": 310110,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -1112395.54,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Stamp Duty Collected-DO",
  //             "EndingBalance": -1112395.54,
  //             "date": {},
  //             "gl_no": 310111,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -13070164.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Additional Fees Collected-DO",
  //             "EndingBalance": -13070164.0,
  //             "date": {},
  //             "gl_no": 310112,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -1406880.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Penal Interest Collected-DO",
  //             "EndingBalance": -1406880.0,
  //             "date": {},
  //             "gl_no": 310113,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 27043425.55,
  //             "Credits": 7946032.67,
  //             "Debits": 0.0,
  //             "Description": "Income from Securitisation",
  //             "EndingBalance": 19097392.88,
  //             "date": {},
  //             "gl_no": 310115,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -69753984.38,
  //             "Credits": 15667.32,
  //             "Debits": 0.0,
  //             "Description": "Income from NCD",
  //             "EndingBalance": -69769651.7,
  //             "date": {},
  //             "gl_no": 310116,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 742379819.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Income from AIF",
  //             "EndingBalance": 742379819.0,
  //             "date": {},
  //             "gl_no": 310117,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 8550.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Income from NPS",
  //             "EndingBalance": 8550.0,
  //             "date": {},
  //             "gl_no": 310119,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -33225000.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Fee Income - LMS",
  //             "EndingBalance": -33225000.0,
  //             "date": {},
  //             "gl_no": 310120,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -15738758.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Income from Direct Assignment",
  //             "EndingBalance": -15738758.0,
  //             "date": {},
  //             "gl_no": 310121,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -346300.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Processing Fee Income - LAP",
  //             "EndingBalance": -346300.0,
  //             "date": {},
  //             "gl_no": 310123,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -1700.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "CERSAI Charges - LAP",
  //             "EndingBalance": -1700.0,
  //             "date": {},
  //             "gl_no": 310130,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 54131564.75,
  //             "Credits": 20958463.39,
  //             "Debits": 0.0,
  //             "Description": "Interest Income from Fixed Deposits",
  //             "EndingBalance": 33173101.36,
  //             "date": {},
  //             "gl_no": 320102,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -7338791.73,
  //             "Credits": 913252.55,
  //             "Debits": 0.0,
  //             "Description": "Gain/Loss on sale of Mutual Fund",
  //             "EndingBalance": -8252044.28,
  //             "date": {},
  //             "gl_no": 320106,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -8220.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Income from Other non-business sources",
  //             "EndingBalance": -8220.0,
  //             "date": {},
  //             "gl_no": 320108,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 179281583.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Interest on Secured Debenture",
  //             "EndingBalance": 179281583.0,
  //             "date": {},
  //             "gl_no": 411101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 45584.9,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Interest on Unsecured Debenture",
  //             "EndingBalance": 45584.9,
  //             "date": {},
  //             "gl_no": 411102,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 445918142.13,
  //             "Credits": 2968754.0,
  //             "Debits": 5924283.0,
  //             "Description": "Interest on Term Loan from Bank",
  //             "EndingBalance": 448873671.13,
  //             "date": {},
  //             "gl_no": 411103,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 151448345.21,
  //             "Credits": 0.0,
  //             "Debits": 1135196.0,
  //             "Description": "Interest on Term Loan from Others",
  //             "EndingBalance": 152583541.21,
  //             "date": {},
  //             "gl_no": 411104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 644238.89,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Interest on Overdraft",
  //             "EndingBalance": 644238.89,
  //             "date": {},
  //             "gl_no": 411105,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 27837.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Interest on Cash Credit",
  //             "EndingBalance": 27837.0,
  //             "date": {},
  //             "gl_no": 411106,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 869200.21,
  //             "Credits": 0.0,
  //             "Debits": 1509.6,
  //             "Description": "Bank Charges",
  //             "EndingBalance": 870709.81,
  //             "date": {},
  //             "gl_no": 411109,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -11726116.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Interest on Collateral Deposits",
  //             "EndingBalance": -11726116.0,
  //             "date": {},
  //             "gl_no": 411110,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 55913734.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Salary - Basic",
  //             "EndingBalance": 55913734.0,
  //             "date": {},
  //             "gl_no": 412101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 27956966.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Salary - House Rent Allowance",
  //             "EndingBalance": 27956966.0,
  //             "date": {},
  //             "gl_no": 412104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 4659529.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Salary - Leave Travel Allowance",
  //             "EndingBalance": 4659529.0,
  //             "date": {},
  //             "gl_no": 412105,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 6984838.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Salary - Other Reimbursements",
  //             "EndingBalance": 6984838.0,
  //             "date": {},
  //             "gl_no": 412107,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 9392149.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Salary - Special Allowance",
  //             "EndingBalance": 9392149.0,
  //             "date": {},
  //             "gl_no": 412108,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 190593.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Staff Food Coupon Expenses",
  //             "EndingBalance": 190593.0,
  //             "date": {},
  //             "gl_no": 412109,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 675583.0,
  //             "Credits": 0.0,
  //             "Debits": 650838.0,
  //             "Description": "Stipend",
  //             "EndingBalance": 1326421.0,
  //             "date": {},
  //             "gl_no": 412112,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 171414067.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Employee Bonus",
  //             "EndingBalance": 171414067.0,
  //             "date": {},
  //             "gl_no": 412113,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 6923033.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Admin Charges PF",
  //             "EndingBalance": 6923033.0,
  //             "date": {},
  //             "gl_no": 412117,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 2104965.0,
  //             "Credits": 0.0,
  //             "Debits": 742727.0,
  //             "Description": "Staff Welfare",
  //             "EndingBalance": 2847692.0,
  //             "date": {},
  //             "gl_no": 412119,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 72190.0,
  //             "Credits": 0.0,
  //             "Debits": 40461.0,
  //             "Description": "Relocation Expenses",
  //             "EndingBalance": 112651.0,
  //             "date": {},
  //             "gl_no": 412120,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 1480000.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Relocation for Sign-on Bonus",
  //             "EndingBalance": 1480000.0,
  //             "date": {},
  //             "gl_no": 412121,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 33490.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "NPS Expenses",
  //             "EndingBalance": 33490.0,
  //             "date": {},
  //             "gl_no": 412124,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 4457.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Employer Contribution to ESIC",
  //             "EndingBalance": 4457.0,
  //             "date": {},
  //             "gl_no": 412125,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 159140.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Telephone",
  //             "EndingBalance": 159140.0,
  //             "date": {},
  //             "gl_no": 441101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -8812.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Mobile",
  //             "EndingBalance": -8812.0,
  //             "date": {},
  //             "gl_no": 441102,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 190217.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Internet Charges",
  //             "EndingBalance": 190217.0,
  //             "date": {},
  //             "gl_no": 441104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 176105.0,
  //             "Credits": 0.0,
  //             "Debits": 117667.42,
  //             "Description": "Postage and Courier",
  //             "EndingBalance": 293772.42,
  //             "date": {},
  //             "gl_no": 441111,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -34879000.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Legal Expenses - Own",
  //             "EndingBalance": -34879000.0,
  //             "date": {},
  //             "gl_no": 442101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 0.0,
  //             "Credits": 0.0,
  //             "Debits": 4741500.0,
  //             "Description": "Rating Fees - Own",
  //             "EndingBalance": 4741500.0,
  //             "date": {},
  //             "gl_no": 442102,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 252030.0,
  //             "Credits": 0.0,
  //             "Debits": 88860.0,
  //             "Description": "Stamp Duty - Own",
  //             "EndingBalance": 340890.0,
  //             "date": {},
  //             "gl_no": 442104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 10419458.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Audit Fees - Internal Audit",
  //             "EndingBalance": 10419458.0,
  //             "date": {},
  //             "gl_no": 442106,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 0.0,
  //             "Credits": 0.0,
  //             "Debits": 604950.0,
  //             "Description": "Placement Fees",
  //             "EndingBalance": 604950.0,
  //             "date": {},
  //             "gl_no": 442109,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 195648485.43,
  //             "Credits": 76540.0,
  //             "Debits": 116915225.36,
  //             "Description": "Direct Origination Servicer Fee",
  //             "EndingBalance": 312487170.79,
  //             "date": {},
  //             "gl_no": 442110,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 241158.0,
  //             "Credits": 0.0,
  //             "Debits": 243730.0,
  //             "Description": "Consultancy Charges",
  //             "EndingBalance": 484888.0,
  //             "date": {},
  //             "gl_no": 442111,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 34379561.91,
  //             "Credits": 0.0,
  //             "Debits": 19909811.48,
  //             "Description": "Professional Charges - Own",
  //             "EndingBalance": 54289373.39,
  //             "date": {},
  //             "gl_no": 442112,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 0.0,
  //             "Credits": 0.0,
  //             "Debits": 65400.0,
  //             "Description": "Registration and Filing Fees",
  //             "EndingBalance": 65400.0,
  //             "date": {},
  //             "gl_no": 443101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 51240.0,
  //             "Credits": 0.0,
  //             "Debits": 1560.0,
  //             "Description": "Rate and Taxes",
  //             "EndingBalance": 52800.0,
  //             "date": {},
  //             "gl_no": 443102,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 16763503.96,
  //             "Credits": 52500.0,
  //             "Debits": 17671644.8,
  //             "Description": "Rental Expenses",
  //             "EndingBalance": 34382648.76,
  //             "date": {},
  //             "gl_no": 444101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -10000000.0,
  //             "Credits": 0.0,
  //             "Debits": 5705.0,
  //             "Description": "Travel - Air Ticket - Domestic",
  //             "EndingBalance": -9994295.0,
  //             "date": {},
  //             "gl_no": 446101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 0.0,
  //             "Credits": 0.0,
  //             "Debits": 25949.0,
  //             "Description": "Travel - Local Conveyance - Domestic",
  //             "EndingBalance": 25949.0,
  //             "date": {},
  //             "gl_no": 446103,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 1161032.0,
  //             "Credits": 0.0,
  //             "Debits": 507688.0,
  //             "Description": "Travel - Cab Hire - Domestic",
  //             "EndingBalance": 1668720.0,
  //             "date": {},
  //             "gl_no": 446104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 711874.0,
  //             "Credits": 0.0,
  //             "Debits": 969698.0,
  //             "Description": "Travel - Boarding and Lodging - Domestic",
  //             "EndingBalance": 1681572.0,
  //             "date": {},
  //             "gl_no": 446105,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 1267864.0,
  //             "Credits": 0.0,
  //             "Debits": 1822047.0,
  //             "Description": "Advertisement and Publishing Expenses",
  //             "EndingBalance": 3089911.0,
  //             "date": {},
  //             "gl_no": 447101,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 3442.0,
  //             "Credits": 0.0,
  //             "Debits": 4106.0,
  //             "Description": "Books and Periodicals",
  //             "EndingBalance": 7548.0,
  //             "date": {},
  //             "gl_no": 447102,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 0.0,
  //             "Credits": 0.0,
  //             "Debits": 715977.0,
  //             "Description": "Conference and Meeting Expenses",
  //             "EndingBalance": 715977.0,
  //             "date": {},
  //             "gl_no": 447103,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 135483.02,
  //             "Credits": 0.0,
  //             "Debits": 5850.0,
  //             "Description": "Parking Fee",
  //             "EndingBalance": 141333.02,
  //             "date": {},
  //             "gl_no": 447104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 225023.0,
  //             "Credits": 0.0,
  //             "Debits": 332275.5,
  //             "Description": "Subscription",
  //             "EndingBalance": 557298.5,
  //             "date": {},
  //             "gl_no": 447105,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 240145.0,
  //             "Credits": 0.0,
  //             "Debits": 200967.59,
  //             "Description": "Printing and Stationery",
  //             "EndingBalance": 441112.59,
  //             "date": {},
  //             "gl_no": 447106,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": -3.43,
  //             "Credits": 10.25,
  //             "Debits": 8.28,
  //             "Description": "Rounding off",
  //             "EndingBalance": -5.4,
  //             "date": {},
  //             "gl_no": 447110,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 1035500.0,
  //             "Credits": 0.0,
  //             "Debits": 0.0,
  //             "Description": "Director Sitting Fees",
  //             "EndingBalance": 1035500.0,
  //             "date": {},
  //             "gl_no": 447112,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 85691.0,
  //             "Credits": 0.0,
  //             "Debits": 151653.0,
  //             "Description": "Housekeeping",
  //             "EndingBalance": 237344.0,
  //             "date": {},
  //             "gl_no": 448104,
  //             "id": NaN
  //         },
  //         {
  //             "BeginningBalance": 12308887.42,
  //             "Credits": 0.0,
  //             "Debits": 1039836.9,
  //             "Description": "Repair and Maintenance - Others",
  //             "EndingBalance": 13348724.32,
  //             "date": {},
  //             "gl_no": 448108,
  //             "id": NaN
  //         }
  //     ],
  //     "message": "Successfully Created",
  //     "status": "success"
  // }
    
  //   this.filedata=dss_report_data['data']
  //   this.dss_report_view=false
  //   this.dssuploaddetails=true
  //   this.dss_report=true
  //   this.closepop.nativeElement.click();
  //   this.dssreport.reset('')
    
    
    this.SpinnerService.show()
    this.dataService.dssupload(this.file_details).subscribe((e:any)=>{
    this.SpinnerService.hide()
    console.log("element=>",e.message)
    if(e.status=='success'){

      this.toastr.success("","successfully Created",{timeOut:1500})
      let dssfile:any=e['message']['data']
      if(dssfile.length>0){
        this.filedata=dssfile
        this.dss_report_view=false
        this.dssuploaddetails=true
        this.average_view=false
        this.dss_report=true
        this.upload_dss=true
        this.closepop.nativeElement.click();
        this.dssreport.reset('')
        this.dssreport_date.reset('')
        
      }else{
        this.closepop.nativeElement.click();
        this.dssuploaddetails=false
        this.dss_report=false
        this.upload_dss=true
        this.average_view=false
        
        this.dssreport.reset('')
        if(this.dssreport_date.value!=''){
          this.changeview=true
          this.dss_summary_search(this.dssreport_date.value,1)
        }
      }
    }

        
      console.log("filedata=>",this.filedata)
      
      this.dssreport.reset('')
      
  },error=>{
    console.log('error',error)
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }
  datehidden=false
  averagechanges(e){
    this.dssreport_date.reset('')
    this.dssreportfrom_date.reset('')
    this.dssreportto_date.reset('')
    if(e==true){
      this.datehidden=true 
    }else{
      this.datehidden=false
    }
    console.log("chenge=>",e)
  }
  budget_upload(){

  }
  report_to_average(e){
    console.log("event=>",e)
    let report_or_average=e.checked
    if(report_or_average==true){
      this.dssreport_date.reset('')
      this.dssaverage.controls['averagefrom_date'].reset('')
      this.dssaverage.controls['averageto_date'].reset('')
      this.dss_report_view=false
      this.dssuploaddetails=false
      this.dss_report=false
      this.upload_dss=false
      this.average_view=false
      this.average=true
      this.report=false
      console.log('average=>',this.average,this.report)
    }else{
      this.dssreport_date.reset('')
      this.dssaverage.controls['averagefrom_date'].reset('')
      this.dssaverage.controls['averageto_date'].reset('')
      this.dss_report_view=false
      this.dssuploaddetails=false
      this.dss_report=false
      this.upload_dss=true
      this.average_view=false
      this.report=true
      this.average=false
      console.log('report=>',this.average,this.report)
    }
  }
  tree_level_average(ind,average_single,total_average_data){
    let a=[]
    let a2 = ind + 1
    console.log("tree")
    if (average_single.tree == 'N') {
      if (average_single.Padding_left == '10px') {
        for (let i = a2; i < total_average_data.length; i++) {
          let a1 = total_average_data[i]
          if((a1.Padding_left == '50px')|| (a1.Padding_left == '100px')|| (a1.Padding_left == '120px') ){
            a.push(i)
          }
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (average_single.Padding_left == '50px') {
        for (let i = a2; i < total_average_data.length; i++) {
          let a1 = total_average_data[i]
          if((a1.Padding_left == '100px')|| (a1.Padding_left == '120px') ){
         
          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (average_single.Padding_left == '100px') {
        for (let i = a2; i < total_average_data.length; i++) {
          let a1 = total_average_data[i]
          if((a1.Padding_left == '120px')){

          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px')) { break; }

        }
      }
     
      // a.pop()
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = total_average_data.filter((value, i) =>  !a.includes(i));
      arrayWithValuesRemoved[ind].tree = 's'
      this.dss_average = arrayWithValuesRemoved;

     
    }else{
      if (average_single.Padding_left == '10px') {
      let average_report_param={
        "from_date":this.fromdate,
        "to_date":this.todate,
        "type":2,
        "id":average_single.id
      }
      console.log(average_single)
      this.average_expand_data(ind,average_single,total_average_data,average_report_param)
    }
    if (average_single.Padding_left == '50px') {
      let average_report_param={
        "from_date":this.fromdate,
        "to_date":this.todate,
        "type":3,
        "id":average_single.id
      }
      console.log(average_single)
      this.average_expand_data(ind,average_single,total_average_data,average_report_param)
    }
    if (average_single.Padding_left == '100px') {
      let average_report_param={
        "from_date":this.fromdate,
        "to_date":this.todate,
        "type":4,
        "id":average_single.id
      }
      console.log(average_single)
      this.average_expand_data(ind,average_single,total_average_data,average_report_param)
    }
  
    
  }

  }
  average_expand_data(ind,average_single,total_average_data,average_param){
    this.index_expense = ind + 1
    console.log("singledata=>",average_single)
    this.SpinnerService.show()
    this.dataService.dss_average(average_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("level1=>",results['data'])
      
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {
 
        for (var val of datas) {
          
          if(average_param['type']==2){
            val['Padding_left'] = "50px"
            val['tree']='s'
            total_average_data[ind]['tree']='N'
          }
          if(average_param['type']==3){
            val['Padding_left'] = "100px"
            val['tree']='s'           
            total_average_data[ind]['tree']='N'

          }
          if(average_param['type']==4){         
              val['Padding_left'] = "120px"
              val['tree']='s'
              total_average_data[ind]['tree']='N'          
          }
          let a = total_average_data

          total_average_data.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
        }
        console.log("data=>",total_average_data)
        // data[ind].tree_flag = 'N'  
        this.dss_average=total_average_data
        console.log("dss_report_data=>",this.dss_report_data)
        }
      
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

  }
  fromdatechanges(){
    this.dssaverage.controls['averageto_date'].reset('')
    

  }
}
