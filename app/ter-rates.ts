/**
 * Tarif Efektif Rata-Rata (TER) Bulanan untuk PPh Pasal 21.
 * Berlaku sejak 1 Januari 2024 (PP No. 58 Tahun 2023, PMK No. 168 Tahun 2023).
 *
 * TER bulanan dipakai untuk Masa Pajak Januari–November. Pada Masa Pajak
 * terakhir (Desember) perhitungan tetap memakai tarif progresif Pasal 17.
 *
 * Setiap baris adalah { upTo, rate }, di mana `upTo` adalah batas atas
 * penghasilan bruto bulanan yang INKLUSIF untuk tarif tersebut. Sebuah
 * penghasilan X masuk ke baris pertama yang memenuhi X <= upTo.
 */

export type TerBracket = {
  upTo: number;
  rate: number;
};

export type TerCategory = 'A' | 'B' | 'C';

/** Kategori A: PTKP TK/0, TK/1, K/0. */
const terA: TerBracket[] = [
  { upTo: 5_400_000, rate: 0 },
  { upTo: 5_650_000, rate: 0.0025 },
  { upTo: 5_950_000, rate: 0.005 },
  { upTo: 6_300_000, rate: 0.0075 },
  { upTo: 6_750_000, rate: 0.01 },
  { upTo: 7_500_000, rate: 0.0125 },
  { upTo: 8_550_000, rate: 0.015 },
  { upTo: 9_650_000, rate: 0.0175 },
  { upTo: 10_050_000, rate: 0.02 },
  { upTo: 10_350_000, rate: 0.0225 },
  { upTo: 10_700_000, rate: 0.025 },
  { upTo: 11_050_000, rate: 0.03 },
  { upTo: 11_600_000, rate: 0.035 },
  { upTo: 12_500_000, rate: 0.04 },
  { upTo: 13_750_000, rate: 0.05 },
  { upTo: 15_100_000, rate: 0.06 },
  { upTo: 16_950_000, rate: 0.07 },
  { upTo: 19_750_000, rate: 0.08 },
  { upTo: 24_150_000, rate: 0.09 },
  { upTo: 26_450_000, rate: 0.1 },
  { upTo: 28_000_000, rate: 0.11 },
  { upTo: 30_050_000, rate: 0.12 },
  { upTo: 32_400_000, rate: 0.13 },
  { upTo: 35_400_000, rate: 0.14 },
  { upTo: 39_100_000, rate: 0.15 },
  { upTo: 43_850_000, rate: 0.16 },
  { upTo: 47_800_000, rate: 0.17 },
  { upTo: 51_400_000, rate: 0.18 },
  { upTo: 56_300_000, rate: 0.19 },
  { upTo: 62_200_000, rate: 0.2 },
  { upTo: 68_600_000, rate: 0.21 },
  { upTo: 77_500_000, rate: 0.22 },
  { upTo: 89_000_000, rate: 0.23 },
  { upTo: 103_000_000, rate: 0.24 },
  { upTo: 125_000_000, rate: 0.25 },
  { upTo: 157_000_000, rate: 0.26 },
  { upTo: 206_000_000, rate: 0.27 },
  { upTo: 337_000_000, rate: 0.28 },
  { upTo: 454_000_000, rate: 0.29 },
  { upTo: 550_000_000, rate: 0.3 },
  { upTo: 695_000_000, rate: 0.31 },
  { upTo: 910_000_000, rate: 0.32 },
  { upTo: 1_400_000_000, rate: 0.33 },
  { upTo: Infinity, rate: 0.34 },
];

