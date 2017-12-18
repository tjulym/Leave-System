import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaginationBarComponent } from './pagination-bar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        PaginationBarComponent
    ],
    //这里记得添加PublicComponent组件，不然在其他地方将不能使用PublicComponent
    exports: [
        PaginationBarComponent
    ],
    providers: [],
})
export class PaginationBarModule { }