"use client";

import { useEffect, useState } from "react";
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

  const [outcomes, setOutcomes] = useState<Income[]>([
    { id: numberGen(), amount: 0, occurence: "1" },
  ]);

  // Close modal when escape key is pressed
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setModalState("closed");
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function addNewIncomeRow() {
    setIncomes((prev) =>
      prev.concat({ id: numberGen(), amount: 0, occurence: "1" }),
    );
  }

  function addNewOutcomeRow() {
    setOutcomes((prev) =>
      prev.concat({ id: numberGen(), amount: 0, occurence: "1" }),
    );
  }

  const [ptkpKey, setPtkpKey] = useState<keyof typeof ptkpKategori>("TK/0");

  const penghasilanBrutoTahunan = incomes.reduce(
    (acc, cur) => acc + cur.amount * Number(cur.occurence),
    0,
  );
  const komponenPengurang = outcomes.reduce(
    (acc, cur) => acc + cur.amount * Number(cur.occurence),
    0,
  );
  const penghasilanNettoTahunan = penghasilanBrutoTahunan - komponenPengurang;
  const ptkp = ptkpKategori[ptkpKey].tarif;
  const pkp = Math.max(penghasilanBrutoTahunan - ptkp - komponenPengurang, 0);
  const calculatedProgressiveTaxes = calculateProgressiveTax(pkp);

  const pphTerutangPertahun = calculatedProgressiveTaxes.reduce(
    (a, c) => c.pphTerutang + a,
    0,
  );
  const pphTerutangPerbulan = pphTerutangPertahun / 12;

  return (
    <main className="mx-auto max-w-lg px-2 py-8 md:max-w-6xl md:py-12 lg:px-0">
      <div className="mx-auto mb-4 text-center">
        <h1 className="text-center text-3xl">Pajakin</h1>
        <h2 className="mt-4 text-center text-xl">
          Kalkulator penghitung pajak progresif PPh 21 pekerja Indonesia
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Pajakin gratis dan{" "}
          <a
            href="https://github.com/AsadSaleh/pajakin/"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            open source
          </a>
          .
        </p>
        <p className="text-sm text-slate-400">
          Pajakin tidak pernah mengambil maupun men-track data Anda. Semua data
          hanya disimpan di browser Anda.
        </p>
      </div>

      <h3 className="text-xl">Isian</h3>
      <p className="mt-2 text-slate-300">1. Masukan penghasilan</p>
      <button
        onClick={() => setModalState("open")}
        className="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 transition hover:bg-slate-600 active:scale-95"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
          />
        </svg>
        <p>Kalkulator penghasilan</p>
      </button>

      {/* Modal start */}
      <div
        data-shown={modalState === "open"}
        className={`fixed -right-[calc(100%)] top-0 z-10 h-screen w-screen overflow-y-scroll overscroll-contain bg-slate-700 p-4 transition-all duration-300 ease-in-out data-[shown=true]:right-0 md:right-[-500px] md:w-[500px] lg:right-[-700px] lg:w-[700px]`}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-2xl">Input Penghasilan</h4>
          <button
            type="button"
            onClick={() => setModalState("closed")}
            className="rounded-md bg-slate-800 transition active:scale-90"
            tabIndex={modalState === "open" ? undefined : -1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8"
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
            <table className="w-full border-collapse border border-slate-500">
              <thead>
                <tr>
                  <th className="rounded-tl-md border border-slate-600">
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
                        className="w-40 rounded-lg bg-slate-800 px-2 py-1 text-right disabled:bg-black"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp"
                        value={income.amount}
                        onValueChange={(e) =>
                          setIncomes((prev) =>
                            prev.map((prevIncome) =>
                              prevIncome.id === income.id
                                ? { ...prevIncome, amount: e.floatValue ?? 0 }
                                : prevIncome,
                            ),
                          )
                        }
                        tabIndex={modalState === "open" ? undefined : -1}
                      />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <input
                        className="w-20 rounded-lg bg-slate-800 px-2 py-1 disabled:bg-black"
                        value={income.occurence}
                        tabIndex={modalState === "open" ? undefined : -1}
                        onChange={(e) => {
                          setIncomes((prev) =>
                            prev.map((prevIncome) =>
                              prevIncome.id === income.id
                                ? {
                                    ...prevIncome,
                                    occurence: e.target.value,
                                  }
                                : prevIncome,
                            ),
                          );
                        }}
                      />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <input
                        className="w-24 rounded-lg bg-slate-800 px-2 py-1 disabled:bg-black"
                        value={income.desc}
                        onChange={() => {}}
                        tabIndex={modalState === "open" ? undefined : -1}
                      />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <NumericFormat
                        className="rounded-lg bg-slate-800 px-2 py-1 text-right disabled:bg-slate-900"
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
                        className="px-1 text-center text-sm text-red-400 transition active:scale-90"
                        onClick={() =>
                          setIncomes((prev) => {
                            if (prev.length === 1) {
                              return [
                                { id: numberGen(), amount: 0, occurence: "1" },
                              ];
                            }
                            return prev.filter(
                              (prevIncome) => prevIncome.id !== income.id,
                            );
                          })
                        }
                        tabIndex={modalState === "open" ? undefined : -1}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="px-1">
                    <button
                      type="button"
                      onClick={addNewIncomeRow}
                      className="w-full rounded-md bg-slate-800 text-sm italic text-slate-400 transition hover:bg-opacity-70 hover:text-white active:scale-95"
                      tabIndex={modalState === "open" ? undefined : -1}
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
                      className="rounded-lg bg-slate-800 px-2 py-1 text-right disabled:bg-slate-900"
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="Rp"
                      value={incomes.reduce(
                        (acc, cur) => acc + cur.amount * Number(cur.occurence),
                        0,
                      )}
                      readOnly
                      disabled
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <h4 className="text-xl">Komponen pengurang</h4>
            <p className="text-sm text-slate-400">
              Komponen biaya yang mengurangi pajak contohnya: Biaya Jabatan,
              iuran JHT, iuran JP, dan sejenisnya.
            </p>
            <div className="w-full overflow-scroll">
              <table className="w-full border-collapse border border-slate-500">
                <thead>
                  <tr>
                    <th className="rounded-tl-md border border-slate-600">
                      Nominal
                    </th>
                    <th className="border border-slate-600">Pengali</th>
                    <th className="border border-slate-600">Keterangan</th>
                    <th className="border border-slate-600">Subtotal</th>
                    <th className="border border-slate-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {outcomes.map((outcome) => (
                    <tr key={outcome.id}>
                      <td className="border border-slate-600 p-1">
                        <NumericFormat
                          className="w-40 rounded-lg bg-slate-800 px-2 py-1 text-right disabled:bg-black"
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp"
                          value={outcome.amount}
                          onValueChange={(e) =>
                            setOutcomes((prev) =>
                              prev.map((prevOutcome) =>
                                prevOutcome.id === outcome.id
                                  ? {
                                      ...prevOutcome,
                                      amount: e.floatValue ?? 0,
                                    }
                                  : prevOutcome,
                              ),
                            )
                          }
                          tabIndex={modalState === "open" ? undefined : -1}
                        />
                      </td>
                      <td className="border border-slate-600 p-1">
                        <input
                          className="w-20 rounded-lg bg-slate-800 px-2 py-1 disabled:bg-black"
                          value={outcome.occurence}
                          tabIndex={modalState === "open" ? undefined : -1}
                          onChange={(e) => {
                            setOutcomes((prev) =>
                              prev.map((prevOutcome) =>
                                prevOutcome.id === outcome.id
                                  ? {
                                      ...prevOutcome,
                                      occurence: e.target.value,
                                    }
                                  : prevOutcome,
                              ),
                            );
                          }}
                        />
                      </td>
                      <td className="border border-slate-600 p-1">
                        <input
                          className="w-24 rounded-lg bg-slate-800 px-2 py-1 disabled:bg-black"
                          value={outcome.desc}
                          onChange={() => {}}
                          tabIndex={modalState === "open" ? undefined : -1}
                        />
                      </td>
                      <td className="border border-slate-600 p-1">
                        <NumericFormat
                          className="rounded-lg bg-slate-800 px-2 py-1 text-right disabled:bg-slate-900"
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp"
                          value={outcome.amount * Number(outcome.occurence)}
                          readOnly
                          disabled
                        />
                      </td>
                      <td className="border border-slate-600 p-1">
                        <button
                          className="px-1 text-center text-sm text-red-400 transition active:scale-90"
                          onClick={() =>
                            setOutcomes((prev) => {
                              if (prev.length === 1) {
                                return [
                                  {
                                    id: numberGen(),
                                    amount: 0,
                                    occurence: "1",
                                  },
                                ];
                              }
                              return prev.filter(
                                (prevOutcome) => prevOutcome.id !== outcome.id,
                              );
                            })
                          }
                          tabIndex={modalState === "open" ? undefined : -1}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="px-1">
                      <button
                        type="button"
                        onClick={addNewOutcomeRow}
                        className="w-full rounded-md bg-slate-800 text-sm italic text-slate-400 transition hover:bg-opacity-70 hover:text-white active:scale-95"
                        tabIndex={modalState === "open" ? undefined : -1}
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
                        className="rounded-lg bg-slate-800 px-2 py-1 text-right disabled:bg-slate-900"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp"
                        value={outcomes.reduce(
                          (acc, cur) =>
                            acc + cur.amount * Number(cur.occurence),
                          0,
                        )}
                        readOnly
                        disabled
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-green-700 px-4 py-2 transition active:scale-90"
              onClick={() => setModalState("closed")}
              tabIndex={modalState === "open" ? undefined : -1}
            >
              Simpan dan Tutup
            </button>
          </div>
        </div>
      </div>
      {/* Modal end */}

      <p className="mt-3 text-slate-300">2. Pilih Golongan</p>
      <select
        className="min-w-min cursor-pointer rounded-lg bg-slate-700 px-4 py-3 transition-colors hover:bg-slate-600"
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

      <h3 className="mt-10 text-xl">Rangkuman</h3>

      <p className="mt-3 text-slate-300">Penghasilan bruto setahun</p>
      <NumericFormat
        className="rounded-lg bg-slate-800 px-2 py-1 disabled:bg-slate-900"
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp"
        value={penghasilanBrutoTahunan}
        disabled
        readOnly
      />

      <p className="mt-4 text-slate-300">Komponen pengurang setahun</p>
      <NumericFormat
        className="rounded-lg bg-slate-800 px-2 py-1 disabled:bg-slate-900"
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp"
        value={komponenPengurang}
        readOnly
        disabled
      />

      <p className="mt-4 text-slate-300">Penghasilan netto setahun</p>
      <p className="text-sm text-slate-400">
        (Penghasilan bruto setahun - Komponen pengurang setahun)
      </p>
      <NumericFormat
        className="mt-1 rounded-lg bg-slate-800 px-2 py-1 disabled:bg-slate-900"
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp"
        value={penghasilanNettoTahunan}
        readOnly
        disabled
      />

      <p className="mt-4 text-slate-300">
        Penghasilan Tidak Kena Pajak (PTKP) setahun
      </p>
      <p className="text-sm text-slate-400">
        Berdasarkan golongan yang dipilih
      </p>
      <NumericFormat
        className="mt-1 rounded-lg bg-slate-800 px-2 py-1 disabled:bg-slate-900"
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp"
        value={ptkp}
        readOnly
        disabled
      />

      <p className="mt-4 text-slate-300">Penghasilan kena pajak setahun</p>
      <p className="text-sm text-slate-400">
        (Penghasilan netto setahun - PTKP)
      </p>
      <NumericFormat
        className="mt-1 rounded-lg bg-slate-800 px-2 py-1 disabled:bg-slate-900"
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp"
        value={pkp}
        readOnly
        disabled
      />

      {/* TABEL */}
      <div className="mt-6 w-full overflow-scroll">
        <table className="w-[600px] border-separate border-spacing-0 rounded-xl border border-slate-400 md:w-full">
          <thead className="rounded-tl-xl">
            <tr className="border-b-2 border-slate-400 text-lg">
              <th className="rounded-tl-xl border border-slate-600 bg-slate-800 p-3 text-left">
                Range Pajak Progresif
              </th>
              <th className="border border-slate-600 bg-slate-800 p-3">
                Persentase
              </th>
              <th className="border border-slate-600 bg-slate-800 p-3 text-right">
                Besaran Kena Pajak
              </th>
              <th className="rounded-tr-xl border border-slate-600 bg-slate-800 p-3 text-right">
                PPh Terutang
              </th>
            </tr>
          </thead>
          <tbody>
            {calculatedProgressiveTaxes.map((calcProgTax, i) => {
              return (
                <tr key={i}>
                  <td className="border border-slate-600 px-4 py-3">
                    {calcProgTax.label}
                  </td>

                  <td className="border border-slate-600 px-4 py-3 text-center">
                    {calcProgTax.persentasePajak * 100}%
                  </td>
                  <td className="border border-slate-600 px-4 py-3 text-right">
                    {formatCurrency(calcProgTax.besaranKenaPajak)}
                  </td>
                  <td className="border border-slate-600 px-4 py-3 text-right">
                    {formatCurrency(calcProgTax.pphTerutang)}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-slate-400">
              <td colSpan={3} className="px-4 py-2 text-right">
                Pph Terutang per tahun
              </td>
              <td className="px-4 py-2 text-right">
                {formatCurrency(pphTerutangPertahun)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-2 text-right">
                PPh Terutang per bulan
              </td>
              <td className="px-4 py-2 text-right">
                {formatCurrency(pphTerutangPerbulan)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {penghasilanBrutoTahunan ? (
        <>
          <h3 className="mt-10 text-xl">Kesimpulan</h3>

          <p className="mt-3 text-lg text-slate-300">
            Pajak yang mesti dibayarkan per tahun adalah sebesar:{" "}
            <span className="text-slate-200">
              {formatCurrency(pphTerutangPertahun)}
            </span>
          </p>

          <p className="text-lg text-slate-300">
            Atau per bulan sebesar:{" "}
            <span className="text-xl text-slate-200">
              {formatCurrency(pphTerutangPerbulan)}
            </span>
          </p>
        </>
      ) : (
        <div className="h-8" />
      )}

      <footer className="fixed bottom-2 right-2">
        <a
          href="https://asadghanim.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-slate-600 p-1 text-xs transition-all hover:bg-slate-500"
        >
          By As&apos;ad Ghanim
        </a>
      </footer>
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
