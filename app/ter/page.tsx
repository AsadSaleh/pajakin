'use client';

import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import { NumericFormat, numericFormatter } from 'react-number-format';
import {
  findTerBracket,
  type TerCategory,
  terPtkpKategori,
  terTables,
} from '../ter-rates';

export default function TerPage() {
  const [ptkpKey, setPtkpKey] = useState<keyof typeof terPtkpKategori>('TK/0');
  const [brutoBulanan, setBrutoBulanan] = useState<number>(0);

  const category = terPtkpKategori[ptkpKey].category;
  const bracket = findTerBracket(category, brutoBulanan);
  const pphBulanan = brutoBulanan * bracket.rate;
  const nettoBulanan = brutoBulanan - pphBulanan;

  return (
    <main className="mx-auto px-4 py-8 pb-20 sm:px-6 md:max-w-2xl md:px-2 md:py-12 lg:max-w-3xl lg:px-0">
      <div className="mx-auto mb-4 text-center">
        <h1 className="text-center text-3xl">Pajakin</h1>
        <h2 className="mt-4 text-left text-xl sm:text-center">
          Kalkulator PPh 21 Bulanan dengan Tarif Efektif Rata-Rata (TER)
        </h2>
        <p className="mt-2 text-left text-sm text-slate-400 sm:text-center">
          Skema TER berlaku sejak 1 Januari 2024 (PP No. 58 Tahun 2023). Dipakai
          untuk pemotongan PPh 21 Masa Pajak Januari–November.
        </p>
      </div>

      <nav className="mt-6 flex justify-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-md bg-slate-800 px-4 py-2 transition hover:bg-slate-700"
        >
          ← Kalkulator Progresif Tahunan
        </Link>
      </nav>

      <div className="mt-10">
        <h4 className="text-2xl">1. Pilih Golongan PTKP</h4>
        <p className="text-sm text-slate-400">
          Status PTKP menentukan kategori TER (A, B, atau C).
        </p>
        <select
          className="mt-2 w-full cursor-pointer rounded-lg bg-slate-700 px-4 py-3 transition-colors hover:bg-slate-600"
          value={ptkpKey}
          onChange={(v) =>
            setPtkpKey(v.target.value as keyof typeof terPtkpKategori)
          }
        >
          {Object.entries(terPtkpKategori).map(([key, value]) => (
            <option key={key} value={key}>
              {key} — {value.desc} (Kategori TER {value.category})
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-slate-400">
          Status terpilih:{' '}
          <span className="text-slate-200">
            {ptkpKey} — {terPtkpKategori[ptkpKey].desc}
          </span>
          . Masuk{' '}
          <span className="text-slate-200">Kategori TER {category}</span>.
        </p>
      </div>

      <div className="mt-10">
        <h4 className="text-2xl">2. Penghasilan Bruto Bulanan</h4>
        <p className="text-sm text-slate-400">
          Total penghasilan bruto sebulan: gaji pokok, tunjangan, dan komponen
          lainnya. Tidak perlu dikurangi biaya jabatan atau iuran — pengurang
          ini sudah diperhitungkan di dalam tarif TER.
        </p>
        <NumericFormat
          className="mt-2 w-full rounded-lg bg-slate-800 px-3 py-3 text-right text-lg"
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp"
          placeholder="Rp0"
          value={brutoBulanan || ''}
          onValueChange={(e) => setBrutoBulanan(e.floatValue ?? 0)}
        />
      </div>

      {/* Hasil */}
      <div className="mt-10 rounded-xl bg-slate-800 p-8">
        <h3 className="text-xl">Hasil Perhitungan</h3>

        <p className="mt-4 text-slate-300">
          Tarif Efektif (TER) yang berlaku
          <InfoTooltip label="Penjelasan Tarif Efektif">
            Tarif dipilih dari tabel TER Kategori{' '}
            <span className="text-slate-100">{category}</span> sesuai lapisan
            penghasilan bruto bulanan Anda.
            <span className="mt-2 block text-slate-100">
              Penghasilan {formatCurrency(brutoBulanan)} → tarif{' '}
              {formatPercent(bracket.rate)}
            </span>
          </InfoTooltip>
        </p>
        <p className="text-3xl font-bold">{formatPercent(bracket.rate)}</p>

        <div className="mt-6 flex flex-wrap gap-6">
          <div className="min-w-[260px] flex-1 rounded-md border p-6">
            <p className="text-slate-300">PPh 21 per bulan</p>
            <InfoTooltipBlock label="Penjelasan PPh 21 per bulan">
              PPh 21 bulanan = Penghasilan bruto bulanan × Tarif Efektif.
              <span className="mt-2 block text-slate-100">
                = {formatCurrency(brutoBulanan)} × {formatPercent(bracket.rate)}
              </span>
              <span className="block text-slate-100">
                = {formatCurrency(pphBulanan)}
              </span>
            </InfoTooltipBlock>
            <span className="text-2xl font-bold">
              {formatCurrency(pphBulanan)}
            </span>
            <span className="ml-2 text-sm">/ Bulan</span>
          </div>
          <div className="min-w-[260px] flex-1 rounded-md border p-6">
            <p className="text-slate-300">Take home pay (netto)</p>
            <InfoTooltipBlock label="Penjelasan take home pay">
              Penghasilan bruto bulanan dikurangi PPh 21 bulanan.
              <span className="mt-2 block text-slate-100">
                = {formatCurrency(brutoBulanan)} − {formatCurrency(pphBulanan)}
              </span>
              <span className="block text-slate-100">
                = {formatCurrency(nettoBulanan)}
              </span>
            </InfoTooltipBlock>
            <span className="text-2xl font-bold">
              {formatCurrency(nettoBulanan)}
            </span>
            <span className="ml-2 text-sm">/ Bulan</span>
          </div>
        </div>

        <p className="mt-6 rounded-md bg-slate-900 p-4 text-sm text-slate-400">
          <span className="text-slate-200">Catatan:</span> TER hanya dipakai
          untuk Masa Pajak Januari–November. Pada Masa Pajak terakhir
          (Desember), PPh 21 setahun dihitung ulang dengan tarif progresif Pasal
          17, lalu dikurangi total PPh 21 yang sudah dipotong Januari–November.
          Gunakan{' '}
          <Link href="/" className="underline hover:text-slate-300">
            kalkulator progresif tahunan
          </Link>{' '}
          untuk perhitungan setahun.
        </p>
      </div>

      {/* Tabel TER kategori terpilih */}
      <div className="mt-10">
        <h4 className="text-xl">
          Tabel Tarif Efektif Rata-Rata Kategori {category}
        </h4>
        <p className="text-sm text-slate-400">
          Baris yang berlaku untuk penghasilan Anda ditandai.
        </p>
        <div className="mt-2 w-full overflow-scroll">
          <table className="w-full border-separate border-spacing-0 rounded-xl border border-slate-400">
            <thead>
              <tr className="text-left">
                <th className="rounded-tl-xl border border-slate-600 bg-slate-800 p-3">
                  Penghasilan Bruto Bulanan
                </th>
                <th className="rounded-tr-xl border border-slate-600 bg-slate-800 p-3 text-right">
                  Tarif Efektif
                </th>
              </tr>
            </thead>
            <tbody>
              {terPtkpRows(category).map((row) => {
                const isActive = row.upTo === bracket.upTo;
                return (
                  <tr
                    key={row.upTo}
                    className={isActive ? 'bg-green-900/40' : undefined}
                  >
                    <td className="border border-slate-600 px-4 py-2">
                      {row.label}
                    </td>
                    <td className="border border-slate-600 px-4 py-2 text-right">
                      {formatPercent(row.rate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-20 text-center text-sm text-slate-400">
        Terima kasih telah menggunakan Pajakin! Untuk melihat karya-karya
        lainnya, silahkan kunjungi{' '}
        <a
          href="https://asadghanim.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-300"
        >
          As&apos;ad personal website
        </a>
      </footer>
    </main>
  );
}

/** Membangun baris tabel dengan label rentang yang mudah dibaca. */
function terPtkpRows(category: TerCategory) {
  const table = terTables[category];
  const rows: { upTo: number; rate: number; label: string }[] = [];
  let prev = 0;
  for (const bracket of table) {
    let label: string;
    if (prev === 0) {
      label = `≤ ${formatCurrency(bracket.upTo)}`;
    } else if (bracket.upTo === Infinity) {
      label = `> ${formatCurrency(prev)}`;
    } else {
      label = `> ${formatCurrency(prev)} – ${formatCurrency(bracket.upTo)}`;
    }
    rows.push({ upTo: bracket.upTo, rate: bracket.rate, label });
    prev = bracket.upTo;
  }
  return rows;
}

function InfoTooltip({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <span className="group relative ml-1.5 inline-flex align-middle">
      <button
        type="button"
        aria-label={label ?? 'Penjelasan perhitungan'}
        className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-500 text-[10px] font-semibold leading-none text-slate-400 transition hover:border-slate-300 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 w-64 max-w-[80vw] rounded-lg border border-slate-600 bg-slate-900 p-3 text-left text-xs font-normal leading-relaxed text-slate-300 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {children}
        <span className="absolute left-2 top-full h-0 w-0 border-4 border-transparent border-t-slate-600" />
      </span>
    </span>
  );
}

/** Versi tooltip untuk dipakai di dalam kartu (ikon di pojok). */
function InfoTooltipBlock({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <span className="float-right">
      <InfoTooltip label={label}>{children}</InfoTooltip>
    </span>
  );
}

function formatCurrency(input: number | string) {
  input = input.toString();
  if (input === '0') {
    return 'Rp0';
  }
  return numericFormatter(input, {
    prefix: 'Rp',
    thousandSeparator: '.',
    decimalSeparator: ',',
    decimalScale: 0,
  });
}

function formatPercent(rate: number) {
  return numericFormatter((rate * 100).toString(), {
    thousandSeparator: '.',
    decimalSeparator: ',',
    decimalScale: 2,
  }).concat('%');
}
