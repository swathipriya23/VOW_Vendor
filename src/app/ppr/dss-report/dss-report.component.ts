import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';


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
  dss_report_data: any;
  dss_date: any;
  end_date: any;
  index_expense: any;
  header_name: any[];
  exlcount: number=1;
  file_details: any;
  dss_report_param: { date: any; type: any; };
  constructor(private errorHandler: ErrorhandlingService,public datepipe: DatePipe,  private dataService: PprService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
  dss_report_view=false
  dss_report:any
  ngOnInit(): void {
    
  }
  dss_summary_clear(){
    this.dssreport_date.reset('')
  }
  dss_summary_search(date,source){
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
        this.header_name=[this.end_date,this.dss_date]

    console.log("date",this.header_name,this.dss_date,this.end_date,source)
    this.dss_report_param={
      "date":this.dss_date,
      "type":source
    }
      //  let dssdata=this.dss_report['data'][0]
      // this.dss_report_data=dssdata
      this.SpinnerService.show()
      this.dataService.dss_report(this.dss_report_param).subscribe((data:any)=>{
        this.SpinnerService.hide()
        this.dss_report_view=true
        
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

  treelevel_click(index,dssreport,dss_report_data){
    let a=[]
    let a2 = index + 1
    console.log("tree")
    if (dssreport.tree_flag == 'N') {
      if (dssreport.Padding_left == '10px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '50px')|| (a1.Padding_left == '100px')|| (a1.Padding_left == '120px') || (a1.Padding_left == '130px')){
            a.push(i)
          }
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (dssreport.Padding_left == '50px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '100px')|| (a1.Padding_left == '120px') || (a1.Padding_left == '130px')){
         
          a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (dssreport.Padding_left == '100px') {
        for (let i = a2; i < dss_report_data.length; i++) {
          let a1 = dss_report_data[i]
          if((a1.Padding_left == '120px') || (a1.Padding_left == '130px')){

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
        "type":4,
        "id":dssreport.id
      }
      console.log(dssreport)
      let different=0
      this.calretain(different,index,dss_report_data)
    }
    
  }
  
  }
  calretain(diff,ind,data){
    this.index_expense = ind + 1
    this.SpinnerService.show()
    this.dataService.dss_report(this.dss_report_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      
   
    console.log("data=>",results['data'])
    let dssdata=results['data']
    this.dss_report_data=dssdata
    // for (let level of this.dss_report_data) {
     
      data[ind]['tree_flag']='N'
      let opening_balance=this.dss_report_data[1].value[0].opening_balance - this.dss_report_data[0].value[0].opening_balance
      let closing_balance=this.dss_report_data[1].value[0].closing_balance - this.dss_report_data[0].value[0].closing_balance
      let growth_sources=((this.dss_report_data[0].value[0].closing_balance - this.dss_report_data[0].value[0].opening_balance) / this.dss_report_data[0].value[0].opening_balance) * 100
      let growth_uses=((this.dss_report_data[1].value[0].closing_balance - this.dss_report_data[1].value[0].opening_balance) / this.dss_report_data[1].value[0].opening_balance) * 100
      let source_mtd= ((this.dss_report_data[0].value[0]?.closing_balance - this.dss_report_data[0]?.value[2]?.month_balance) /this.dss_report_data[0]?.value[2]?.month_balance) * 100
      let uses_mtd= ((this.dss_report_data[1].value[0]?.closing_balance - this.dss_report_data[1]?.value[2]?.month_balance) /this.dss_report_data[1]?.value[2]?.month_balance) * 100
      let month_balance=this.dss_report_data[1]?.value[2]?.month_balance - this.dss_report_data[0]?.value[2]?.month_balance
      if(isFinite(growth_uses)==false){
        growth_uses=0
      } if(isFinite(growth_sources)==false){
        growth_sources=0
      } if( isFinite(source_mtd)==false){
        source_mtd=0
      }if(isFinite(uses_mtd)==false){
        uses_mtd=0
      }
      console.log("mtd=>",source_mtd,uses_mtd)
      let mtd=uses_mtd-source_mtd
      let growth=growth_uses-growth_sources
      console.log("amount=>",opening_balance,closing_balance,month_balance)
      let datas={
        "name": "Profit Or Loss",
        "value": [
            {
                "growth":growth,
                "month_balance":month_balance,
                "closing_balance": closing_balance,
                "date":this.dss_date,
                "mtd":mtd,
                "opening_balance": opening_balance
              },
              {
                "growth":growth,
                "closing_balance": opening_balance,
                "date":this.end_date,
                "mtd":mtd,
                "opening_balance": opening_balance
              },
          ],
          'Padding_left':"130px",
          'tree_flag':'Y',
          'color':"#66bb6a",
    }
      data.splice(this.index_expense, 0, datas);
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
    let element = document.getElementById('commonstyle') as HTMLTableElement;
    if(this.exlcount==1){
      element.insertRow(0);
      element.insertRow(0);
    }
    

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    for (let key in ws) {
        
      if (ws[key].v === '') {
        ws[key].v=0.00
        ws[key].t='n'
    }
  }



    // const myNewData = [['My header']];
    let myNewData:string[][] = [['','','',' Daily Statement Of Sources And Uses (DSS) Report','',''],['','','','','','','','','Amount In Corose']];
    
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
    this.exlcount=2;
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
    this.SpinnerService.show()
    this.dataService.dssupload(this.file_details).subscribe(e=>{
    this.SpinnerService.hide()

      console.log("element=>",e)
      this.toastr.success(e.message)
      this.closepop.nativeElement.click();
      this.dssreport.reset('')
      
  },error=>{
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }
}
