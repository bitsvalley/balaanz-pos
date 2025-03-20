import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collectionRoutingModule } from './collection-routing.modele';
import { CollectionComponent } from './collection.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CollectionComponent],
  imports: [
    CommonModule,
    IonicModule,       
    FormsModule,
    collectionRoutingModule
  ]
})
export class CollectionModule { }
