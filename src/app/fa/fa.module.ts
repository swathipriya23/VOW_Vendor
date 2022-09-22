import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxPaginationModule } from 'ngx-pagination'
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
// import { NgxSpinnerModule } from 'ngx-spinner';
import { FARoutingModule } from './fa-routing.module';
import { AssetCategoryCreateComponent } from './asset-category-create/asset-category-create.component';
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
import { AssetCategoryEditComponent } from './asset-category-edit/asset-category-edit.component';
import { WriteOffSummaryComponent } from './write-off-summary/write-off-summary.component';
import { SplitSummaryComponent } from './split-summary/split-summary.component';
import { ValuechangemakersummaryComponent } from './valuechangemakersummary/valuechangemakersummary.component';
import { ValuechangemakeraddComponent } from './valuechangemakeradd/valuechangemakeradd.component';
import { ValuechangecheckersummaryComponent } from './valuechangecheckersummary/valuechangecheckersummary.component';
import { ValuechangecheckeraddComponent } from './valuechangecheckeradd/valuechangecheckeradd.component';
import { ValuechangecheckerapproveComponent } from './valuechangecheckerapprove/valuechangecheckerapprove.component';
import { TransfermakersummaryComponent } from './transfermakersummary/transfermakersummary.component';
import { TransfermakeraddComponent } from './transfermakeradd/transfermakeradd.component';
import { TransfercheckersummaryComponent } from './transfercheckersummary/transfercheckersummary.component';
import { TransfercheckerapproveComponent } from './transfercheckerapprove/transfercheckerapprove.component';
import { AssetMakerSummaryComponent } from './asset-maker-summary/asset-maker-summary.component';
import { AssetCheckerSummaryComponent } from './asset-checker-summary/asset-checker-summary.component';
import { FaqueryComponent } from './faquery/faquery.component';

import { AssetlocationComponent } from './assetlocation/assetlocation.component';
import { AssetcatComponent } from './assetcat/assetcat.component';
import { AssetclubmakerComponent } from './assetclubmaker/assetclubmaker.component';
import { AssestclubaprsummaryComponent } from './assestclubaprsummary/assestclubaprsummary.component';
import { AssetclubsummaryComponent } from './assetclubsummary/assetclubsummary.component';
import { FaPvComponent } from './fa-pv/fa-pv.component';
import { ApproverComponent } from './approver/approver.component';

import { CategorychangeapproveComponent} from './categorychangeapprove/categorychangeapprove.component'
import { CategorychangesummaryComponent} from './categorychangesummary/categorychangesummary.component'
import { CategorychangesummaryaddComponent} from './categorychangesummaryadd/categorychangesummaryadd.component';

import { MergeSummaryComponent } from './merge-summary/merge-summary.component';
import { ImpairmentSummaryComponent } from './impairment-summary/impairment-summary.component';
import { ImpairmentMappingComponent } from './impairment-mapping/impairment-mapping.component';

import { CpdatechangeMakerSummaryComponent } from './cpdatechange-maker-summary/cpdatechange-maker-summary.component'
import { AssetsaleaddComponent } from './assetsaleadd/assetsaleadd.component';
import { AssetsalesummaryComponent } from './assetsalesummary/assetsalesummary.component';
import { AssetsalesapproveComponent } from './assetsalesapprove/assetsalesapprove.component';
import { CpDatechangeCheckerComponent } from './cp-datechange-checker/cp-datechange-checker.component';
import { FaDepreciationCalComponent } from './fa-depreciation-cal/fa-depreciation-cal.component';
import { BucketSummaryComponent } from './bucket-summary/bucket-summary.component';
import { BucketSummaryViewComponent } from './bucket-summary-view/bucket-summary-view.component';
import { FaReportComponent } from './fa-report/fa-report.component';
import { FaFileuploadComponent } from './fa-fileupload/fa-fileupload.component';


@NgModule({

  declarations: [AssetCategoryCreateComponent, FaMasterComponent, FaTransactionSummaryComponent,
    AssetMakerComponent, AssetMakerAddComponent, AssetMakerSplitComponent, AssetCheckerViewComponent,
    CpdatechangeAddComponent, WriteoffmakerAddComponent, ImpairmentAddComponent, ValuereductionAddComponent,
    AssetclubAddComponent, MergemakerAddComponent, SplitmakerAddComponent,
    CategorymakerAddComponent, SalemakerAddComponent, PhysicalverificationAddComponent,
    SplimakerViewComponent, AssetCategoryEditComponent, WriteOffSummaryComponent, SplitSummaryComponent,
    SplimakerViewComponent, AssetCategoryEditComponent, WriteOffSummaryComponent,
    ValuechangemakersummaryComponent, ValuechangemakeraddComponent,
    ValuechangecheckersummaryComponent, ValuechangecheckeraddComponent,
    ValuechangecheckerapproveComponent, TransfermakersummaryComponent,
    TransfermakeraddComponent, TransfercheckersummaryComponent, TransfercheckerapproveComponent,
    SplimakerViewComponent, AssetCategoryEditComponent, AssetMakerSummaryComponent, AssetCheckerSummaryComponent,
    SplimakerViewComponent, AssetCategoryEditComponent, FaqueryComponent, AssetlocationComponent, AssetcatComponent,

    CategorychangeapproveComponent,CategorychangesummaryComponent,CategorychangesummaryaddComponent, MergeSummaryComponent, ImpairmentSummaryComponent, ImpairmentMappingComponent,


     CpdatechangeMakerSummaryComponent

    ,CategorychangesummaryComponent,CategorychangesummaryaddComponent,AssetsaleaddComponent, AssetsalesummaryComponent,AssetsalesapproveComponent
    ,AssetcatComponent,AssetclubsummaryComponent,
    AssetclubmakerComponent, AssestclubaprsummaryComponent,FaPvComponent,ApproverComponent,

    CategorychangeapproveComponent,CategorychangesummaryComponent,CategorychangesummaryaddComponent, CpdatechangeMakerSummaryComponent, CpDatechangeCheckerComponent, FaDepreciationCalComponent, BucketSummaryComponent, BucketSummaryViewComponent, FaReportComponent,
    FaFileuploadComponent
  ],
  imports: [
    ToastrModule.forRoot({ timeOut: 10000 }),
    FARoutingModule, SharedModule, MaterialModule,PdfViewerModule
  ],
  // providers: [TriggerService]
})
export class FAModule { }
