<template>
  <div class="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white p-4 rounded shadow-lg relative">
      <span class="close absolute top-2 right-2 cursor-pointer" @click="$emit('close')">&times;</span>
      <h2 class="text-xl font-bold mb-4">Добавить магазин</h2>
      <form @submit.prevent="saveShop" class="space-y-4">
        <div>
          <label class="block">Название магазина:</label>
          <input type="text" v-model="form.name" class="border rounded w-full px-2 py-1" required>
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
        name: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    saveShop() {
      apiClient.post('/shops', this.form)
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
