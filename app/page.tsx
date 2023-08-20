"use client";

import { useState } from "react";
import { NumericFormat, numericFormatter } from "react-number-format";

type ProgressiveTax = {
  batasBawah: number;
  batasAtas: number;
  persentasePajak: number;
};

type PajakTerhitung = {
  besaranKenaPajak: number;
  pphTerutang: number;
};

const ptkpKategori = {
  "TK/0": {
    desc: "Tidak Kawin Tanpa Tanggungan",
    tarif: 54_000_000,
  },
  "TK/1": {
    desc: "Tidak Kawin 1 Tanggungan",
    tarif: 58_500_000,
  },
  "TK/2": {
    desc: "Tidak Kawin 2 Tanggungan",
    tarif: 63_000_000,
  },
  "TK/3": {
    desc: "Tidak Kawin 3 Tanggunan",
    tarif: 67_500_000,
  },
  "K/0": { tarif: 58_500_000, desc: "Kawin Tanpa Tanggungan" },
  "K/1": { tarif: 63_000_000, desc: "Kawin 1 Tanggungan" },
  "K/2": { tarif: 67_500_000, desc: "Kawin 2 Tanggungan" },
  "K/3": { tarif: 72_000_000, desc: "Kawin 3 Tanggungan" },
  "K/I/0": {
    tarif: 112_500_000,
    desc: "Kawin dan Istri Digabung, Tanpa Tanggungan",
  },
  "K/I/1": {
    tarif: 117_000_000,
    desc: "Kawin dan Istri Digabung, 1 Tanggungan",
  },
  "K/I/2": {
    tarif: 121_500_000,
    desc: "Kawin dan Istri Digabung, 2 Tanggungan",
  },
  "K/I/3": {
    tarif: 126_000_000,
    desc: "Kawin dan Istri Digabung, 3 Tanggungan",
  },
};

/**
 * Note: batasBawah is inclusive and batasAtas is exclusive.
 */
const progressiveTaxes: ProgressiveTax[] = [
  {
    batasBawah: 0,
    batasAtas: 60_000_000,
    persentasePajak: 0.05,
  },
  {
    batasBawah: 60_000_000,
    batasAtas: 250_000_000,
    persentasePajak: 0.15,
  },
  {
    batasBawah: 250_000_000,
    batasAtas: 500_000_000,
    persentasePajak: 0.25,
  },
  {
    batasBawah: 500_000_000,
    batasAtas: 5_000_000_000,
    persentasePajak: 0.3,
  },
  {
    batasBawah: 5_000_000_000,
    batasAtas: Infinity,
    persentasePajak: 0.35,
  },
];

function calculateProgressiveTax(pkp: number) {
  let newArr: Array<ProgressiveTax & PajakTerhitung> = [];
  for (let i = 0; i < progressiveTaxes.length; i++) {
    const cur = progressiveTaxes[i];

    if (pkp < cur.batasBawah) {
      newArr.push({
        ...cur,
        pphTerutang: 0,
        besaranKenaPajak: 0,
      });
    }
    if (pkp >= cur.batasAtas) {
      const besaranKenaPajak = cur.batasAtas - cur.batasBawah;
      newArr.push({
        ...cur,
        pphTerutang: besaranKenaPajak * cur.persentasePajak,
        besaranKenaPajak,
      });
    }

    if (pkp >= cur.batasBawah && pkp < cur.batasAtas) {
      const besaranKenaPajak = pkp - cur.batasBawah;
      newArr.push({
        ...cur,
        pphTerutang: besaranKenaPajak * cur.persentasePajak,
        besaranKenaPajak,
      });
    }
  }

  return newArr;
}

