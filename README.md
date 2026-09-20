# SIRELA App (React Native Expo)

Project ini dibuat sesuai desain Figma SIRELA: Splash, Login, Daftar, dan 5 tab utama
(Ruangan, Jadwal, Jurusan, Kelas, Atur) lengkap dengan modal-modalnya
(tambah/hapus/konfirmasi, pencarian, dsb). Data masih dummy (disimpan di state lokal),
jadi tinggal disambungkan ke backend SIRELA-mu (mis. https://sirelaa-production.up.railway.app/)
lewat fetch/axios di masing-masing screen.

## Cara menjalankan

1. Pastikan sudah install Node.js (LTS) dan aplikasi **Expo Go** di HP kamu.
2. Ekstrak folder ini, lalu buka terminal di dalamnya.
3. Install dependency:
   ```
   npm install
   ```
4. Jalankan:
   ```
   npx expo start
   ```
5. Scan QR code yang muncul dengan aplikasi **Expo Go** di HP (pastikan HP & komputer
   satu jaringan WiFi).

### Beda jaringan (HP pakai data seluler / WiFi lain)

Kalau HP dan komputer tidak satu jaringan, jalankan pakai mode tunnel:
```
npm run tunnel
```
atau
```
npx expo start --tunnel
```
Tunggu sampai QR code baru muncul (URL-nya berbentuk `exp://xxxxx.exp.direct`),
lalu scan seperti biasa dari Expo Go. Mode ini sedikit lebih lambat karena
lewat server tunnel, tapi HP bisa pakai jaringan apa saja.

## Struktur folder

```
App.js                     -> entry point
src/
  theme/colors.js           -> semua warna sesuai desain
  data/seed.js               -> data dummy (ruangan, jadwal, jurusan, kelas)
  components/                -> komponen reusable (Header, FAB, Modal, Confirm)
  screens/                    -> semua halaman (Splash, Login, Register, 5 tab)
  navigation/                 -> Root Stack + Bottom Tabs
```

## Login demo

Karena belum tersambung ke backend, login pakai akun demo hardcode:
- Nama pengguna: `admin`
- Kata sandi: `admin123`

Salah isi akan muncul pesan error. Ganti logika ini di `src/screens/LoginScreen.js`
(fungsi `handleLogin`) dengan pemanggilan API SIRELA yang sesungguhnya begitu backend
sudah terhubung.

## Yang sudah diperbaiki (dari feedback testing)

- **Jadwal**: bug tidak bisa menambah jadwal baru sudah diperbaiki. Sekarang juga bisa
  **edit** (ketuk jadwal) dan **hapus** (tekan lama jadwal, atau lewat tombol di modal edit).
- **Jurusan**: teks kode jurusan (RPL/ULW/BD) sudah center presisi, titik hijau di kartu
  "Semua jurusan" sudah dihapus.
- **Pengaturan**: toggle "Mode gelap" sekarang beneran mengubah tema warna di seluruh
  aplikasi (lewat `src/theme/ThemeContext.js`). Toggle "Notifikasi" masih dummy karena
  fitur push notification butuh setup terpisah (`expo-notifications` + backend).
- **Login**: sekarang ada validasi (kolom kosong & kombinasi salah akan ditolak dengan
  pesan error). Tombol "Masuk dengan Google" menampilkan info bahwa fitur ini perlu
  Google Client ID dari Google Cloud Console dulu sebelum bisa aktif beneran.
- **Daftar akun**: ada validasi kolom wajib diisi dan panjang minimal kata sandi.

## Yang masih perlu dikerjakan

- Sambungkan tiap screen ke API backend SIRELA (ganti data dummy di `src/data/seed.js`
  dan `useState` di tiap screen dengan `fetch`/`axios` ke server).
- Ganti logika login demo dengan pemanggilan API asli + penyimpanan token
  (misalnya pakai `expo-secure-store` atau AsyncStorage).
- Setup Google OAuth asli lewat `expo-auth-session` kalau login Google memang dibutuhkan.
- Tambahkan loading state (spinner) saat memanggil API.
- Ganti dropdown teks biasa (Ruangan, Kelas, Jurusan) di form Tambah/Edit dengan
  komponen picker asli begitu data ruangan/kelas/jurusan sudah dari API (supaya user
  tinggal pilih, bukan ketik manual).
