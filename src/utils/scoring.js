export const calculateSPAOValue = (alumni, candidate) => {
  let score = 0;

  // 1. Kecocokan Nama (+40 Poin) [cite: 574]
  if (candidate.name.toLowerCase().includes(alumni.full_name.toLowerCase())) {
    score += 40;
  }

  // 2. Kecocokan Afiliasi (+40 Poin) [cite: 575]
  const isAffiliated =
    candidate.affiliation.toLowerCase().includes("umm") ||
    candidate.affiliation.toLowerCase().includes("muhammadiyah malang");
  if (isAffiliated) {
    score += 40;
  }

  // 3. Kecocokan Timeline (+20 Poin) [cite: 576]
  if (candidate.year === alumni.graduation_year) {
    score += 20;
  }

  // Klasifikasi Status Berdasarkan Skor [cite: 580-583]
  let status = "Belum Ditemukan";
  if (score >= 80) status = "Teridentifikasi";
  else if (score >= 50) status = "Perlu Verifikasi Manual";

  return { score, status };
};
