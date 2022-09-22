import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ComponentLoaderDirective } from 'src/app/directives/component-loader.directive';
import { SharedService } from 'src/app/service/shared.service';
import { MemodeptComponent } from '../memodept/memodept.component';
import { MemoindividualComponent } from '../memoindividual/memoindividual.component';

@Component({
  selector: 'app-memosummary',
  templateUrl: './memosummary.component.html',
  styleUrls: ['./memosummary.component.scss']
})
export class MemosummaryComponent implements OnInit {

  masterMenuItems = [
    { itemName: "Note for Approval", displayName: "Note for Approval", component: MemoindividualComponent },
    { itemName: "Inter-Office Memo", displayName: "Inter-Office Memo", component: MemodeptComponent }
  ];

  activeItem: string;
  activeComponent: any;
  tabs=[];  

  @ViewChildren(ComponentLoaderDirective) componentLoaders: QueryList<ComponentLoaderDirective>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,public sharedService:SharedService)
  {
  }

  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    this.sharedService.MyModuleName="eMemo(Note for Approval & Inter-Office Memo)"
  }

  ngOnInit(): void {

    // this.sharedService.MyModuleName="eMemo(Note for Approval & Inter-Office Memo)"
    this.tabs = [
      { tabIndex: 0,itemName: "Note for Approval", displayName: "Note for Approval", component: MemoindividualComponent },
      { tabIndex: 1,itemName: "Inter-Office Memo", displayName: "Inter-Office Memo" , component: MemodeptComponent }
    ];
    // console.log(this.tabs);

    this.tabs.forEach((eachtab) => {
        setTimeout(() => {
          var componentLoadersArray = this.componentLoaders.toArray();
          // console.log('each.activeComponent',eachtab.component);
          // console.log('tabindex',eachtab.tabIndex);
          var componentFactory = this.componentFactoryResolver.resolveComponentFactory(eachtab.component);
          var viewContainterRef = componentLoadersArray[eachtab.tabIndex].viewContainerRef;
          var componentRef = viewContainterRef.createComponent(componentFactory);
        }, 100);
    });
    if (this.sharedService.Memofrom==="IOMEMO"){
      this.menuTabClick(this.tabs[1]);
    }else{
      this.menuTabClick(this.tabs[0]);
    }

  } ///endof ngOnInit

  menuTabClick(TabItem: any){
    // console.log('menuTabClick',this.activeItem)
    this.activeItem = TabItem.itemName;
    this.activeComponent=TabItem.component
  }
}
