// ====================================================================
// =================== LOGIKA FORM REGISTRASI MSAH ====================
// ====================================================================

// --- TOGGLE TAMPILAN BERDASARKAN STATUS PERNIKAHAN DAN GENDER ---
function toggleStatusNikah() {
  const status = document.getElementById('status_nikah').value;
  const gender = document.getElementById('jenis_kelamin').value;
  
  const isMenikah = status === 'Menikah';
  const isCerai = status === 'Cerai Hidup' || status === 'Cerai Mati';
  const isMenikahAtauCerai = isMenikah || isCerai;
  const isPerempuanMenikah = isMenikah && gender === 'Perempuan';

  // Logika untuk menampilkan field Jumlah Anak & Keluarga
  document.getElementById('pasangan-fields').classList.toggle('hidden', !isMenikahAtauCerai);

  // Logika untuk menampilkan Nama Pasangan (hanya saat status Menikah)
  document.getElementById('nama_pasangan_field').classList.toggle('hidden', !isMenikah);

  // Logika untuk menampilkan field-field khusus Perempuan yang Menikah
  document.getElementById('izin_suami_field').classList.toggle('hidden', !isPerempuanMenikah);
  document.getElementById('pekerjaan_suami_field').classList.toggle('hidden', !isPerempuanMenikah);
  document.getElementById('penghasilan_suami_field').classList.toggle('hidden', !isPerempuanMenikah);
}


// --- VALIDASI NOMOR WHATSAPP ---
function formatPhoneNumber(inputElement) {
  let value = inputElement.value.replace(/\D/g, ''); // Hapus semua non-digit

  if (value.startsWith('0')) {
    value = '62' + value.slice(1);
  } else if (value.startsWith('8')) {
    value = '62' + value;
  } else if (!value.startsWith('62')) {
    // Jika tidak dimulai dengan 62 atau 0/8, tambahkan 62
    value = '62' + value;
  }
  inputElement.value = value;
}


// --- TOGGLE INPUT LAINNYA UNTUK PEKERJAAN ---
function toggleOtherJobInput(selectId, otherInputId) {
  const selectElement = document.getElementById(selectId);
  const otherInputElement = document.getElementById(otherInputId);

  if (selectElement.value === 'lainnya') {
    otherInputElement.classList.remove('hidden');
    otherInputElement.required = true;
  } else {
    otherInputElement.classList.add('hidden');
    otherInputElement.required = false;
    otherInputElement.value = '';
  }
}


// --- FORMAT MASKING UNTUK PENGHASILAN ---
function formatCurrency(inputElement) {
  let value = inputElement.value.replace(/\D/g, '');
  if (value) {
    value = parseInt(value, 10).toLocaleString('id-ID');
  }
  inputElement.value = value;
}


// --- LOGIKA UTAMA CROPPER FOTO ---
function initializeCropper(fileInputId, uploadSectionId, cropSectionId, imagePreviewId, resultSectionId, croppedResultId, croppedImageDataId, rotateLeftId, rotateRightId, resetCropId, cancelCropId, saveCropId, changePhotoId, aspectRatio) {
  const fileInput = document.getElementById(fileInputId);
  const uploadSection = document.getElementById(uploadSectionId);
  const cropSection = document.getElementById(cropSectionId);
  const imagePreview = document.getElementById(imagePreviewId);
  const resultSection = document.getElementById(resultSectionId);
  const croppedResult = document.getElementById(croppedResultId);
  const croppedImageData = document.getElementById(croppedImageDataId);
  const rotateLeftBtn = document.getElementById(rotateLeftId);
  const rotateRightBtn = document.getElementById(rotateRightId);
  const resetCropBtn = document.getElementById(resetCropId);
  const cancelCropBtn = document.getElementById(cancelCropId);
  const saveCropBtn = document.getElementById(saveCropId);
  const changePhotoBtn = document.getElementById(changePhotoId);

  let cropperInstance;

  function showUpload() {
    uploadSection.classList.remove('hidden');
    cropSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    fileInput.value = null;
    croppedImageData.value = '';
    if (cropperInstance) {
      cropperInstance.destroy();
      cropperInstance = null;
    }
  }

  function showCrop(imageData) {
    uploadSection.classList.add('hidden');
    cropSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    imagePreview.src = imageData;
    if (cropperInstance) {
      cropperInstance.destroy();
    }
    cropperInstance = new Cropper(imagePreview, {
      aspectRatio: aspectRatio,
      viewMode: 1,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: false,
    });
  }

  function showResult(imageData) {
    uploadSection.classList.add('hidden');
    cropSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    const img = document.createElement('img');
    img.src = imageData;
    img.classList.add('w-full', 'rounded');
    croppedResult.innerHTML = '';
    croppedResult.appendChild(img);
    croppedImageData.value = imageData;
  }

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        showCrop(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  rotateLeftBtn.addEventListener('click', () => { if (cropperInstance) cropperInstance.rotate(-90); });
  rotateRightBtn.addEventListener('click', () => { if (cropperInstance) cropperInstance.rotate(90); });
  resetCropBtn.addEventListener('click', () => { if (cropperInstance) cropperInstance.reset(); });
  cancelCropBtn.addEventListener('click', () => { showUpload(); });
  saveCropBtn.addEventListener('click', () => {
    if (cropperInstance) {
      const croppedCanvas = cropperInstance.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedDataUrl = croppedCanvas.toDataURL('image/jpeg');
        showResult(croppedDataUrl);
      }
    }
  });
  changePhotoBtn.addEventListener('click', () => { showUpload(); });
  
  // Panggil showUpload() di awal
  showUpload();
}


