const mongoose = require('mongoose');

module.exports.connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Web_HocTA');
        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error);
        process.exit(1); 
    }
};