/** Kategori B: PTKP TK/2, TK/3, K/1, K/2. */
const terB: TerBracket[] = [
  { upTo: 6_200_000, rate: 0 },
  { upTo: 6_500_000, rate: 0.0025 },
  { upTo: 6_850_000, rate: 0.005 },
  { upTo: 7_300_000, rate: 0.0075 },
  { upTo: 9_200_000, rate: 0.01 },
  { upTo: 10_750_000, rate: 0.015 },
  { upTo: 11_250_000, rate: 0.02 },
  { upTo: 11_600_000, rate: 0.025 },
  { upTo: 12_600_000, rate: 0.03 },
  { upTo: 13_600_000, rate: 0.04 },
  { upTo: 14_950_000, rate: 0.05 },
  { upTo: 16_400_000, rate: 0.06 },
  { upTo: 18_450_000, rate: 0.07 },
  { upTo: 21_850_000, rate: 0.08 },
  { upTo: 26_000_000, rate: 0.09 },
  { upTo: 27_700_000, rate: 0.1 },
  { upTo: 29_350_000, rate: 0.11 },
  { upTo: 31_450_000, rate: 0.12 },
  { upTo: 33_950_000, rate: 0.13 },
  { upTo: 37_100_000, rate: 0.14 },
  { upTo: 41_100_000, rate: 0.15 },
  { upTo: 45_800_000, rate: 0.16 },
  { upTo: 49_500_000, rate: 0.17 },
  { upTo: 53_800_000, rate: 0.18 },
  { upTo: 58_500_000, rate: 0.19 },
  { upTo: 64_000_000, rate: 0.2 },
  { upTo: 71_000_000, rate: 0.21 },
  { upTo: 80_000_000, rate: 0.22 },
  { upTo: 93_000_000, rate: 0.23 },
  { upTo: 109_000_000, rate: 0.24 },
  { upTo: 129_000_000, rate: 0.25 },
  { upTo: 163_000_000, rate: 0.26 },
  { upTo: 211_000_000, rate: 0.27 },
  { upTo: 374_000_000, rate: 0.28 },
  { upTo: 459_000_000, rate: 0.29 },
  { upTo: 555_000_000, rate: 0.3 },
  { upTo: 704_000_000, rate: 0.31 },
  { upTo: 957_000_000, rate: 0.32 },
  { upTo: 1_405_000_000, rate: 0.33 },
  { upTo: Infinity, rate: 0.34 },
];

/** Kategori C: PTKP K/3. */
const terC: TerBracket[] = [
  { upTo: 6_600_000, rate: 0 },
  { upTo: 6_950_000, rate: 0.0025 },
  { upTo: 7_350_000, rate: 0.005 },
  { upTo: 7_800_000, rate: 0.0075 },
  { upTo: 8_850_000, rate: 0.01 },
  { upTo: 9_800_000, rate: 0.0125 },
  { upTo: 10_950_000, rate: 0.015 },
  { upTo: 11_200_000, rate: 0.0175 },
  { upTo: 12_050_000, rate: 0.02 },
  { upTo: 12_950_000, rate: 0.03 },
  { upTo: 14_150_000, rate: 0.04 },
  { upTo: 15_550_000, rate: 0.05 },
  { upTo: 17_050_000, rate: 0.06 },
  { upTo: 19_500_000, rate: 0.07 },
  { upTo: 22_700_000, rate: 0.08 },
  { upTo: 26_600_000, rate: 0.09 },
  { upTo: 28_100_000, rate: 0.1 },
  { upTo: 30_100_000, rate: 0.11 },
  { upTo: 32_600_000, rate: 0.12 },
  { upTo: 35_400_000, rate: 0.13 },
  { upTo: 38_900_000, rate: 0.14 },
  { upTo: 43_000_000, rate: 0.15 },
  { upTo: 47_400_000, rate: 0.16 },
  { upTo: 51_200_000, rate: 0.17 },
  { upTo: 55_800_000, rate: 0.18 },
  { upTo: 60_400_000, rate: 0.19 },
  { upTo: 66_700_000, rate: 0.2 },
  { upTo: 74_500_000, rate: 0.21 },
  { upTo: 83_200_000, rate: 0.22 },
  { upTo: 95_600_000, rate: 0.23 },
  { upTo: 110_000_000, rate: 0.24 },
  { upTo: 134_000_000, rate: 0.25 },
  { upTo: 169_000_000, rate: 0.26 },
  { upTo: 221_000_000, rate: 0.27 },
  { upTo: 390_000_000, rate: 0.28 },
  { upTo: 463_000_000, rate: 0.29 },
  { upTo: 561_000_000, rate: 0.3 },
  { upTo: 709_000_000, rate: 0.31 },
  { upTo: 965_000_000, rate: 0.32 },
  { upTo: 1_419_000_000, rate: 0.33 },
  { upTo: Infinity, rate: 0.34 },
];