// --- SUBMIT FORM & KIRIM DATA ---
const form = document.getElementById('regForm');
const statusText = document.getElementById('status');
function closeModal() {
  document.getElementById("successModal").classList.add("hidden");
}
function chatAdminWA() {
  const adminNumber = "62816787977";
  const waText = encodeURIComponent(
    "Assalamualaikum, Kang Admin, saya sudah mengisi form registrasi jamaah MSAH periode 1447H."
  );
  window.open(`https://wa.me/${adminNumber}?text=${waText}`, "_blank");
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  const namaKTP = form.querySelector('input[name="nama_ktp"]').value.trim().replace(/\s+/g, '_').toUpperCase();
  statusText.innerText = "⏳ Mengirim data... Mohon tunggu.";
  
  // Ambil data form selain file
  const formElements = form.querySelectorAll('input:not([type="file"]), select, textarea');
  formElements.forEach(element => {
    if (element.name && element.value) {
      formData.append(element.name, element.value);
    }
  });

  // Ambil hasil crop dari hidden input
  const croppedKTP = document.getElementById('ktpCroppedImageData').value;
  const croppedFoto = document.getElementById('fotoCroppedImageData').value;

  if (croppedKTP) {
    formData.append('ktp_file', croppedKTP.split(',')[1]);
    formData.append('ktp_file_name', `${namaKTP}_KTP.jpg`);
    formData.append('ktp_file_type', 'image/jpeg');
  }

  if (croppedFoto) {
    formData.append('foto_file', croppedFoto.split(',')[1]);
    formData.append('foto_file_name', `${namaKTP}_FOTO.jpg`);
    formData.append('foto_file_type', 'image/jpeg');
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbz0TnKIPKOhp-cgutt2LH3MlxTKQcnzVWOPP12iLSM4RrbMerqMXhjdcjI_DVdkFNyO/exec", {
      method: "POST",
      body: formData
    });

    const result = await response.text();

    if (result === "Success") {
      form.reset();
      document.getElementById("successModal").classList.remove("hidden");
      statusText.innerText = "";
    } else {
      statusText.innerText = "❌ Terjadi kesalahan. Silakan coba lagi.";
    }

  } catch (error) {
    console.error(error);
    statusText.innerText = "❌ Gagal mengirim data. Silakan periksa koneksi Anda.";
  }
});


// ====================================================================
// ==================== INISIALISASI PADA AWAL LOAD ===================
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi cropper untuk KTP (aspek rasio 16:9)
  initializeCropper(
    'ktpFileInput', 'ktpUploadSection', 'ktpCropSection', 'ktpImagePreview',
    'ktpResultSection', 'ktpCroppedResult', 'ktpCroppedImageData',
    'ktpRotateLeft', 'ktpRotateRight', 'ktpResetCrop', 'ktpCancelCrop',
    'ktpSaveCrop', 'ktpChangePhoto', 16 / 9
  );

  // Inisialisasi cropper untuk Foto Profil (aspek rasio 1:1)
  initializeCropper(
    'fotoFileInput', 'fotoUploadSection', 'fotoCropSection', 'fotoImagePreview',
    'fotoResultSection', 'fotoCroppedResult', 'fotoCroppedImageData',
    'fotoRotateLeft', 'fotoRotateRight', 'fotoResetCrop', 'fotoCancelCrop',
    'fotoSaveCrop', 'fotoChangePhoto', 1
  );

  // Menambahkan event listener ke elemen-elemen form
  document.getElementById('status_nikah').addEventListener('change', toggleStatusNikah);
  document.getElementById('jenis_kelamin').addEventListener('change', toggleStatusNikah);
  document.getElementById('pekerjaan').addEventListener('change', () => toggleOtherJobInput('pekerjaan', 'pekerjaan_lainnya'));
  document.getElementById('pekerjaan_suami').addEventListener('change', () => toggleOtherJobInput('pekerjaan_suami', 'pekerjaan_suami_lainnya'));
  document.getElementById('no_wa').addEventListener('input', (e) => formatPhoneNumber(e.target));
  document.getElementById('no_kontak_darurat').addEventListener('input', (e) => formatPhoneNumber(e.target));
  document.getElementById('penghasilan').addEventListener('input', (e) => formatCurrency(e.target));
  document.getElementById('penghasilan_suami').addEventListener('input', (e) => formatCurrency(e.target));

  // Panggil fungsi inisialisasi untuk memastikan tampilan awal sudah benar
  toggleStatusNikah();
});
