// === STATUS PERNIKAHAN ===
function toggleStatusNikah() {
  const status = document.getElementById('status_nikah').value;
  const pasanganFields = document.getElementById('pasangan-fields');
  const namaPasanganField = document.getElementById('nama_pasangan_field');
  const izinSuami = document.getElementById('izin_suami_field');
  const penghasilanSuami = document.getElementById('penghasilan_suami_field');
  const pekerjaanSuami = document.getElementById('pekerjaan_suami_field');
  const gender = document.getElementById('jenis_kelamin').value;

  if (status === 'Menikah' || status === 'Cerai Hidup' || status === 'Cerai Mati') {
    pasanganFields.classList.remove('hidden');

    if (status === 'Menikah') {
      namaPasanganField.classList.remove('hidden');
    } else {
      namaPasanganField.classList.add('hidden');
    }

    if (status === 'Menikah' && gender === 'Perempuan') {
      izinSuami.classList.remove('hidden');
      penghasilanSuami.classList.remove('hidden');
      pekerjaanSuami.classList.remove('hidden');
    } else {
      izinSuami.classList.add('hidden');
      penghasilanSuami.classList.add('hidden');
      pekerjaanSuami.classList.add('hidden');
    }

  } else {
    pasanganFields.classList.add('hidden');
    namaPasanganField.classList.add('hidden');
    izinSuami.classList.add('hidden');
    penghasilanSuami.classList.add('hidden');
    pekerjaanSuami.classList.add('hidden');
  }
}

// === TOGGLE GENDER ===
function toggleGender() {
  toggleStatusNikah();
}

// === CLOSE MODAL ===
function closeModal() {
  document.getElementById("successModal").classList.add("hidden");
}

// === VALIDASI NO WA ===
const noWaInput = document.getElementById('no_wa');
noWaInput.addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.startsWith('0')) {
    value = '62' + value.slice(1);
  } else if (value.startsWith('8')) {
    value = '62' + value;
  } else if (!value.startsWith('62')) {
    value = '62' + value;
  }
  e.target.value = value;
});

// === PILIHAN PEKERJAAN PRIBADI ===
document.getElementById('pekerjaan').addEventListener('change', function () {
  const lainnya = document.getElementById('pekerjaan_lainnya');
  if (this.value === 'lainnya') {
    lainnya.classList.remove('hidden');
    lainnya.required = true;
  } else {
    lainnya.classList.add('hidden');
    lainnya.required = false;
  }
});

// === PILIHAN PENGHASILAN PRIBADI ===
document.getElementById('penghasilan').addEventListener('change', function () {
  const lainnyaField = document.getElementById('penghasilan_lainnya_field');
  const inputLainnya = document.getElementById('penghasilan_lainnya');
  if (this.value === 'lainnya') {
    lainnyaField.classList.remove('hidden');
    inputLainnya.required = true;
  } else {
    lainnyaField.classList.add('hidden');
    inputLainnya.required = false;
    inputLainnya.value = '';
  }
});

// === PILIHAN PEKERJAAN SUAMI ===
document.getElementById('pekerjaan_suami').addEventListener('change', function () {
  const inputLainnya = document.getElementById('pekerjaan_suami_lainnya');
  if (this.value === 'lainnya') {
    inputLainnya.classList.remove('hidden');
    inputLainnya.required = true;
  } else {
    inputLainnya.classList.add('hidden');
    inputLainnya.required = false;
    inputLainnya.value = '';
  }
});

// === PILIHAN PENGHASILAN SUAMI ===
document.getElementById('penghasilan_suami').addEventListener('change', function () {
  const lainnyaField = document.getElementById('penghasilan_suami_lainnya_field');
  const inputLainnya = document.getElementById('penghasilan_suami_lainnya');
  if (this.value === 'lainnya') {
    lainnyaField.classList.remove('hidden');
    inputLainnya.required = true;
  } else {
    lainnyaField.classList.add('hidden');
    inputLainnya.required = false;
    inputLainnya.value = '';
  }
});

// === HANDLE SUBMIT FORM ===
const form = document.getElementById('regForm');
const statusText = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  statusText.innerText = "⏳ Mengirim data... Mohon tunggu.";

  const ktpFile = form.querySelector('input[name="ktp_file"]').files[0];
  const fotoFile = form.querySelector('input[name="foto_file"]').files[0];

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

  if (ktpFile) {
    formData.append('ktp_file_name', ktpFile.name);
    formData.append('ktp_file_type', ktpFile.type);
    formData.append('ktp_file', await toBase64(ktpFile));
  }

  if (fotoFile) {
    formData.append('foto_file_name', fotoFile.name);
    formData.append('foto_file_type', fotoFile.type);
    formData.append('foto_file', await toBase64(fotoFile));
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxsiog_Uy34zbh6HCi_SRC8hgUr1Mpjc1ZPOaLz-FwiMsQ00zDoEwX8Za05l2NTH9Pf/exec", {
      method: "POST",
      body: formData
    });

    const result = await response.text();

    if (result === "Success") {
      form.reset();
      document.getElementById("successModal").classList.remove("hidden");
      statusText.innerText = "";
      // === DIRECT KE WHATSAPP ADMIN ===
      const adminNumber = "62816787977"; // Ganti dengan nomor admin kamu
      const waText = encodeURIComponent("Assalamualaikum, Kang Admin, saya sudah mengisi form registrasi jamaah MSAH perioder 1147H.");
      window.open(`https://wa.me/${adminNumber}?text=${waText}`, "_blank");
    }
    } else {
      statusText.innerText = "❌ Terjadi kesalahan. Silakan coba lagi.";
    }
  } catch (error) {
    console.error(error);
    statusText.innerText = "❌ Gagal mengirim data. Silakan periksa koneksi Anda.";
  }
});
