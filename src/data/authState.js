// Penyimpanan akun sementara di memori aplikasi -- ganti seluruh isi file ini
// dengan pemanggilan API login/kelola-akun/ubah-password ke backend SIRELA begitu
// sudah terhubung (data ini hilang tiap aplikasi ditutup total).
//
// Catatan: password di sini disimpan plain-text karena ini cuma mock lokal.
// Begitu sudah ada backend beneran, hashing password (bcrypt dll) harus
// dilakukan di server, JANGAN pernah kirim/simpan password plain-text lagi.

const accounts = [
  { name: "Admin SIRELA", username: "admin", password: "admin123", role: "Admin" },
];

export function checkLogin(username, password) {
  const trimmed = username.trim();
  return accounts.some((acc) => acc.username === trimmed && acc.password === password);
}

export function findAccount(username) {
  return accounts.find((acc) => acc.username === username.trim());
}

// Dipakai buat nampilin daftar akun di halaman "Manajemen akun"
// (tidak menyertakan password).
export function listAccounts() {
  return accounts.map(({ password, ...rest }) => rest);
}

// Hanya boleh dipanggil dari alur yang dijaga role Admin (mis. tombol
// "Tambah akun" di Pengaturan) -- bukan dari halaman publik mana pun.
// Akun yang dibuat lewat sini selalu berperan "User"; hanya akun Admin
// yang bisa membuat akun baru, dan akun baru tidak pernah jadi Admin.
export function addAdminAccount(name, username, password, role = "User") {
  const trimmedUsername = username.trim();
  if (findAccount(trimmedUsername)) {
    return { success: false, message: "Nama pengguna sudah dipakai, coba nama lain." };
  }
  accounts.push({ name: name.trim(), username: trimmedUsername, password, role });
  return { success: true };
}

// Akun Admin tidak bisa dihapus lewat sini supaya selalu ada minimal satu
// akun yang bisa mengelola akun-akun lain.
export function deleteAdminAccount(username) {
  const account = findAccount(username);
  if (!account) {
    return { success: false, message: "Akun tidak ditemukan." };
  }
  if (account.role === "Admin") {
    return { success: false, message: "Akun admin tidak bisa dihapus." };
  }
  accounts.splice(accounts.indexOf(account), 1);
  return { success: true };
}

// Berlaku untuk akun mana pun (dipanggil dari halaman "Ubah kata sandi"
// milik akun yang sedang login, bukan cuma akun pertama).
export function changePassword(username, oldPassword, newPassword) {
  const account = findAccount(username);
  if (!account) {
    return { success: false, message: "Akun tidak ditemukan." };
  }
  if (account.password !== oldPassword) {
    return { success: false, message: "Kata sandi lama salah." };
  }
  account.password = newPassword;
  return { success: true };
}