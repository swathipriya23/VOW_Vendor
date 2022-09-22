import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetCategoryCreateComponent } from '../fa/asset-category-create/asset-category-create.component';
import { FaMasterComponent } from './fa-master/fa-master.component';
import { FaTransactionSummaryComponent } from './fa-transaction-summary/fa-transaction-summary.component';
import { AssetMakerComponent } from './asset-maker/asset-maker.component';
import { AssetMakerAddComponent } from './asset-maker-add/asset-maker-add.component';
import { AssetMakerSplitComponent } from './asset-maker-split/asset-maker-split.component';
import { AssetCheckerViewComponent } from './asset-checker-view/asset-checker-view.component';
import { CpdatechangeAddComponent } from './cpdatechange-add/cpdatechange-add.component';
import { WriteoffmakerAddComponent } from './writeoffmaker-add/writeoffmaker-add.component';
import { ImpairmentAddComponent } from './impairment-add/impairment-add.component';
import { ValuereductionAddComponent } from './valuereduction-add/valuereduction-add.component';
import { AssetclubAddComponent } from './assetclub-add/assetclub-add.component';
import { MergemakerAddComponent } from './mergemaker-add/mergemaker-add.component';
import { SplitmakerAddComponent } from './splitmaker-add/splitmaker-add.component';
import { CategorymakerAddComponent } from './categorymaker-add/categorymaker-add.component';
import { SalemakerAddComponent } from './salemaker-add/salemaker-add.component';
import { PhysicalverificationAddComponent } from './physicalverification-add/physicalverification-add.component';
import { SplimakerViewComponent } from './splimaker-view/splimaker-view.component';
import { SplitSummaryComponent } from './split-summary/split-summary.component';
import { FaqueryComponent } from './faquery/faquery.component';
import { WriteOffSummaryComponent } from './write-off-summary/write-off-summary.component'
import { ValuechangemakersummaryComponent } from './valuechangemakersummary/valuechangemakersummary.component';
import { ValuechangemakeraddComponent } from './valuechangemakeradd/valuechangemakeradd.component';
import { ValuechangecheckersummaryComponent } from './valuechangecheckersummary/valuechangecheckersummary.component';
import { TransfermakersummaryComponent } from './transfermakersummary/transfermakersummary.component';
import { TransfermakeraddComponent } from './transfermakeradd/transfermakeradd.component';
import { TransfercheckersummaryComponent } from './transfercheckersummary/transfercheckersummary.component';
import { AssetMakerSummaryComponent } from './asset-maker-summary/asset-maker-summary.component';
import { AssetCheckerSummaryComponent } from './asset-checker-summary/asset-checker-summary.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { CategorychangesummaryComponent } from './categorychangesummary/categorychangesummary.component';
import { CategorychangesummaryaddComponent } from './categorychangesummaryadd/categorychangesummaryadd.component';
import { CategorychangeapproveComponent } from './categorychangeapprove/categorychangeapprove.component';

import { MergeSummaryComponent } from './merge-summary/merge-summary.component'
import { ImpairmentSummaryComponent } from './impairment-summary/impairment-summary.component'
import { ImpairmentMappingComponent } from './impairment-mapping/impairment-mapping.component';


import { CpdatechangeMakerSummaryComponent } from './cpdatechange-maker-summary/cpdatechange-maker-summary.component';