export default function Home() {
  const [bruto, setBruto] = useState<string>();
  const [ptkpKey, setPtkpKey] = useState<keyof typeof ptkpKategori>("TK/0");
  const penghasilanBrutoTahunan = Number(bruto ?? "0") * 12;
  const ptkp = ptkpKategori[ptkpKey].tarif;
  const pkp =
    penghasilanBrutoTahunan - ptkp < 0 ? 0 : penghasilanBrutoTahunan - ptkp;
  const calculatedProgressiveTaxes = calculateProgressiveTax(pkp);

  const pphTerutangPertahun = calculatedProgressiveTaxes.reduce(
    (a, c) => c.pphTerutang + a,
    0
  );
  const pphTerutangPerbulan = pphTerutangPertahun / 12;

  console.log({ calculatedProgressiveTaxes });
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <h1 className="text-xl mb-10">
        Pajakin: Aplikasi penghitung pajak gratis
      </h1>

      <div className="flex gap-3 items-center">
        <label className="text-slate-300">Gaji Bruto Bulanan</label>
        <NumericFormat
          placeholder="gaji bruto bulanan"
          className="bg-slate-800 py-1 px-2 rounded-lg disabled:bg-black"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={bruto}
          onValueChange={(e) => setBruto(e.value)}
        />
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-slate-300">Gaji Bruto Tahunan</label>
        <NumericFormat
          placeholder="gaji bruto bulanan"
          className="bg-slate-800 py-1 px-2 rounded-lg disabled:bg-black"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={penghasilanBrutoTahunan}
          readOnly
          disabled
        />
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-slate-300">PTKP</label>
        <select
          className="bg-slate-800 py-1 px-2 rounded-lg"
          onChange={(v) =>
            setPtkpKey(v.target.value as keyof typeof ptkpKategori)
          }
        >
          {Object.entries(ptkpKategori).map(([key, value]) => (
            <option key={key} value={key}>
              {value.desc}
            </option>
          ))}
        </select>
        <NumericFormat
          placeholder="gaji bruto bulanan"
          className="bg-slate-800 py-1 px-2 rounded-lg disabled:bg-black"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={ptkp}
          readOnly
          disabled
        />
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-slate-300">PKP</label>
        <NumericFormat
          placeholder="gaji bruto bulanan"
          className="bg-slate-800 py-1 px-2 rounded-lg disabled:bg-black"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={pkp}
          readOnly
          disabled
        />
      </div>

      <table className="border w-[900px]">
        <thead>
          <tr className="py-1 px-2 text-lg border-b-2 border-slate-400">
            <th className="tpy-1 px-2 text-left">Pajak Progresif</th>
            <th className="py-1 px-2">Percentage</th>
            <th className="py-1 px-2 text-right">Besaran Kena Pajak</th>
            <th className="py-1 px-2 text-right">PPh Terutang</th>
          </tr>
        </thead>
        <tbody>
          {calculatedProgressiveTaxes.map((calcProgTax, i) => {
            return (
              <tr key={i}>
                <td className="py-1 px-2">
                  Ceiling&nbsp;
                  {formatCurrency(calcProgTax.batasAtas)}
                </td>

                <td className="py-1 px-2 text-center">
                  {calcProgTax.persentasePajak * 100}%
                </td>
                <td className="py-1 px-2 text-right">
                  {formatCurrency(calcProgTax.besaranKenaPajak)}
                </td>
                <td className="py-1 px-2 text-right">
                  {formatCurrency(calcProgTax.pphTerutang)}
                </td>
              </tr>
            );
          })}
          <tr className="border-t-2 border-slate-400">
            <td colSpan={3} className="py-1 px-2">
              Pph Terutang per tahun
            </td>
            <td className="text-right py-1 px-2">
              {formatCurrency(pphTerutangPertahun)}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="py-1 px-2">
              PPh Terutang per bulan
            </td>
            <td className="text-right py-1 px-2">
              {formatCurrency(pphTerutangPerbulan)}
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

function formatCurrency(input: number | string) {
  input = input.toString();
  if (input === "0") {
    return "0";
  }
  return numericFormatter(input, {
    prefix: "Rp",
    thousandSeparator: ".",
    decimalSeparator: ",",
    decimalScale: 2,
  });
}
