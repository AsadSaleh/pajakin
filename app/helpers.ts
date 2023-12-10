function* infinite() {
  let index = 0;

  while (true) {
    yield index++;
  }
}

const generator = infinite(); // "Generator { }"

export const numberGen = () => {
  return generator.next().value ?? 0;
};

const currencyFormat = Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function currencyFmt(input: number) {
  return currencyFormat.format(input);
}

const numberFormat = Intl.NumberFormat("id-ID");

export function numberFmt(input: number) {
  return numberFormat.format(input);
}
