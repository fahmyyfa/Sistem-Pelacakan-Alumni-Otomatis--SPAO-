import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { calculateSPAOValue } from "./utils/scoring";
import { Play, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

function App() {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    fetchAlumni();
  }, []);

  async function fetchAlumni() {
    const { data } = await supabase.from("alumni_master").select("*");
    setAlumni(data || []);
  }

  async function handleSimulate(item) {
    // Simulasi data temuan dari sumber publik [cite: 594-595]
    const mockCandidate = {
      name: item.full_name,
      affiliation: "Universitas Muhammadiyah Malang",
      year: item.graduation_year,
    };

    const { score, status } = calculateSPAOValue(item, mockCandidate);

    // Simpan log bukti hasil pelacakan [cite: 602-603]
    await supabase.from("tracking_results").insert([
      {
        alumni_id: item.id,
        candidate_name: mockCandidate.name,
        confidence_score: score,
        status_final: status,
      },
    ]);

    // Perbarui status di tabel master [cite: 601-608]
    await supabase
      .from("alumni_master")
      .update({ status_pelacakan: status })
      .eq("id", item.id);

    fetchAlumni(); // Segarkan data di layar
  }

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
          SPAO Dashboard
        </h1>
        <p className="text-slate-500 mb-8">
          Sistem Pelacakan Alumni Otomatis — Project Daily 3
        </p>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-5 font-semibold">Nama Alumni</th>
                <th className="p-5 font-semibold text-center">Status</th>
                <th className="p-5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-slate-100 hover:bg-blue-50/50 transition"
                >
                  <td className="p-5">
                    <div className="font-bold text-slate-800">
                      {a.full_name}
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">
                      Lulus {a.graduation_year}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter
                      ${
                        a.status_pelacakan === "Teridentifikasi"
                          ? "bg-green-100 text-green-700"
                          : a.status_pelacakan === "Perlu Verifikasi Manual"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {a.status_pelacakan}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleSimulate(a)}
                      className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200"
                    >
                      <Play size={14} className="mr-2 fill-current" /> Lacak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
