<template>
  <div class="container">
    <div class="card" :class="{ fliped }">
      <div class="front">
        <div class="background" :class="{ active: !!creditCardInfo }"></div>
        <div class="content">
          <div class="top">
            <img class="chip" src="@/assets/images/chip.png" alt="Chip image" />
            <img v-if="logo != ''" class="logo" :src="logo" alt="Logo image" />
          </div>
          <div class="middle">
            <div class="number">
              <span>{{ cardApresentention }}</span>
            </div>
          </div>
          <div class="bottom">
            <div class="name">
              <p class="placeholder">{{ props.labels.name }}</p>
              <p class="data">{{ !!props.data?.name ? props.data?.name : props.placeholders.name }}</p>
            </div>
            <div class="date">
              <p class="placeholder">{{ props.labels.expires }}</p>
              <p class="data">{{ expirationApresentention.month }}/{{ expirationApresentention.year }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="back">
        <div class="background" :class="{ active: !!creditCardInfo }"></div>
        <div class="content">
          <div class="magnetic"></div>
          <div class="middle">
            <div class="code">
              <p class="placeholder">{{ codeTypeApresentention }}</p>
              <p class="data">{{ codeApresentention }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "@vue/reactivity";
import { ref, watch } from "vue";
import getCardType from 'credit-card-type';
import { CreditCardType } from 'credit-card-type/src/types';
import { cardMask, prettyCardNumber } from "./card-formater";
import cardValidator from 'card-validator';
import cardColor from './card-color';

export interface CardData {
  number?: string;
  name?: string;
  month?: string;
  year?: string;
  cvv?: string
}

export interface CardPlaceholders {
  year?: string;
  month?: string;
  name?: string;
}

export interface CardLabels {
  name?: string;
  expires?: string;
}

const props = withDefaults(
  defineProps<{
    data?: CardData;
    size?: number;
    placeholders?: CardPlaceholders;
    labels?: CardLabels;
  }>(),
  {
    size: 1,
    placeholders: () => {
      return {
        month: "MM",
        year: "YY",
        name: "FULL NAME",
      }
    },
    labels: () => {
      return {
        name: "Card Holder",
        expires: "Expires",
      }
    }
  }
);

const emits = defineEmits<{
  (e: 'type', type: string): void,
  (e: 'mask', mask: string): void,
}>();

const fliped = ref(false);
const creditCardInfo = ref<CreditCardType | undefined>(undefined);
const cardApresentention = ref("#### #### #### ####");
const expirationApresentention = reactive<{
  month: string,
  year: string
}>({
  month: props.placeholders.month ?? "MM",
  year: props.placeholders.year ?? "YY"
})
const codeApresentention = ref<string | undefined>(undefined);
const codeTypeApresentention = ref("CVV");
const color = ref("#8f8f8f");
const logo = ref("");

watch(() => props.data?.number, async (number) => {
  if (number) {
    const cardInfo = getCardType(number)

    if (cardInfo.length == 1) {
      creditCardInfo.value = cardInfo[0]
      emits('type', creditCardInfo.value.type)
      emits('mask', cardMask(creditCardInfo.value.type))
      cardApresentention.value = prettyCardNumber(props.data?.number as string, creditCardInfo.value?.type)
      codeTypeApresentention.value = creditCardInfo.value.code.name
      color.value = cardColor[creditCardInfo.value.type]
      logo.value = (await import(`@/assets/images/types/${creditCardInfo.value.type}.png`)).default
      return
    }

    cardApresentention.value = prettyCardNumber(props.data?.number as string, "")
    codeTypeApresentention.value = "CVV"
    logo.value = ""
    creditCardInfo.value = undefined
  } else {
    codeTypeApresentention.value = "CVV"
    logo.value = ""
    cardApresentention.value = "#### #### #### ####"
    creditCardInfo.value = undefined
  }
})

watch(() => props.data?.month, (month) => {
  if (month && month != "") {
    const result = cardValidator.expirationMonth(month)

    if (result.isValid) {
      expirationApresentention.month = month.padStart(2, "0")
    } else {
      expirationApresentention.month = props.placeholders.month ?? "MM"
    }
  } else {
    expirationApresentention.month = props.placeholders.month ?? "MM"
  }
})

watch(() => props.data?.year, (year) => {
  if (year && year != "") {
    expirationApresentention.year = year.substring(0, 4)
  } else {
    expirationApresentention.year = props.placeholders.year ?? "YY"
  }
})

watch(() => props.data?.cvv, (cvv) => {
  codeApresentention.value = cvv?.substring(0, creditCardInfo.value?.code.size ?? 3)
})

const getSize = computed(() => {
  return `${props.size * 20}px`;
});

function flip() {
  fliped.value = !fliped.value;
}

function valid() {
  const resultNumber = cardValidator.number(props.data?.number)
  const resultCode = cardValidator.cvv(props.data?.cvv, creditCardInfo.value?.code.size)
  const resultDate = cardValidator.expirationDate({
    month: props.data?.month,
    year: props.data?.year
  })

  return resultNumber.isValid && resultCode.isValid && resultDate.isValid
}

defineExpose({
  flip,
  valid
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');

.container {
  --base-size: v-bind(getSize);
}

.container * {
  letter-spacing: 0;
  color: white;
  font-family: "Source Code Pro", monospace;
  margin: 0;
  padding: 0;
}

.card {
  width: calc(var(--base-size) * 16);
  height: calc(var(--base-size) * 10);
  position: relative;
  transition: transform 0.8s;
  transition-property: transform;
  transform-style: preserve-3d;
}

.card.fliped {
  transform: rotateY(180deg);
}

.back,
.front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: calc(var(--base-size) * 0.75);
  overflow: hidden;
  z-index: -2;
  background-color: #8f8f8f;
}

.back {
  transform: rotateY(180deg);
}

.background {
  background-color: v-bind(color);
  width: calc(var(--base-size) * 32);
  height: calc(var(--base-size) * 20);
  position: absolute;
  z-index: -1;
  transform: rotate(20deg);
  top: calc(var(--base-size) * -8);
  left: calc(var(--base-size) * -34);
  transition: left 1s;
  transition-property: left;
}

.background.active {
  left: calc(var(--base-size) * -10);
}

.front .content {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--base-size) * 0.6);
  box-sizing: border-box;
  z-index: 10;
}

.front .top,
.front .bottom {
  display: flex;
  justify-content: space-between;
}

.chip,
.logo {
  height: calc(var(--base-size) * 2);
}

.placeholder {
  font-size: calc(var(--base-size) * 0.55);
}

.name .data {
  text-transform: uppercase;
  font-family: "Source Code Pro", monospace;
}

.data {
  font-size: calc(var(--base-size) * 0.8);
  font-family: "Source Code Pro", monospace;
}

.number {
  width: 100%;
  font-size: calc(var(--base-size) * 1.29);
  font-family: "Source Code Pro", monospace;
}

.magnetic {
  background-color: #212121;
  width: 100%;
  height: calc(var(--base-size) * 2);
  margin-top: calc(var(--base-size) * 1);
}

.code {
  color: black;
  background-color: #ebebeb;
  width: 100%;
  height: calc(var(--base-size) * 1);
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 calc(var(--base-size) * 0.6);
  box-sizing: border-box;
}

.code .data {
  width: calc(var(--base-size) * 2);
  padding-left: calc(var(--base-size) * 0.5);
  font-family: "Source Code Pro", monospace;
}
</style>