export const terTables: Record<TerCategory, TerBracket[]> = {
  A: terA,
  B: terB,
  C: terC,
};

/**
 * Status PTKP yang dipakai pada TER bulanan beserta pemetaan kategorinya.
 * Catatan: status penggabungan suami-istri (K/I/*) tidak dipakai pada TER
 * bulanan karena penggabungan penghasilan dihitung di tingkat tahunan.
 */
export const terPtkpKategori: Record<
  string,
  { desc: string; ptkp: number; category: TerCategory }
> = {
  'TK/0': {
    desc: 'Tidak Kawin Tanpa Tanggungan',
    ptkp: 54_000_000,
    category: 'A',
  },
  'TK/1': { desc: 'Tidak Kawin 1 Tanggungan', ptkp: 58_500_000, category: 'A' },
  'K/0': { desc: 'Kawin Tanpa Tanggungan', ptkp: 58_500_000, category: 'A' },
  'TK/2': { desc: 'Tidak Kawin 2 Tanggungan', ptkp: 63_000_000, category: 'B' },
  'TK/3': { desc: 'Tidak Kawin 3 Tanggungan', ptkp: 67_500_000, category: 'B' },
  'K/1': { desc: 'Kawin 1 Tanggungan', ptkp: 63_000_000, category: 'B' },
  'K/2': { desc: 'Kawin 2 Tanggungan', ptkp: 67_500_000, category: 'B' },
  'K/3': { desc: 'Kawin 3 Tanggungan', ptkp: 72_000_000, category: 'C' },
};

/**
 * Mencari tarif efektif untuk sebuah penghasilan bruto bulanan pada kategori
 * tertentu. Mengembalikan baris bracket yang berlaku.
 */
export function findTerBracket(
  category: TerCategory,
  monthlyGross: number,
): TerBracket {
  const table = terTables[category];
  return (
    table.find((bracket) => monthlyGross <= bracket.upTo) ??
    table[table.length - 1]
  );
}

/**
 * Metode gross up: mencari penghasilan bruto bulanan yang, setelah dipotong
 * PPh 21 dengan tarif efektifnya sendiri, menghasilkan take home pay sebesar
 * `monthlyNet`. Bruto = Netto / (1 - tarif), dengan tarif yang dipakai harus
 * konsisten dengan lapisan tempat bruto tersebut jatuh.
 *
 * Karena tarif naik seiring bruto, tiap lapisan saling menutupi (tidak ada
 * celah), sehingga selalu ada solusi. Bila ada lebih dari satu solusi, dipilih
 * bruto terkecil (tarif terendah).
 */
export function findTerGrossUp(
  category: TerCategory,
  monthlyNet: number,
): { bracket: TerBracket; gross: number } {
  const table = terTables[category];
  if (monthlyNet <= 0) {
    return { bracket: table[0], gross: 0 };
  }
  let lower = 0;
  for (const bracket of table) {
    const gross = monthlyNet / (1 - bracket.rate);
    if (gross > lower && gross <= bracket.upTo) {
      return { bracket, gross };
    }
    lower = bracket.upTo;
  }
  const last = table[table.length - 1];
  return { bracket: last, gross: monthlyNet / (1 - last.rate) };
}
