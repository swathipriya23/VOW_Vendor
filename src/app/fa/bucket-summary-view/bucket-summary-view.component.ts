import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {faShareService} from '../share.service';
@Component({
  selector: 'app-bucket-summary-view',
  templateUrl: './bucket-summary-view.component.html',
  styleUrls: ['./bucket-summary-view.component.scss']
})
export class BucketSummaryViewComponent implements OnInit {
  additionData:Array<any>=[{}];
  removalData:Array<any>=[];
  sum_add_invoice_value:number=0;
  sum_add_asset_value:number=0;
  sum_rem_invoice_value:number=0;
  sum_rem_asset_value:number=0;
  sum_rev_cap_value:number=0;
  sum_total_net_value:number=0;
  getBucketId:number=0;
  presentPage:number=1;
  presentremovepage:number=1;
  constructor(private spinner:NgxSpinnerService,private service:faShareService) { }

  ngOnInit(): void {
   this.getBucketId= this.service.bucket_id.value;
    // setTimeout(()=>{
    //   this.spinner.show();
    // },
    // 2000
    // );
    // this.spinner.hide();
    
  }

}
