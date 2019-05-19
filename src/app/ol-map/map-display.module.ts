import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { FormsModule } from '@angular/forms';
import { MapDisplayComponent } from './map-display.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgJsonEditorModule],
  declarations: [MapDisplayComponent],
  exports: [MapDisplayComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class OlMapModule {}
