import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  initialRooms,
  initialClasses,
  initialMajors,
  initialSchedule,
  DAYS,
} from "../data/seed";
import { SUBJECT_COLORS } from "../theme/colors";
import {
  checkLogin,
  findAccount,
  listAccounts,
  addAdminAccount,
  deleteAdminAccount,
  changePassword,
} from "../data/authState";

const AppDataContext = createContext(null);

// Sekolah cuma masuk Senin-Jumat. Date.getDay(): 0=Minggu, 1=Senin, ..., 6=Sabtu.
const JS_DAY_TO_DAY_KEY = { 1: "Sen", 2: "Sel", 3: "Rab", 4: "Kam", 5: "Jum" };

function getTodayKey() {
  return JS_DAY_TO_DAY_KEY[new Date().getDay()] || null; // null kalau Sabtu/Minggu
}

// Ubah "07:00" atau "07.00" jadi total menit sejak jam 00:00.
function parseTimeToMinutes(raw) {
  const clean = raw.trim().replace(".", ":");
  const [h, m] = clean.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h)) return null;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}

// Cek apakah ruangan sedang dipakai SEKARANG: ada jadwal hari ini untuk ruangan
// tsb dan jam sekarang berada di antara jam mulai (inklusif) dan jam selesai (eksklusif).
function isRoomBusyNow(schedule, roomName) {
  const todayKey = getTodayKey();
  if (!todayKey) return false;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const items = schedule[todayKey] || [];
  return items.some((item) => {
    if (item.room !== roomName || !item.time) return false;
    const [startRaw, endRaw] = item.time.split(" - ");
    if (!startRaw || !endRaw) return false;
    const start = parseTimeToMinutes(startRaw);
    const end = parseTimeToMinutes(endRaw);
    if (start === null || end === null) return false;
    return nowMinutes >= start && nowMinutes < end;
  });
}

