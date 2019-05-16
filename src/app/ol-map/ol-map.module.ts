import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { FormsModule } from '@angular/forms';
import { OlMapComponent } from './ol-map.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgJsonEditorModule],
  declarations: [OlMapComponent],
  exports: [OlMapComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class OlMapModule {}
