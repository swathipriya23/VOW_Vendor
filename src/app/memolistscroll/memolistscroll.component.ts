import { Component, OnInit } from '@angular/core';
import { MemoService } from '../service/memo.service';
import { MEMOLIST } from '../model/memointerface';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-memolistscroll',
  templateUrl: './memolistscroll.component.html',
  styleUrls: ['./memolistscroll.component.scss']
})
export class MemolistscrollComponent implements OnInit {
  memolist:Array<any>;
  
  has_next = true;
  
  currentpage:number=1;

  constructor(private memoService: MemoService) { }

  ngOnInit(): void {
    this.loadMemoList()
  }

  private loadMemoList() {
    this.memoService.findMemoList()
      .subscribe((results: any[]) => {
        let datapagination=results["pagination"];
        this.memolist = results["data"];
        // console.log('memo', this.memolist);
        this.has_next=datapagination.has_next;
        this.currentpage=datapagination.index;
        // console.log(this.has_next,this.currentpage);
      })
    }
    //--Endof loadMemoList--
    public onMemoNext() {
      if (this.has_next ) {
        
        this.loadNextMemoList();
     }
    }
    //End of onScroll
    loadNextMemoList() {
      this.memoService.findMemoList('1_to_dept','asc',this.currentpage+1,10)
      .subscribe((results: any[]) => {
        let datapagination=results["pagination"];
        // console.log('r', results["data"]);
        this.memolist = results["data"];
        this.has_next=datapagination.has_next;
        this.currentpage=datapagination.index;
        // console.log(this.has_next,this.currentpage);
        // console.log(datapagination);
        // console.log('pagination');
        // console.log(datapagination.has_next,datapagination.index);
       });//End of loadNextMemoList
    }

}
