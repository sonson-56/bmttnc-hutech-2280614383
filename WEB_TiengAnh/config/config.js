module.exports = {
    // ... các config hiện có
    googleCloud: {
        speechToText: {
            apiKey: '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', // Thay bằng API key thực của bạn
            languageCode: 'en-US' // Ngôn ngữ tiếng Anh
        }
    },

    jwt: {
      secret: process.env.JWT_SECRET || 'your-256-bit-secret',
      expiresIn: '1h',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      refreshExpiresIn: '7d'
    }
    
  
  };