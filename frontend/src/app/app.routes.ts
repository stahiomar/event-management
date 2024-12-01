import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AddProductComponent} from "./pages/add-product/add-product.component";
import {CreateEventComponent} from "./pages/create-event/create-event.component";

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'add-product', component: AddProductComponent},
  {path: 'create-event', component: CreateEventComponent}
];
