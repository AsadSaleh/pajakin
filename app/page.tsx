"use client";

import { useState } from "react";
import { NumericFormat, numericFormatter } from "react-number-format";
import { numberGen } from "./helpers";

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

type Income = {
  id: number;
  amount: number;
  desc?: string;
  occurence: string;
};

export default function Home() {
  const [modalState, setModalState] = useState<"closed" | "open">("closed");
  const [incomes, setIncomes] = useState<Income[]>([
    { id: numberGen(), amount: 0, occurence: "1" },
  ]);

  function addNewIncomeRow() {
    setIncomes((prev) =>
      prev.concat({ id: numberGen(), amount: 0, occurence: "1" })
    );
  }

  const [ptkpKey, setPtkpKey] = useState<keyof typeof ptkpKategori>("TK/0");

  // const penghasilanBrutoTahunan = Number(bruto ?? "0") * 12;
  const penghasilanBrutoTahunan = incomes.reduce(
    (acc, cur) => acc + cur.amount * Number(cur.occurence),
    0
  );
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
    <main className="">
      {/* Modal start */}
      <div
        className={`fixed bg-slate-700 z-10 h-screen top-0 right-0 p-4 w-screen md:w-[500px] lg:w-[700px] transition ease-in-out duration-300 ${
          modalState === "open"
            ? "translate-x-0"
            : "translate-x-full md:translate-x-[500px] lg:translate-x-[700px]"
        }`}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-2xl">Input Penghasilan</h4>
          <button
            type="button"
            onClick={() => setModalState("closed")}
            className="bg-slate-800 rounded-md active:scale-90 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <div className="w-full overflow-scroll">
            <table className="border border-collapse border-slate-500 w-full">
              <thead>
                <tr>
                  <th className="border border-slate-600 rounded-tl-md">
                    Nominal
                  </th>
                  <th className="border border-slate-600">Pengali</th>
                  <th className="border border-slate-600">Keterangan</th>
                  <th className="border border-slate-600">Subtotal</th>
                  <th className="border border-slate-600"></th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id}>
                    <td className="border border-slate-600 p-1">
                      <NumericFormat
                        className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-black text-right w-40"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp"
                        value={income.amount}
                        onValueChange={(e) =>
                          setIncomes((prev) =>
                            prev.map((prevIncome) =>
                              prevIncome.id === income.id
                                ? { ...prevIncome, amount: e.floatValue ?? 0 }
                                : prevIncome
                            )
                          )
                        }
                      />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <input
                        className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-black w-20"
                        value={income.occurence}
                        onChange={(e) => {
                          setIncomes((prev) =>
                            prev.map((prevIncome) =>
                              prevIncome.id === income.id
                                ? {
                                    ...prevIncome,
                                    occurence: e.target.value,
                                  }
                                : prevIncome
                            )
                          );
                        }}
                      />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <input
                        className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-black w-24"
                        value={income.desc}
                        onChange={() => {}}
                      />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <NumericFormat
                        className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-slate-900 disabled:bg-slate-300 text-right"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp"
                        value={income.amount * Number(income.occurence)}
                        readOnly
                        disabled
                      />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <button
                        className="text-sm text-red-400 text-center px-1 active:scale-90 transition"
                        onClick={() =>
                          setIncomes((prev) => {
                            if (prev.length === 1) {
                              return [
                                { id: numberGen(), amount: 0, occurence: "1" },
                              ];
                            }
                            return prev.filter(
                              (prevIncome) => prevIncome.id !== income.id
                            );
                          })
                        }
                      >
                        hapus
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="px-1">
                    <button
                      type="button"
                      onClick={addNewIncomeRow}
                      className="bg-slate-800 text-slate-400 hover:text-white italic text-sm hover:bg-opacity-70 rounded-md active:scale-95 transition w-full"
                    >
                      Baris Baru +
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right">
                    Total
                  </td>
                  <td>
                    <NumericFormat
                      className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-slate-900 disabled:bg-slate-300 text-right"
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="Rp"
                      value={incomes.reduce(
                        (acc, cur) => acc + cur.amount * Number(cur.occurence),
                        0
                      )}
                      readOnly
                      disabled
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="bg-green-700 px-4 py-2 rounded-md active:scale-90 transition"
              onClick={() => setModalState("closed")}
            >
              Simpan dan Tutup
            </button>
          </div>
        </div>
      </div>
      {/* Modal end */}
      <div className="flex relative flex-col items-start gap-4 p-2 pb-20 lg:px-24 lg:py-10">
        <div className="mb-4 mx-auto">
          <h1 className="text-3xl text-center">Pajakin</h1>
          <h4 className="text-xl mt-4">
            Kalkulator penghitung pajak progresif PPh 21 pekerja Indonesia
          </h4>
        </div>

        {/* <div className="flex flex-col gap-1 items-start">
          <label className="dark:text-slate-300">Gaji Bruto (per bulan)</label>
          <NumericFormat
            className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-black"
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp"
            value={bruto}
            onValueChange={(e) => setBruto(e.value)}
          />
        </div> */}

        <div className="flex flex-col gap-1 items-start">
          <label className="dark:text-slate-300">
            Penghasilan Bruto per Tahun
          </label>
          <div className="flex items-center justify-start gap-2">
            <NumericFormat
              className="dark:bg-slate-800 py-1 px-2 rounded-lg dark:disabled:bg-slate-900 disabled:bg-slate-300"
              thousandSeparator="."
              decimalSeparator=","
              prefix="Rp"
              value={penghasilanBrutoTahunan}
              disabled
              readOnly
            />
            <button
              onClick={() => setModalState("open")}
              className="w-[30px] h-[30px] flex items-center justify-center bg-slate-700 rounded-md active:scale-90 transition"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
                />
              </svg>
            </button>
          </div>
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
          <label className="dark:text-slate-300">
            Biaya Jabatan (per tahun)
          </label>
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
          <label className="dark:text-slate-300">PTKP Setahun</label>
          <NumericFormat
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
          <label className="dark:text-slate-300">
            Penghasilan Kena Pajak Setahun
          </label>
          <NumericFormat
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
              <tr className="text-lg border-b-2 border-slate-400">
                <th className="p-3 bg-slate-800 text-left border border-slate-600">
                  Pajak Progresif
                </th>
                <th className="p-3 bg-slate-800 border border-slate-600">
                  Percentage
                </th>
                <th className="p-3 bg-slate-800 text-right border border-slate-600">
                  Besaran Kena Pajak
                </th>
                <th className="p-3 bg-slate-800 text-right border border-slate-600">
                  PPh Terutang
                </th>
              </tr>
            </thead>
            <tbody>
              {calculatedProgressiveTaxes.map((calcProgTax, i) => {
                return (
                  <tr key={i}>
                    <td className="px-4 py-3 border border-slate-600">
                      {calcProgTax.label}
                    </td>

                    <td className="px-4 py-3 text-center border border-slate-600">
                      {calcProgTax.persentasePajak * 100}%
                    </td>
                    <td className="px-4 py-3 text-right border border-slate-600">
                      {formatCurrency(calcProgTax.besaranKenaPajak)}
                    </td>
                    <td className="px-4 py-3 text-right border border-slate-600">
                      {formatCurrency(calcProgTax.pphTerutang)}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-slate-400">
                <td colSpan={3} className="px-4 py-2 text-right">
                  Pph Terutang per tahun
                </td>
                <td className="text-right px-4 py-2">
                  {formatCurrency(pphTerutangPertahun)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right">
                  PPh Terutang per bulan
                </td>
                <td className="text-right px-4 py-2">
                  {formatCurrency(pphTerutangPerbulan)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {penghasilanBrutoTahunan ? (
          <div className="mt-4">
            <h4 className="">Kesimpulan</h4>
            <div className="text-xl mt-2">
              Pajak yang mesti dibayarkan per tahun adalah sebesar:
            </div>
            <div className="text-xl my-1">
              {formatCurrency(pphTerutangPertahun)}
            </div>
          </div>
        ) : (
          <div className="h-8" />
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
      </div>
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
