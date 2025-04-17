// controllers/client/home.controller.js

exports.renderHomePage = (req, res) => {
    res.render('client/pages/home', {
      title: 'Trang chủ',
      user: req.user || null
    });
  };
  
  exports.renderDashboard = (req, res) => {
    res.render('client/pages/dashboard', {
      title: 'Bảng điều khiển',
      user: req.user // Đã được middleware verifyToken xử lý
    });
  };
  
  // Nếu sau này có API thì dùng cái này
  exports.getHomeStats = async (req, res) => {
    try {
      // Ví dụ gọi từ service layer
      const stats = await someService.getStats(); 
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi hệ thống' });
    }
  };
  