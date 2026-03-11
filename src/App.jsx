import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { calculateSPAOValue } from "./utils/scoring";
import {
  Play,
  History,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

function App() {
  const [alumni, setAlumni] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchAlumni();
    fetchResults();
  }, []);

  async function fetchAlumni() {
    const { data } = await supabase
      .from("alumni_master")
      .select("*")
      .order("full_name");
    setAlumni(data || []);
  }

  async function fetchResults() {
    const { data } = await supabase
      .from("tracking_results")
      .select("*, alumni_master(full_name, graduation_year)")
      .order("created_at", { ascending: false })
      .limit(5);
    setResults(data || []);
  }

  async function handleSimulate(item) {
    let mockCandidate;
    if (item.full_name === "Fahmi Alfaqih") {
      mockCandidate = {
        name: item.full_name,
        affiliation: "UMM",
        year: item.graduation_year,
      };
    } else if (item.full_name === "Andi Pratama") {
      mockCandidate = {
        name: item.full_name,
        affiliation: "Startup X",
        year: item.graduation_year,
      };
    } else {
      mockCandidate = { name: "Anonim", affiliation: "Unknown", year: 2000 };
    }

    const { score, status } = calculateSPAOValue(item, mockCandidate);

    await supabase.from("tracking_results").insert([
      {
        alumni_id: item.id,
        candidate_name: mockCandidate.name,
        candidate_affiliation: mockCandidate.affiliation,
        candidate_year: mockCandidate.year,
        confidence_score: score,
        status_final: status,
      },
    ]);

    await supabase
      .from("alumni_master")
      .update({ status_pelacakan: status })
      .eq("id", item.id);

    fetchAlumni();
    fetchResults();
  }

  async function handleReset() {
    await supabase
      .from("alumni_master")
      .update({ status_pelacakan: "Belum Dilacak" })
      .neq("status_pelacakan", "Belum Dilacak");
    await supabase
      .from("tracking_results")
      .delete()
      .neq("confidence_score", -1);
    fetchAlumni();
    fetchResults();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        {}
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-blue-200">
            Internal System
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            SPAO Dashboard <span className="text-blue-600">2.0</span>
          </h1>
          <p className="text-slate-500 max-w-md">
            Sistem Pelacakan Alumni Otomatis dengan Algoritma Disambiguasi &
            Scoring [cite: 501]
          </p>

          <button
            onClick={handleReset}
            className="mt-6 flex items-center text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-tight transition group"
          >
            <Trash2
              size={14}
              className="mr-2 group-hover:rotate-12 transition-transform"
            />{" "}
            Reset Semua Data Master
          </button>
        </header>

        {}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100 overflow-hidden border border-white mb-12">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest">
                  Alumni Profil
                </th>
                <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest text-center">
                  Confidence Status
                </th>
                <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {alumni.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="font-extrabold text-slate-800 text-lg">
                      {a.full_name}
                    </div>
                    <div className="text-xs text-slate-400 font-medium tracking-wide">
                      Lulusan Tahun {a.graduation_year}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                      ${
                        a.status_pelacakan === "Teridentifikasi"
                          ? "bg-green-100 text-green-700"
                          : a.status_pelacakan === "Perlu Verifikasi Manual"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {a.status_pelacakan}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleSimulate(a)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                      Lacak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center">
              <div className="bg-blue-500/20 p-3 rounded-2xl mr-4 text-blue-400">
                <History size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Jejak Bukti
                </h2>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Evidence Audit Log
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 relative z-10">
            {results.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-500 font-bold italic uppercase tracking-widest text-xs">
                  Awaiting identification process...
                </p>
              </div>
            ) : (
              results.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-center group hover:bg-slate-800 transition-colors"
                >
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${r.confidence_score >= 80 ? "bg-green-400" : r.confidence_score >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                      ></div>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        Target: {r.alumni_master?.full_name}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Badge score={r.confidence_score >= 40} label="Nama" />
                      <Badge
                        score={
                          r.confidence_score === 100 ||
                          (r.confidence_score >= 80 &&
                            r.candidate_affiliation === "UMM")
                        }
                        label="Afiliasi"
                      />
                      <Badge
                        score={r.confidence_score % 40 !== 0}
                        label="Timeline"
                      />
                    </div>
                  </div>
                  <div className="flex items-center bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-700">
                    <div className="mr-4 text-right">
                      <div className="text-3xl font-black leading-none">
                        {r.confidence_score}
                      </div>
                      <div className="text-[8px] uppercase text-slate-500 font-bold tracking-widest">
                        Confidence
                      </div>
                    </div>
                    {r.confidence_score >= 80 ? (
                      <CheckCircle2 className="text-green-400" size={32} />
                    ) : r.confidence_score >= 50 ? (
                      <AlertTriangle className="text-amber-400" size={32} />
                    ) : (
                      <XCircle className="text-red-400" size={32} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ score, label }) {
  return (
    <div
      className={`flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${score ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-slate-700 bg-slate-800/50 text-slate-500"}`}
    >
      {label} {score ? "+OK" : "+0"}
    </div>
  );
}

export default App;
