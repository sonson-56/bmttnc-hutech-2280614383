const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage(); // hoặc dùng diskStorage để lưu file ra ổ cứng
const upload = multer({ storage });
// Cấu hình lưu trữ file ảnh (giữ nguyên như cũ)
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/admin/img/uploads_reading_TOEIC/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Cấu hình lưu trữ file audio (thêm mới)
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/audio/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Lọc file ảnh (giữ nguyên)
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ được upload file ảnh!'), false);
  }
};

// Lọc file audio (thêm mới)
const audioFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ được upload file audio!'), false);
  }
};

// Khởi tạo multer cho từng loại
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Xuất các middleware
module.exports = {
  // Middleware upload ảnh (giữ nguyên)
  uploadImage: uploadImage.single.bind(uploadImage),
  uploadImageArray: uploadImage.array.bind(uploadImage),
  uploadImageFields: uploadImage.fields.bind(uploadImage),
  
  // Middleware upload audio (thêm mới)
  uploadAudio: uploadAudio.single.bind(uploadAudio),
  
  // Các phương thức khác nếu cần
};