import { AssetsaleaddComponent } from './assetsaleadd/assetsaleadd.component';
import { AssetsalesummaryComponent } from './assetsalesummary/assetsalesummary.component';
import { AssetsalesapproveComponent } from './assetsalesapprove/assetsalesapprove.component';
import { AssetclubsummaryComponent } from './assetclubsummary/assetclubsummary.component';
import { AssetclubmakerComponent } from './assetclubmaker/assetclubmaker.component';
import { AssestclubaprsummaryComponent } from './assestclubaprsummary/assestclubaprsummary.component';
import { FaPvComponent } from './fa-pv/fa-pv.component';
import { ApproverComponent } from './approver/approver.component';
import { CpDatechangeCheckerComponent } from './cp-datechange-checker/cp-datechange-checker.component';
import { FaDepreciationCalComponent } from './fa-depreciation-cal/fa-depreciation-cal.component';
import {BucketSummaryComponent} from './bucket-summary/bucket-summary.component';
import { BucketSummaryViewComponent } from './bucket-summary-view/bucket-summary-view.component';
import { FaReportComponent } from './fa-report/fa-report.component';
import { FaFileuploadComponent } from './fa-fileupload/fa-fileupload.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: "assetcategorycreate", component: AssetCategoryCreateComponent },
      { path: "famaster", component: FaMasterComponent },
      { path: "fa", component: FaTransactionSummaryComponent },
      { path: "assetmaker", component: AssetMakerComponent },
      { path: "assetmakeradd", component: AssetMakerAddComponent },
      { path: "assetmakersplit", component: AssetMakerSplitComponent },
      { path: "assetcheckerview", component: AssetCheckerViewComponent },
      { path: "cpdatechangeadd", component: CpdatechangeAddComponent },
      { path: "writeoffadd", component: WriteoffmakerAddComponent },
      { path: "impairmentadd", component: ImpairmentAddComponent },
      { path: "valuereductionadd", component: ValuereductionAddComponent },
      { path: "assetclubadd", component: AssetclubAddComponent },
      { path: "mergemakeradd", component: MergemakerAddComponent },
      { path: "splitmakeradd", component: SplitmakerAddComponent },
      { path: "splitmakerview", component: SplimakerViewComponent },
      { path: "WriteOff/:data", component: WriteOffSummaryComponent },
      { path: "Split/:data", component: SplitSummaryComponent },
      { path: 'valuechangemakersummary', component: ValuechangemakersummaryComponent },
      { path: 'valuechangemakeradd', component: ValuechangemakeraddComponent },
      { path: 'valuechangecheckersummary', component: ValuechangecheckersummaryComponent },
      { path: 'transfermakersummary', component: TransfermakersummaryComponent },
      { path: 'transfermakeradd', component: TransfermakeraddComponent },
      { path: 'transfercheckersummary', component: TransfercheckersummaryComponent },
      { path: "assetmakersummary", component: AssetMakerSummaryComponent },
      { path: 'assetcheckersummary', component: AssetCheckerSummaryComponent },
      { path: "faquery", component: FaqueryComponent },
      { path: 'categorychangesummary', component: CategorychangesummaryComponent },
      { path: 'categorychangeadd', component: CategorychangesummaryaddComponent },
      { path: 'categorychangeapprove', component: CategorychangeapproveComponent },
      { path: 'Merge/:data', component: MergeSummaryComponent },
      { path: 'Impairment/:data', component: ImpairmentSummaryComponent },
      { path: 'ImpairmentMapping', component: ImpairmentMappingComponent },
      { path: 'cpdatechangesummary', component: CpdatechangeMakerSummaryComponent },
      { path: 'Assetsaleadd', component: AssetsaleaddComponent },
      { path: 'Assetsalesummary', component: AssetsalesummaryComponent },
      { path: 'assetsalesapprove', component: AssetsalesapproveComponent },
      { path: "clubsummary", component: AssetclubsummaryComponent },
      { path: "clubmaker", component: AssetclubmakerComponent },
      { path: 'clubchecker', component: AssestclubaprsummaryComponent },
      { path: "fa-pv", component: FaPvComponent },
      { path: "approver", component: ApproverComponent },
      { path:"fa_depreciation", component: FaDepreciationCalComponent },
      { path: 'cpdatechangesummary', component: CpdatechangeMakerSummaryComponent },
      { path: 'cpdatechangechecker', component: CpDatechangeCheckerComponent },
      { path:'bucketsummary',component:BucketSummaryComponent},
      { path:'bucketsummaryview' , component:BucketSummaryViewComponent},
      { path:'fareport', component:FaReportComponent},
      { path:'faupload', component:FaFileuploadComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FARoutingModule { }
