export const calculateSPAOValue = (alumni, candidate) => {
  let score = 0;

  if (candidate.name.toLowerCase().includes(alumni.full_name.toLowerCase())) {
    score += 40;
  }

  const isAffiliated =
    candidate.affiliation.toLowerCase().includes("umm") ||
    candidate.affiliation.toLowerCase().includes("muhammadiyah malang");
  if (isAffiliated) {
    score += 40;
  }

  if (candidate.year === alumni.graduation_year) {
    score += 20;
  }

  let status = "Belum Ditemukan";
  if (score >= 80) status = "Teridentifikasi";
  else if (score >= 50) status = "Perlu Verifikasi Manual";

  return { score, status };
};
