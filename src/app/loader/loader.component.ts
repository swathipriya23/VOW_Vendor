import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service'
import { Subject, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.dataService.isLoading;


  constructor(private dataService: DataService) { }

  ngOnInit(): void {

  }

}
