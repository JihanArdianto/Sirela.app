export const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum"]; // Sekolah cuma masuk Senin-Jumat

// Satu daftar jurusan yang jadi sumber untuk halaman Jurusan & dropdown Jurusan di Kelas.
// Jumlah "kelas aktif" dihitung otomatis dari data Kelas, bukan angka tetap --
// supaya selalu akurat kalau ada kelas baru ditambah/dihapus.
export const initialMajors = [
  { id: "m1", code: "RPL", name: "Rekayasa Perangkat Lunak", color: "#6C4FCB" },
  { id: "m2", code: "ULW", name: "Usaha Layanan Wisata", color: "#C97B2E" },
  { id: "m3", code: "BD", name: "Bidang Digital", color: "#D64545" },
  { id: "m4", code: "AKN", name: "Akuntansi", color: "#2F6FED" },
];

// Setiap kelas WAJIB pakai salah satu nama dari initialMajors (dipilih lewat dropdown).
export const initialClasses = [
  { id: "c1", name: "X-RPL-1", major: "Rekayasa Perangkat Lunak", students: 32 },
  { id: "c2", name: "XI-AKL-2", major: "Akuntansi", students: 30 },
  { id: "c3", name: "XI-IPA-1", major: "Bidang Digital", students: 28 },
  { id: "c4", name: "XI-IPS-1", major: "Usaha Layanan Wisata", students: 29 },
];

export const initialRooms = [
  { id: "r1", name: "Ruang 101", status: "Terpakai", info: "Matematika XI", person: "Dr. Sarah Collins" },
  { id: "r2", name: "Ruang 102", status: "Kosong", info: "Fisika XI", person: "Mr. James Smith" },
  { id: "r3", name: "Ruang 103", status: "Terpakai", info: "Sastra Inggris", person: "Ny. Diana Walsh" },
  { id: "r4", name: "Ruang 104", status: "Kosong", info: "Belum ada kelas", person: "" },
];

// Nama kelas & ruangan di jadwal WAJIB dipilih dari initialClasses / initialRooms (dropdown).
export const initialSchedule = {
  Sen: [
    { id: "s1", time: "07:00 - 08:30", className: "X-RPL-1", room: "Ruang 101", teacher: "Mrs. Nur", color: "#2F6FED" },
    { id: "s2", time: "08:30 - 10:00", className: "XI-AKL-2", room: "Ruang 102", teacher: "Mrs. Dewi", color: "#2F9E5B" },
    { id: "s3", time: "10:15 - 11:45", className: "XI-IPA-1", room: "Ruang 103", teacher: "Mrs. Diana", color: "#C97B2E" },
    { id: "s4", time: "13:00 - 14:30", className: "XI-IPS-1", room: "Ruang 104", teacher: "Dr. Emily Brown", color: "#D64545" },
  ],
  Sel: [],
  Rab: [],
  Kam: [],
  Jum: [],
};
