import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxComponent } from './mapbox.component';
import { MapboxService } from './mapbox.service';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, NgJsonEditorModule],
  declarations: [MapboxComponent],
  exports: [MapboxComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [MapboxService],
})
export class MapboxModule {}
