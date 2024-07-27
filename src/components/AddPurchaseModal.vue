<template>
  <div class="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white p-4 rounded shadow-lg relative">
      <span class="close absolute top-2 right-2 cursor-pointer" @click="$emit('close')">&times;</span>
      <h2 class="text-xl font-bold mb-4">Добавить покупку</h2>
      <form @submit.prevent="savePurchase" class="space-y-4">
        <div>
          <label class="block">Магазин:</label>
          <select v-model="form.shop_id" class="border rounded w-full px-2 py-1">
            <option v-for="shop in shops" :value="shop.id">{{ shop.name }}</option>
          </select>
        </div>
        <div>
          <label class="block">Дата:</label>
          <input type="date" v-model="form.date" class="border rounded w-full px-2 py-1">
        </div>
        <div>
          <label class="block">Сумма:</label>
          <input type="number" v-model="form.amount" class="border rounded w-full px-2 py-1">
        </div>
        <div>
          <label class="block">Валюта:</label>
          <select v-model="form.currency" class="border rounded w-full px-2 py-1">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <!-- добавить другие валюты -->
          </select>
        </div>
        <div>
          <label class="block">Документ:</label>
          <input type="file" @change="handleFileUpload" class="border rounded w-full px-2 py-1">
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">Отменить</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Сохранить</button>
        </div>
        <div v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from '../plugins/axios';

export default {
  data() {
    return {
      form: {
        shop_id: '',
        date: '',
        amount: '',
        currency: 'USD',
        document_path: null
      },
      shops: [],
      errorMessage: ''
    };
  },
  mounted() {
    this.fetchShops();
  },
  methods: {
    fetchShops() {
      apiClient.get('/shops')
        .then(response => {
          this.shops = response.data;
        });
    },
    handleFileUpload(event) {
      this.form.document_path = event.target.files[0];
    },
    savePurchase() {
      const formData = new FormData();
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }
      apiClient.post('/purchases', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          this.$emit('save');
          this.$emit('close');
        })
        .catch(error => {
          this.errorMessage = error.response.data.message || 'Произошла ошибка';
        });
    }
  }
};
</script>
