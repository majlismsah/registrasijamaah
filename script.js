// === FUNGSI YANG SUDAH ADA (DARI JS LAMA) ===
// [1] Toggle Status Nikah
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
    if (status === 'Menikah') namaPasanganField.classList.remove('hidden');
    else namaPasanganField.classList.add('hidden');

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
    [pasanganFields, namaPasanganField, izinSuami, penghasilanSuami, pekerjaanSuami].forEach(el => {
      el.classList.add('hidden');
    });
  }
}

// [2] Toggle Gender
function toggleGender() {
  toggleStatusNikah();
}

// [3] Close Modal
function closeModal() {
  document.getElementById("successModal").classList.add("hidden");
}

// [4] Validasi Nomor WA
document.getElementById('no_wa').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.startsWith('0')) value = '62' + value.slice(1);
  else if (value.startsWith('8')) value = '62' + value;
  else if (!value.startsWith('62')) value = '62' + value;
  e.target.value = value;
});

// [5] Validasi Kontak Darurat
document.addEventListener('DOMContentLoaded', function() {
  const noDaruratInput = document.getElementById('no_kontak_darurat');
  if (noDaruratInput) {
    noDaruratInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.startsWith('0')) value = '62' + value.slice(1);
      else if (value.startsWith('8')) value = '62' + value;
      else if (!value.startsWith('62')) value = '62' + value;
      e.target.value = value;
    });
  }
});

// [6] Pilihan Pekerjaan
document.getElementById('pekerjaan').addEventListener('change', function() {
  const lainnya = document.getElementById('pekerjaan_lainnya');
  if (this.value === 'lainnya') {
    lainnya.classList.remove('hidden');
    lainnya.required = true;
  } else {
    lainnya.classList.add('hidden');
    lainnya.required = false;
    lainnya.value = '';
  }
});

// [7] Pilihan Pekerjaan Suami
document.getElementById('pekerjaan_suami').addEventListener('change', function() {
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

// [8] Masking Penghasilan
document.getElementById('penghasilan').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value) e.target.value = parseInt(value, 10).toLocaleString('id-ID');
});

document.getElementById('penghasilan_suami').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value) e.target.value = parseInt(value, 10).toLocaleString('id-ID');
});

// [9] Chat Admin WA
function chatAdminWA() {
  const adminNumber = "62816787977";
  const waText = encodeURIComponent(
    "Assalamualaikum, Kang Admin, saya sudah mengisi form registrasi jamaah MSAH periode 1447H."
  );
  window.open(`https://wa.me/${adminNumber}?text=${waText}`, "_blank");
}

// === FUNGSI BARU (UPLOAD & CROP) ===
let cropperKTP, cropperFoto;

// Inisialisasi Uploader
function initUploader(type, config) {
  const uploader = document.getElementById(config.uploadId);
  
  uploader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi
    if (file.size > config.maxSizeMB * 1024 * 1024) {
      alert(`Ukuran file maksimal ${config.maxSizeMB}MB!`);
      return;
    }
    if (!file.type.match('image/jpeg|image/png')) {
      alert("Hanya format JPEG/PNG yang diizinkan!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = document.getElementById(config.previewId);
      preview.src = event.target.result;

      document.getElementById(config.cropAreaId).classList.remove('hidden');
      document.getElementById(config.uploadSectionId).classList.add('hidden');

      if (window[`cropper${type}`]) window[`cropper${type}`].destroy();
      
      window[`cropper${type}`] = new Cropper(preview, {
        aspectRatio: config.aspectRatio,
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true
      });
    };
    reader.readAsDataURL(file);
  });

  // Setup Tombol
  document.getElementById(config.saveId).addEventListener('click', () => {
    if (!window[`cropper${type}`]) {
      alert("Harap pilih foto terlebih dahulu!");
      return;
    }

    const canvas = window[`cropper${type}`].getCroppedCanvas({
      width: config.width,
      height: config.height,
      fillColor: '#fff'
    });
    
    document.getElementById(config.hiddenId).value = canvas.toDataURL('image/jpeg', 0.9);
    document.getElementById(config.cropAreaId).classList.add('hidden');
    document.getElementById(config.uploadSectionId).classList.remove('hidden');
    
    showStatus(`✅ ${config.label} berhasil disimpan!`, 'success');
  });
}

// Konfigurasi Uploader
const uploadConfig = {
  KTP: {
    uploadId: 'uploadKTP',
    previewId: 'previewKTP',
    cropAreaId: 'ktpCropArea',
    uploadSectionId: 'uploadKtpSection',
    hiddenId: 'ktpHidden',
    saveId: 'saveCropKTP',
    aspectRatio: 16/9,
    width: 1000,
    height: 630,
    maxSizeMB: 5,
    label: 'KTP'
  },
  Foto: {
    uploadId: 'uploadFoto',
    previewId: 'previewFoto',
    cropAreaId: 'fotoCropArea',
    uploadSectionId: 'uploadFotoSection',
    hiddenId: 'fotoHidden',
    saveId: 'saveCropFoto',
    aspectRatio: 1,
    width: 500,
    height: 500,
    maxSizeMB: 5,
    label: 'Foto Profil'
  }
};

// Inisialisasi
Object.keys(uploadConfig).forEach(type => {
  initUploader(type, uploadConfig[type]);
});

// === SUBMIT FORM (DARI JS LAMA + OPTIMASI) ===
const form = document.getElementById('regForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const namaKTP = form.querySelector('input[name="nama_ktp"]').value.trim().replace(/\s+/g, '_').toUpperCase();
  
  showStatus("⏳ Mengirim data... Mohon tunggu.");

  // Validasi
  if (!document.getElementById('ktpHidden').value || !document.getElementById('fotoHidden').value) {
    showStatus("❌ Harap upload dan crop kedua foto terlebih dahulu!", 'error');
    return;
  }

  // Kirim data
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbz0TnKIPKOhp-cgutt2LH3MlxTKQcnzVWOPP12iLSM4RrbMerqMXhjdcjI_DVdkFNyO/exec", {
      method: "POST",
      body: formData
    });

    const result = await response.text();
    if (result === "Success") {
      form.reset();
      document.getElementById("successModal").classList.remove("hidden");
      showStatus("");
    } else {
      showStatus("❌ Terjadi kesalahan. Silakan coba lagi.", 'error');
    }
  } catch (error) {
    showStatus(`❌ Gagal mengirim: ${error.message || 'Periksa koneksi'}`, 'error');
    console.error("Submit Error:", error);
  }
});

// Fungsi Bantu
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = type === 'error' 
    ? `<span class="text-red-600">${message}</span>`
    : `<span class="text-blue-600">${message}</span>`;
  if (message) setTimeout(() => statusEl.innerHTML = '', 5000);
}

// Inisialisasi Awal
document.addEventListener('DOMContentLoaded', () => {
  toggleStatusNikah();
});
