import { getTypeInfo } from "credit-card-type";

export function prettyCardNumber(cardNumber: string, cardType: string) {
  const card = getTypeInfo(cardType);

  if (card) {
    const offsets = [0, ...card.gaps, card.lengths[card.lengths.length - 1]]
    const components: string[] = [];

    for (let i = 0; offsets[i] < card.lengths[card.lengths.length - 1]; i++) {
      const start = offsets[i];
      const end = Math.min(offsets[i + 1], cardNumber.length);
      components.push(cardNumber.substring(start, end));
    }

    return components.join(" ");
  } else {
    const offsets = [0, 4, 8, 12, 16]
    const components: string[] = [];

    for (let i = 0; offsets[i] < 16; i++) {
      const start = offsets[i];
      const end = Math.min(offsets[i + 1], cardNumber.length);
      components.push(cardNumber.substring(start, end));
    }

    return components.join(" ");
  }
}

export function cardMask(cardType: string) {
  const cardNumber = "####################"

  const card = getTypeInfo(cardType);

  if (card) {
    const offsets = [0, ...card.gaps, card.lengths[card.lengths.length - 1]]
    const components: string[] = [];

    for (let i = 0; offsets[i] < card.lengths[card.lengths.length - 1]; i++) {
      const start = offsets[i];
      const end = Math.min(offsets[i + 1], cardNumber.length);
      components.push(cardNumber.substring(start, end));
    }

    return components.join(" ");
  } else {
    const offsets = [0, 4, 8, 12, 16]
    const components: string[] = [];

    for (let i = 0; offsets[i] < 16; i++) {
      const start = offsets[i];
      const end = Math.min(offsets[i + 1], cardNumber.length);
      components.push(cardNumber.substring(start, end));
    }

    return components.join(" ");
  }
}