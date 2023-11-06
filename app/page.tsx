"use client";

import { useState } from "react";
import { NumericFormat, numericFormatter } from "react-number-format";

type ProgressiveTax = {
  batasBawah: number;
  batasAtas: number;
  persentasePajak: number;
  label: string;
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
    label: "0 - Rp60juta",
  },
  {
    batasBawah: 60_000_000,
    batasAtas: 250_000_000,
    persentasePajak: 0.15,
    label: "Rp60juta - Rp250juta",
  },
  {
    batasBawah: 250_000_000,
    batasAtas: 500_000_000,
    persentasePajak: 0.25,
    label: "250juta - Rp500juta",
  },
  {
    batasBawah: 500_000_000,
    batasAtas: 5_000_000_000,
    persentasePajak: 0.3,
    label: "500juta - Rp5M",
  },
  {
    batasBawah: 5_000_000_000,
    batasAtas: Infinity,
    persentasePajak: 0.35,
    label: "> Rp5M",
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
  const biayaJabatan = Math.min(6_000_000, penghasilanBrutoTahunan * 0.05);
  const ptkp = ptkpKategori[ptkpKey].tarif;
  const pkp = Math.max(penghasilanBrutoTahunan - ptkp - biayaJabatan, 0);
  const calculatedProgressiveTaxes = calculateProgressiveTax(pkp);

  const pphTerutangPertahun = calculatedProgressiveTaxes.reduce(
    (a, c) => c.pphTerutang + a,
    0
  );
  const pphTerutangPerbulan = pphTerutangPertahun / 12;

  return (
    <main className="flex min-h-screen w-screen flex-col items-start gap-4 p-2 pb-10 lg:p-24">
      <div className="mb-4 mx-auto">
        <h1 className="text-2xl text-center">
          Pajakin: Your free to use, accurate, tax calculator
        </h1>
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="dark:text-slate-300">Gaji Bruto (per bulan)</label>
        <NumericFormat
          className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-black"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={bruto}
          onValueChange={(e) => setBruto(e.value)}
        />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="dark:text-slate-300">Gaji Bruto (per tahun)</label>
        <NumericFormat
          placeholder="gaji bruto bulanan"
          className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-slate-900 disabled:bg-slate-300"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={penghasilanBrutoTahunan}
          readOnly
          disabled
        />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="dark:text-slate-300">Golongan</label>
        <select
          className="dark:bg-slate-800 py-1 px-2 rounded-lg w-full"
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
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="dark:text-slate-300">Biaya Jabatan (per tahun)</label>
        <NumericFormat
          className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-slate-900 disabled:bg-slate-300"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={biayaJabatan}
          readOnly
          disabled
        />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="dark:text-slate-300">PTKP</label>
        <NumericFormat
          placeholder="gaji bruto bulanan"
          className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-slate-900 disabled:bg-slate-300"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={ptkp}
          readOnly
          disabled
        />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="dark:text-slate-300">PKP setahun</label>
        <NumericFormat
          placeholder="gaji bruto bulanan"
          className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-slate-900 disabled:bg-slate-300"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          value={pkp}
          readOnly
          disabled
        />
      </div>

      <div className="mb-4" />

      {/* TABEL */}
      <div className="w-full overflow-scroll">
        <table className="w-[600px] md:w-full border-collapse border border-slate-500">
          <thead>
            <tr className="py-1 px-2 text-lg border-b-2 border-slate-400">
              <th className="tpy-1 px-2 text-left border border-slate-600">
                Pajak Progresif
              </th>
              <th className="py-1 px-2 border border-slate-600">Percentage</th>
              <th className="py-1 px-2 text-right border border-slate-600">
                Besaran Kena Pajak
              </th>
              <th className="py-1 px-2 text-right border border-slate-600">
                PPh Terutang
              </th>
            </tr>
          </thead>
          <tbody>
            {calculatedProgressiveTaxes.map((calcProgTax, i) => {
              return (
                <tr key={i}>
                  <td className="py-1 px-2 border border-slate-600">
                    {calcProgTax.label}
                  </td>

                  <td className="py-1 px-2 text-center border border-slate-600">
                    {calcProgTax.persentasePajak * 100}%
                  </td>
                  <td className="py-1 px-2 text-right border border-slate-600">
                    {formatCurrency(calcProgTax.besaranKenaPajak)}
                  </td>
                  <td className="py-1 px-2 text-right border border-slate-600">
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
      </div>

      {bruto && (
        <div className="mt-4">
          <div>Sehingga gaji bersih (netto) kamu per bulan sebesar: </div>
          <div className="text-xl my-1">
            {formatCurrency(Number(bruto) - pphTerutangPerbulan)}
          </div>
          {pphTerutangPerbulan !== 0 && (
            <div className="dark:text-slate-400 text-slate-600">
              ({formatCurrency(Number(bruto))} -{" "}
              {formatCurrency(pphTerutangPerbulan)})
            </div>
          )}
        </div>
      )}
      <p className="text-xs fixed right-2 bottom-2 bg-black px-2 py-1 rounded-lg">
        By{" "}
        <a
          href="https://twitter.com/asaduala"
          className="hover:bg-slate-200 p-1 rounded-md dark:hover:bg-slate-800"
        >
          As&apos;ad Ghanim
        </a>
      </p>
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
