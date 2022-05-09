<template>
  <div id="app">
    <CreditCard ref="creditcard" :data="cardData" :size="size" />
    <button @click="flip">Flip</button>
    <button @click="valid">Valid</button>
    <div>
      <input type="text" v-model="cardData.number" placeholder="Number" />
      <input type="text" v-model="cardData.name" placeholder="Name">
      <input type="text" v-model="cardData.month" placeholder="Mes">
      <input type="text" v-model="cardData.year" placeholder="Ano">
      <input type="text" v-model="cardData.cvv" placeholder="CVV">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import CreditCard, { CardData } from "@/credit-card.vue";

const creditcard = ref<InstanceType<typeof CreditCard>>();

const cardData = reactive<CardData>({
});

const size = ref<number>(1);

function flip() {
  creditcard.value?.flip();
}

function valid() {
  const validate = creditcard.value?.valid()

  console.log(validate)
}
</script>
