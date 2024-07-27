<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Список покупок</h1>
    <div class="flex space-x-2 mb-4">
      <button @click="showAddModal = true" class="bg-blue-500 text-white px-4 py-2 rounded">Добавить покупку</button>
      <button @click="showAddShopModal = true" class="bg-green-500 text-white px-4 py-2 rounded">Добавить магазин</button>
    </div>
    <div class="mb-4">
      <label class="mr-2">Переключатель валют:</label>
      <select v-model="selectedCurrency" @change="convertCurrency" class="border rounded px-2 py-1">
        <option value="all">All</option>
        <option v-for="rate in currencyRates" :value="rate.currency">{{ rate.currency }}</option>
      </select>
    </div>
    <table class="min-w-full bg-white">
      <thead class="bg-gray-800 text-white">
      <tr>
        <th class="w-1/4 py-2">Магазин</th>
        <th class="w-1/4 py-2">Дата</th>
        <th class="w-1/4 py-2">Сумма</th>
        <th class="w-1/4 py-2">Валюта</th>
        <th class="w-1/4 py-2">Документ</th>
        <th class="w-1/4 py-2">Действие</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="purchase in purchases" :key="purchase.id" class="bg-gray-100 border-b">
        <td @click="viewShopPurchases(purchase.shop ? purchase.shop.id : '')" class="py-2 px-4 cursor-pointer">
          {{ purchase.shop ? purchase.shop.name : 'Магазин не указан' }}
        </td>
        <td class="py-2 px-4">{{ purchase.date }}</td>
        <td class="py-2 px-4">{{ formatAmount(purchase.amount) }}</td>
        <td class="py-2 px-4">{{ purchase.currency }}</td>
        <td class="py-2 px-4">
          <a v-if="purchase.document_path" :href="getDocumentUrl(purchase.document_path)" target="_blank" class="text-blue-500 underline">Документ</a>
        </td>
        <td class="py-2 px-4">
          <button @click="editPurchase(purchase)" class="bg-yellow-500 text-white px-4 py-2 rounded">Редактировать</button>
          <button @click="deletePurchase(purchase.id)" class="bg-red-500 text-white px-4 py-2 rounded">Удалить</button>
        </td>
      </tr>
      </tbody>
    </table>
    <AddPurchaseModal v-if="showAddModal" @close="showAddModal = false" @save="fetchPurchases"/>
    <AddShopModal v-if="showAddShopModal" @close="showAddShopModal = false" @save="fetchShops"/>
  </div>
</template>

<script>
import AddPurchaseModal from './AddPurchaseModal.vue';
import AddShopModal from './AddShopModal.vue';
import apiClient from '../plugins/axios';

export default {
  components: { AddPurchaseModal, AddShopModal },
  data() {
    return {
      purchases: [],
      shops: [],
      currencyRates: [],
      selectedCurrency: 'all',
      showAddModal: false,
      showAddShopModal: false
    };
  },
  mounted() {
    this.fetchPurchases();
    this.fetchShops();
    this.fetchCurrencyRates();
  },
  methods: {
    fetchPurchases() {
      apiClient.get('/purchases')
        .then(response => {
          this.purchases = response.data;
        });
    },
    fetchShops() {
      apiClient.get('/shops')
        .then(response => {
          this.shops = response.data;
        });
    },
    fetchCurrencyRates() {
      apiClient.get('/currency-rates')
        .then(response => {
          this.currencyRates = response.data;
        });
    },
    addPurchase() {
      this.showAddModal = true;
    },
    editPurchase(purchase) {
      // реализация редактирования покупки
    },
    deletePurchase(id) {
      apiClient.delete(`/purchases/${id}`)
        .then(() => {
          this.fetchPurchases();
        });
    },
    convertCurrency() {
      if (this.selectedCurrency === 'all') {
        this.fetchPurchases();
      } else {
        const rate = this.currencyRates.find(rate => rate.currency === this.selectedCurrency).rate;
        this.purchases = this.purchases.map(purchase => {
          return {
            ...purchase,
            amount: (purchase.amount * rate).toFixed(2)
          };
        });
      }
    },
    formatAmount(amount) {
      return amount;
    },
    getDocumentUrl(path) {
      return `http://localhost:8001/storage/${path}`;
    },
    viewShopPurchases(shopId) {
      if (shopId) {
        this.$router.push(`/shops/${shopId}`);
      }
    }
  }
};
</script>
