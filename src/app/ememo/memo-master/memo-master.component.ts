import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service'
import { Router } from '@angular/router'
import { SharedService } from '../../service/shared.service'
import { NotificationService } from '../../service/notification.service'

@Component({
  selector: 'app-memo-master',
  templateUrl: './memo-master.component.html',
  styleUrls: ['./memo-master.component.scss']
})
export class MemoMasterComponent implements OnInit {

  priorityList: Array<any>

  isPriority: boolean

  constructor(private dataService: DataService,private router: Router,private notification: NotificationService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getPriorityList();
    
  }


  getPriorityList() {
    this.dataService.getPriorityList()
      .subscribe((results: any[]) => {
        let datas = results["data"]; ``
        this.priorityList = datas;
        // console.log("prioritylist", this.priorityList)
      })
  }

  priorityEdit(data: any) {
    this.sharedService.priorityEditValue.next(data)
    this.router.navigateByUrl('/ememo/priorityEdit',{ skipLocationChange: true })
    return data;
  }

  deletePriority(data) {
    let value = data.id
    // console.log("deletePriority", value)
    this.dataService.priorityDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getPriorityList();
        return true

      })
  }


  priorityBtn(){
    this.isPriority = true;
    // console.log("priority clicked")
    
     
  }

}
