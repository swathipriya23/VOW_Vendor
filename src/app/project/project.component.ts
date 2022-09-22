import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  varA: string;
  varB: number;
  varC: boolean;
  varD: any;
  varE: any[];

  constructor() { }

  ngOnInit(): void {
    this.varA = 'Test project'
  }

  test(){
    this.varA = 'Welcome to this project'
  }

  back(){
    this.varA = 'Test project'
  }

}
