# angular-lazy-module-loader

This Angular module generated using **@angular/cli** version 8.2.14.  
Lazy module loader component uses for lazy loading of the modules without routing.

## Installation

Copy the following command to your command line or terminal to install the package.

```bash
npm install --save angular-lazy-module-loader
```

Import library to your application:

```typescript
import { NgModule } from '@angular/core';
import { LazyModuleLoaderModule } from 'angular-lazy-module-loader';

@NgModule({
    imports: [LazyModuleLoaderModule]
})
export class AppModule {}
```

## Usage

Example of the usage.  

HTML code

```html
<lazy-module-loader
    [lazyModuleLoader]="getLazyModuleLoader()"
    [lazyModuleName]="lazyModuleName"
    [dataSource]="dataSource"
    (onEvent)="onEvent($event)">
</lazy-module-loader>
```

Typescript code

```typescript
import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Component({
  ...
})
export class AppComponent {

    dataSource = {
        dataOne: 'Some Text',
        datTwo: 100
    }

    onEvent(event: LazyModuleLoaderEvent): void {
      // Will emit the object which will contain the name of the emitted event and the data which was emitted 
    }

    lazyModuleName = 'ExampleModule';

    getLazyModuleLoader(): Observable<Promise<any>> {
        return new Observable((observer: Observer<Promise<any>>): void => {
            observer.next(
                import('./modules/example/example.module')
            );
            observer.complete();
        });
    }
}
```

> Note: each module must have static "rootComponent" member for lazy loading with "Lazy Module Loader".  

Code example inside "example.module.ts"

```typescript
import { NgModule } from '@angular/core';
import { ExampleComponent } from './components/example/example.component';

@NgModule({
    declarations: [ExampleComponent],
    entryComponents: [ExampleComponent]
})
export class ExampleModule {
    static rootCoomponent = ExampleComponent;
}
```

Code example inside "example.component.ts"

```typescript
import { Component, Input, EventEmitter } from '@angular/core';

@Component({
    ...
})
export class ExampleComponent {
    @Input() dataOne: string;
    @Input() dataTwo: number;

    @Output() someEvent: EventEmitter<any> = new EventEmitter<any>();
}
```

## Features of usage

**Systemjs.import()** syntax is deprecated since webpack v2 due to noncompliance with web standards. In webpack v2 it's replaced with **import()** syntax, which avoids dynamic imports using variables as paths to the modules. So needs to provide a static path to the module to let webpack to generate metadata for the module at the compile time.  
  
The main issue of the **import()** syntax is that it starts importing the module when the compiler reads the line it is written in. So in this case, we use function syntax to avoid it's importing until the function will be called, and put it inside Observable to avoid circular importing.