export function AppDataProvider({ children }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [classes, setClasses] = useState(initialClasses);
  const [majors, setMajors] = useState(initialMajors);
  const [schedule, setSchedule] = useState(initialSchedule);

  // Dipakai buat memicu ulang perhitungan status ruangan tiap menit,
  // supaya "Terpakai"/"Kosong" ikut berubah otomatis waktu jam jadwal
  // mulai/berakhir, tanpa perlu keluar-masuk layar.
  const [clockTick, setClockTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setClockTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // --- Auth / akun yang sedang login ---
  // currentUser null berarti belum ada yang login. Bentuknya:
  // { name, username, role } -- role: "Admin" | "User".
  const [currentUser, setCurrentUser] = useState(null);
  const [admins, setAdmins] = useState(() => listAccounts());

  const login = (username, password) => {
    if (!checkLogin(username, password)) {
      return { success: false, message: "Nama pengguna atau kata sandi salah." };
    }
    const account = findAccount(username);
    setCurrentUser({ name: account.name, username: account.username, role: account.role });
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Cuma dipanggil dari alur yang sudah dijaga role Admin di layar Pengaturan.
  // Akun baru selalu dibuat sebagai "User" -- tidak ada pilihan peran.
  const addAdmin = (name, username, password, role = "User") => {
    const result = addAdminAccount(name, username, password, role);
    if (result.success) setAdmins(listAccounts());
    return result;
  };

  const deleteAdmin = (username) => {
    const result = deleteAdminAccount(username);
    if (result.success) setAdmins(listAccounts());
    return result;
  };

  // Berlaku untuk akun yang sedang login (dipanggil dari "Ubah kata sandi").
  const changeMyPassword = (oldPassword, newPassword) => {
    if (!currentUser) {
      return { success: false, message: "Belum ada akun yang login." };
    }
    return changePassword(currentUser.username, oldPassword, newPassword);
  };

  // --- Ruangan ---
  // Catatan: field "status" yang tersimpan di sini sudah tidak dipakai untuk
  // ditampilkan -- status "Kosong"/"Terpakai" sekarang dihitung otomatis di
  // roomsWithLiveStatus, berdasarkan ada-tidaknya jadwal yang sedang berlangsung
  // untuk ruangan tsb. Jadi addRoom tidak perlu (dan tidak boleh) menerima status manual lagi.
  const addRoom = (room) => {
    setRooms((prev) => [...prev, { id: Date.now().toString(), person: "", ...room }]);
  };
  const emptyRoom = (roomId) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, info: "Belum ada kelas", person: "" } : r))
    );
  };
  const removeRoom = (roomId) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  // Ruangan yang benar-benar dikirim ke layar: status dihitung ulang tiap kali
  // rooms/schedule berubah, atau tiap 1 menit lewat clockTick.
  const roomsWithLiveStatus = useMemo(() => {
    return rooms.map((r) => ({
      ...r,
      status: isRoomBusyNow(schedule, r.name) ? "Terpakai" : "Kosong",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, schedule, clockTick]);

  // --- Kelas ---
  const addClass = (cls) => {
    setClasses((prev) => [...prev, { id: Date.now().toString(), ...cls }]);
  };
  const removeClass = (classId) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  // --- Jurusan ---
  const addMajor = (name) => {
    setMajors((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        code: name.slice(0, 3).toUpperCase(),
        color: SUBJECT_COLORS[prev.length % SUBJECT_COLORS.length],
      },
    ]);
  };
  const removeMajor = (majorId) => {
    setMajors((prev) => prev.filter((m) => m.id !== majorId));
  };
  // Kalau jurusan dihapus, kelas-kelas yang masih mereferensikan nama jurusan itu
  // ikut dikosongkan field major-nya, supaya tidak ada kelas "yatim" yang masih
  // menampilkan nama jurusan yang sudah tidak ada di daftar Jurusan.
  const clearMajorForClasses = (majorName) => {
    setClasses((prev) => prev.map((c) => (c.major === majorName ? { ...c, major: "" } : c)));
  };
  // Jumlah kelas aktif per jurusan dihitung otomatis dari data Kelas (bukan angka manual).
  const majorsWithCount = useMemo(
    () =>
      majors.map((m) => ({
        ...m,
        classCount: classes.filter((c) => c.major === m.name).length,
      })),
    [majors, classes]
  );

  // --- Jadwal ---
  const addScheduleItem = (day, item) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { id: Date.now().toString(), ...item }],
    }));
  };
  const updateScheduleItem = (day, itemId, patch) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
    }));
  };
  const deleteScheduleItem = (day, itemId) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((it) => it.id !== itemId),
    }));
  };
  // Kalau ruangan dikosongkan, jadwal yang pakai ruangan itu pada hari ini ikut dihapus
  // (biar konsisten dengan data ruangan, sesuai deskripsi di modal konfirmasi Ruangan).
  const clearScheduleForRoom = (roomName) => {
    setSchedule((prev) => {
      const next = {};
      for (const day of DAYS) {
        next[day] = (prev[day] || []).filter((it) => it.room !== roomName);
      }
      return next;
    });
  };
  // Kalau kelas dihapus, jadwal yang pakai kelas itu ikut dihapus juga.
  const clearScheduleForClass = (className) => {
    setSchedule((prev) => {
      const next = {};
      for (const day of DAYS) {
        next[day] = (prev[day] || []).filter((it) => it.className !== className);
      }
      return next;
    });
  };

  const value = {
    rooms: roomsWithLiveStatus,
    classes,
    majors: majorsWithCount,
    schedule,
    addRoom,
    emptyRoom: (roomId, roomName) => {
      emptyRoom(roomId);
      clearScheduleForRoom(roomName);
    },
    deleteRoom: (roomId, roomName) => {
      removeRoom(roomId);
      clearScheduleForRoom(roomName);
    },
    addClass,
    deleteClass: (classId, className) => {
      removeClass(classId);
      clearScheduleForClass(className);
    },
    addMajor,
    deleteMajor: (majorId, majorName) => {
      removeMajor(majorId);
      clearMajorForClasses(majorName);
    },
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,

    // Auth & manajemen akun
    currentUser,
    login,
    logout,
    admins,
    addAdmin,
    deleteAdmin,
    changeMyPassword,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}