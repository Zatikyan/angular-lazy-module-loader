import { Component, OnInit, Input, NgModuleRef, ViewContainerRef, Injector, Compiler, NgModuleFactory, EventEmitter, Output, ComponentRef } from '@angular/core';
import { LazyModuleLoaderEvent } from '../../models/lazy-module-loader-event';
import { Observable } from 'rxjs';

@Component({
  selector: 'lazy-module-loader',
  template: ''
})
export class LazyModuleLoaderComponent implements OnInit {

  @Input() lazyModuleLoader: Observable<Promise<any>>;
  @Input() lazyModuleName: string;
  @Input() dataSource: object;

  @Output() onEvent: EventEmitter<LazyModuleLoaderEvent> = new EventEmitter<LazyModuleLoaderEvent>();

  constructor(
    private vcr: ViewContainerRef,
    private injector: Injector,
    private compiler: Compiler
  ) { }

  ngOnInit() {
    if (this.lazyModuleLoader) {
      this.lazyModuleLoader.subscribe(
        (moduleLoaderPromise: Promise<any>): void => {
          this.loadModule(moduleLoaderPromise);
        }
      );
    }
  }

  private loadModule(moduleLoaderPromise: Promise<any>): void {
    moduleLoaderPromise.then(
      (lazyModule: any): void => {
        const loadedModule = lazyModule[this.lazyModuleName];
        this.compileLazyModule(loadedModule);
      });
  }

  private compileLazyModule(lazyModule: any): void {
    this.compiler.compileModuleAsync(lazyModule).then(
      (ngModuleFactory: NgModuleFactory<any>): void => {
        const moduleRef = ngModuleFactory.create(this.injector);
        this.createComponent(moduleRef, lazyModule);
      });
  }

  private createComponent(moduleRef: NgModuleRef<any>, lazyModule: any): void {
    const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(lazyModule.rootComponent);
    const component = this.vcr.createComponent(factory);
    const properties = lazyModule.rootComponent.__prop__metadata__;
    const [inputs, outputs] = this.getInputAndOutputMembers(properties);
    this.bindDataToInputMembers(inputs, component);
    this.subscribeToOutputEvents(outputs, component);
  }

  private subscribeToOutputEvents(events: string[], component: ComponentRef<any>): void {
    events.forEach((event: string): void => {
      component.instance[event].subscribe((value: any): void => {
        this.onEvent.next({
          name: event,
          data: value
        });
      });
    });
  }

  private bindDataToInputMembers(members: string[], component: ComponentRef<any>): void {
    members.forEach((member: string): void => {
      component.instance[member] = this.dataSource[member];
    });
  }

  private getInputAndOutputMembers(properties: any[][]): [string[], string[]] {
    return [
      Object.keys(properties).filter((propertyName: string): boolean => {
        return properties[propertyName][0].ngMetadataName === 'Input';
      }),
      Object.keys(properties).filter((propertyName: string): boolean => {
        return properties[propertyName][0].ngMetadataName === 'Output';
      })
    ];
  }
}
