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

// === VALIDASI NO KONTAK DARURAT ===
document.addEventListener('DOMContentLoaded', function() {
  const noDaruratInput = document.getElementById('no_kontak_darurat');
  if (noDaruratInput) {
    noDaruratInput.addEventListener('input', function(e) {
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
  }
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
    lainnya.value = '';
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

// === MASKING Penghasilan Pribadi ===
document.getElementById('penghasilan').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value) {
    value = parseInt(value, 10).toLocaleString('id-ID');
  }
  e.target.value = value;
});

// === MASKING Penghasilan Suami ===
document.getElementById('penghasilan_suami').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value) {
    value = parseInt(value, 10).toLocaleString('id-ID');
  }
  e.target.value = value;
});

// === KONFIR KE ADMIN ===
function chatAdminWA() {
  const adminNumber = "62816787977";
  const waText = encodeURIComponent(
    "Assalamualaikum, Kang Admin, saya sudah mengisi form registrasi jamaah MSAH periode 1447H."
  );
  window.open(`https://wa.me/${adminNumber}?text=${waText}`, "_blank");
}

// ==================== KTP UPLOAD & CROP ====================
let cropperKTP;
const uploadKTP = document.getElementById('uploadKTP');
const previewKTP = document.getElementById('previewKTP');
const ktpCropArea = document.getElementById('ktpCropArea');
const uploadKtpSection = document.getElementById('uploadKtpSection');

uploadKTP.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validasi file
  if (file.size > 5 * 1024 * 1024) {
    alert("Ukuran file maksimal 5MB!");
    return;
  }
  if (!file.type.match('image/jpeg|image/png')) {
    alert("Hanya format JPEG/PNG yang diizinkan!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    previewKTP.src = event.target.result;
    ktpCropArea.classList.remove('hidden');
    uploadKtpSection.classList.add('hidden');

    if (cropperKTP) cropperKTP.destroy();
    cropperKTP = new Cropper(previewKTP, {
      aspectRatio: 16 / 9,
      viewMode: 1,
      autoCropArea: 0.8
    });
  };
  reader.readAsDataURL(file);
});

// Tombol di Crop Area KTP
document.getElementById('rotateLeftKTP').addEventListener('click', () => cropperKTP.rotate(-90));
document.getElementById('rotateRightKTP').addEventListener('click', () => cropperKTP.rotate(90));
document.getElementById('resetCropKTP').addEventListener('click', () => cropperKTP.reset());
document.getElementById('cancelCropKTP').addEventListener('click', () => {
  ktpCropArea.classList.add('hidden');
  uploadKtpSection.classList.remove('hidden');
  uploadKTP.value = '';
});
document.getElementById('saveCropKTP').addEventListener('click', () => {
  const canvas = cropperKTP.getCroppedCanvas({ width: 1000, height: 630 });
  document.getElementById('ktpHidden').value = canvas.toDataURL('image/jpeg');
  ktpCropArea.classList.add('hidden');
  uploadKtpSection.classList.remove('hidden');
});

// ==================== FOTO PROFIL UPLOAD & CROP ====================
let cropperFoto;
const uploadFoto = document.getElementById('uploadFoto');
const previewFoto = document.getElementById('previewFoto');
const fotoCropArea = document.getElementById('fotoCropArea');
const uploadFotoSection = document.getElementById('uploadFotoSection');

uploadFoto.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024 || !file.type.match('image/jpeg|image/png')) {
    alert("File tidak valid! Maks 5MB, format JPEG/PNG.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    previewFoto.src = event.target.result;
    fotoCropArea.classList.remove('hidden');
    uploadFotoSection.classList.add('hidden');

    if (cropperFoto) cropperFoto.destroy();
    cropperFoto = new Cropper(previewFoto, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 0.8
    });
  };
  reader.readAsDataURL(file);
});

// Tombol di Crop Area Foto Profil
document.getElementById('rotateLeftFoto').addEventListener('click', () => cropperFoto.rotate(-90));
document.getElementById('rotateRightFoto').addEventListener('click', () => cropperFoto.rotate(90));
document.getElementById('resetCropFoto').addEventListener('click', () => cropperFoto.reset());
document.getElementById('cancelCropFoto').addEventListener('click', () => {
  fotoCropArea.classList.add('hidden');
  uploadFotoSection.classList.remove('hidden');
  uploadFoto.value = '';
});
document.getElementById('saveCropFoto').addEventListener('click', () => {
  const canvas = cropperFoto.getCroppedCanvas({ width: 500, height: 500 });
  document.getElementById('fotoHidden').value = canvas.toDataURL('image/jpeg');
  fotoCropArea.classList.add('hidden');
  uploadFotoSection.classList.remove('hidden');
});

// === HANDLE SUBMIT FORM ===
const form = document.getElementById('regForm');
const statusText = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 1. Prepare Form Data
  const formData = new FormData(form);
  const namaKTP = form.querySelector('input[name="nama_ktp"]').value.trim().replace(/\s+/g, '_').toUpperCase();
  
  // 2. Show Loading State
  statusText.innerHTML = `
    <div class="flex items-center justify-center">
      <svg class="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Mengirim data...
    </div>
  `;

  // 3. Validate Cropped Images
  const croppedKTP = document.getElementById('ktpHidden').value;
  const croppedFoto = document.getElementById('fotoHidden').value;

  if (!croppedKTP) {
    statusText.innerText = "❌ Harap upload dan crop foto KTP terlebih dahulu!";
    document.getElementById('uploadKtpSection').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (!croppedFoto) {
    statusText.innerText = "❌ Harap upload dan crop foto profil terlebih dahulu!";
    document.getElementById('uploadFotoSection').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // 4. Append Cropped Images
  const timestamp = Date.now();
  formData.append('ktp_file', croppedKTP.split(',')[1]);
  formData.append('ktp_file_name', `${namaKTP}_KTP_${timestamp}.jpg`);
  formData.append('ktp_file_type', 'image/jpeg');

  formData.append('foto_file', croppedFoto.split(',')[1]);
  formData.append('foto_file_name', `${namaKTP}_PROFIL_${timestamp}.jpg`);
  formData.append('foto_file_type', 'image/jpeg');

  // 5. Submit to Google Apps Script
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbz0TnKIPKOhp-cgutt2LH3MlxTKQcnzVWOPP12iLSM4RrbMerqMXhjdcjI_DVdkFNyO/exec", {
      method: "POST",
      body: formData
    });

    const result = await response.text();

    // 6. Handle Response
    if (result === "Success") {
      form.reset();
      document.getElementById("successModal").classList.remove("hidden");
      statusText.innerText = "";
    } else {
      statusText.innerText = "❌ Terjadi kesalahan. Silakan coba lagi atau hubungi admin.";
    }
  } catch (error) {
    console.error("Submit Error:", error);
    statusText.innerHTML = `
      ❌ Gagal mengirim data. 
      <span class="text-sm block mt-1">${error.message || 'Periksa koneksi internet Anda'}</span>
    `;
  }
});

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
  toggleStatusNikah();
});
