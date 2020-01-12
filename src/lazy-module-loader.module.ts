import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyModuleLoaderComponent } from './components/lazy-module-loader/lazy-module-loader.component';

@NgModule({
  declarations: [LazyModuleLoaderComponent],
  imports: [
    CommonModule
  ],
  exports: [LazyModuleLoaderComponent]
})
export class LazyModuleLoaderModule { }