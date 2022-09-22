import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public TourMakerEditId = new BehaviorSubject<string>('');
  public TourMakerEditpatch= new BehaviorSubject<string>('');
  public TourapproveviewId= new BehaviorSubject<string>('');
  public advancesummaryData=new BehaviorSubject<string>('');
  public advanceapprove=new BehaviorSubject<string>('');
  public approveview=new BehaviorSubject<string>('');
  public expensesummaryData=new BehaviorSubject<string>('');
  public dropdownvalue=new BehaviorSubject<string>('');
  public expenseedit=new BehaviorSubject<string>('');
  public fetchValue=new BehaviorSubject<string>('');
  public fetchData=new BehaviorSubject<string>('');
  public tourData=new BehaviorSubject<string>('');
  public empData=new BehaviorSubject<string>('');
  public report=new BehaviorSubject<string>('');
  public tourreasonid=new BehaviorSubject<string>('');
  public emptourreasonid=new BehaviorSubject<string>('');
  public radiovalue=new BehaviorSubject<string>('');
  public statusvalue=new BehaviorSubject<string>('');
  public tourno=new BehaviorSubject<number>(0);
  public approveback=new BehaviorSubject<number>(0);
  public onbehalf=new BehaviorSubject<number>(0);
  public tourmakeonbehalf=new BehaviorSubject<number>(0);
  public exponbehalf=new BehaviorSubject<number>(0);
  public expmakeonbehalf=new BehaviorSubject<number>(0);
  public requestdate=new BehaviorSubject<string>('');
  public expemployee=new BehaviorSubject<string>('');
  public expbranchid=new BehaviorSubject<string>('');
  public action=new BehaviorSubject<string>('');
  public expensetourid=new BehaviorSubject<string>('');
  public forwardData=new BehaviorSubject<string>('');
  public id=new BehaviorSubject<string>('');
  public booking=new BehaviorSubject<string>('');
  public booking_sts=new BehaviorSubject<string>('');
  // public report_tournumb= new BehaviorSubject<number>(null);
  // public report_tourpage= new BehaviorSubject<number>(1);
  // public report_requirement=new BehaviorSubject<string>('');
  // public report_startdate=new BehaviorSubject<any>(null);
  // public report_enddate=new BehaviorSubject<any>(null);
  public reportvalue = new BehaviorSubject<string>('');
  // alltour
  public all_tournumb=new BehaviorSubject<number>(null);
  public all_tourpage=new BehaviorSubject<number>(1);
  public branchid=new BehaviorSubject<number>(null);
  public all_tourstartdate=new BehaviorSubject<string>('');
  public employee=new BehaviorSubject<string>('');
  public all_tourenddate=new BehaviorSubject<string>('');
  public all_tourrequirement=new BehaviorSubject<string>('');
  public reference_no=new BehaviorSubject<string>('');
  


  constructor() { }
}
