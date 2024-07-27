<template>
  <div>
    <h1>Покупки магазина</h1>
    <button @click="$router.back()">Назад</button>
    <table>
      <thead>
      <tr>
        <th>Дата</th>
        <th>Сумма</th>
        <th>Валюта</th>
        <th>Документ</th>
        <th>Действие</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="purchase in shopPurchases" :key="purchase.id">
        <td>{{ purchase.date }}</td>
        <td>{{ formatAmount(purchase.amount) }}</td>
        <td>{{ purchase.currency }}</td>
        <td>
          <a v-if="purchase.document_path" :href="getDocumentUrl(purchase.document_path)" target="_blank">Документ</a>
        </td>
        <td>
          <button @click="editPurchase(purchase)">Редактировать</button>
          <button @click="deletePurchase(purchase.id)">Удалить</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiClient from '../plugins/axios';

export default {
  data() {
    return {
      shopPurchases: [],
      selectedCurrency: 'all'
    };
  },
  mounted() {
    this.fetchShopPurchases();
  },
  methods: {
    fetchShopPurchases() {
      const shopId = this.$route.params.id;
      apiClient.get(`/shops/${shopId}`)
        .then(response => {
          this.shopPurchases = response.data.purchases;
        });
    },
    editPurchase(purchase) {
      // реализация редактирования покупки
    },
    deletePurchase(id) {
      apiClient.delete(`/api/purchases/${id}`)
        .then(() => {
          this.fetchShopPurchases();
        });
    },
    formatAmount(amount) {
      // форматирование суммы с учетом выбранной валюты
    },
    getDocumentUrl(path) {
      return `http://localhost:8000/storage/${path}`;
    }
  }
};
</script>
