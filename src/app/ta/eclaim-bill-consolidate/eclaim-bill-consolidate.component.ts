import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {TaService} from '../ta.service'

@Component({
  selector: 'app-eclaim-bill-consolidate',
  templateUrl: './eclaim-bill-consolidate.component.html',
  styleUrls: ['./eclaim-bill-consolidate.component.scss']
})
export class EclaimBillConsolidateComponent implements OnInit {
  eclaimbillmodal:any;
  taeclaimbillForm:FormGroup;
  getconsolidateList:any;
  constructor(private taservice:TaService) { }

  ngOnInit(): void {
    this.eclaimbillmodal={
      requestno:''
    }
  }
  tourno:any;
billSearch(){
  let search = this.eclaimbillmodal
  this.tourno= this.eclaimbillmodal.requestno
  this.taservice.getconsolidatereport(this.tourno)
  .subscribe(result =>{
    this.getconsolidateList=result
    
  })
}
reset(){
  this.eclaimbillmodal.requestno=""
}
}
