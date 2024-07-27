import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import Purchases from '../components/Purchases.vue';
import ShopPurchases from '../components/ShopPurchases.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Purchases },
    { path: '/shops/:id', component: ShopPurchases }
  ]
})

export default router
