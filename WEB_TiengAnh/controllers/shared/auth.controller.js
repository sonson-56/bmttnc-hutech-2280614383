const User = require('../../models/shared/user.model');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { googleCloud } = require('../../config/config');
const SpeechToText = require('../../models/TOEIC/speechToText.model');
const { SpeechClient } = require('@google-cloud/speech').v1;
// Render trang đăng ký (GET)
exports.showRegister = (req, res) => {
  res.render('client/pages/register'); // Render file signup.pug
};

// Xử lý đăng ký (POST)
exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    // Đăng ký thành công -> chuyển hướng đến trang login
    res.redirect('login');
  } catch (error) {
    // Render lại trang đăng ký với thông báo lỗi
    res.render('client/pages/register', { error: 'Đăng ký thất bại: ' + error.message });
  }
};

// Render trang đăng nhập (GET)
exports.showLogin = (req, res) => {
  res.render('client/pages/login'); // Render file login.pug
};

// Xử lý đăng nhập (POST)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.render('client/pages/login', { error: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo token và lưu vào cookie
    const token = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    
    // Chuyển hướng sau khi đăng nhập thành công
    res.redirect('/dashboard');
  } catch (error) {
    res.render('client/pages/login', { error: 'Lỗi hệ thống: ' + error.message });
  }
};



//Logout controller
exports.logout = (req, res) => {
  // Xóa cookie token
  res.clearCookie('token', {
    httpOnly: true,
    // Thêm các options giống khi bạn set cookie
    // secure: true, // Nếu dùng HTTPS
    // sameSite: 'strict'
  });
  
  // Thêm header để ngăn cache trình duyệt
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Chuyển hướng đến trang login
  res.redirect('/login');
}
exports.showLogout = (req, res) => {
  res.render('client/pages/login'); // Render file login.pug
};
exports.convertSpeechToText = async (req, res, next) => {
  try {
      // Khởi tạo client Google Speech-to-Text
      const client = new SpeechClient({
          key: googleCloud.speechToText.apiKey
      });

      // Xử lý file audio từ request (giả sử sử dụng upload.middleware)
      const audioFile = req.file;
      if (!audioFile) {
          return res.status(400).json({ error: 'No audio file provided' });
      }

      // Cấu hình request
      const audio = {
          content: audioFile.buffer.toString('base64'),
      };
      const config = {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: googleCloud.speechToText.languageCode,
      };
      const request = {
          audio: audio,
          config: config,
      };

      // Gọi API Google Speech-to-Text
      const [response] = await client.recognize(request);
      const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');

      // Lưu kết quả vào database
      const newConversion = new SpeechToText({
          userId: req.user.id,
          originalAudio: audioFile.path,
          convertedText: transcription,
          language: googleCloud.speechToText.languageCode
      });
      await newConversion.save();

      res.json({
          success: true,
          text: transcription,
          conversionId: newConversion._id
      });
  } catch (error) {
      next(error);
  }
};

exports.getConversionHistory = async (req, res, next) => {
  try {
      const conversions = await SpeechToText.find({ userId: req.user.id })
          .sort({ createdAt: -1 });
      res.json({ success: true, data: conversions });
  } catch (error) {
      next(error);
  }
};