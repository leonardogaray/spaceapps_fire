import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapReportPage } from './map-report.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MapReportPageRoutingModule } from './map-report-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MapReportPageRoutingModule
  ],
  declarations: [MapReportPage]
})
export class MapReportPageModule {}
