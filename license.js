const axios = require('axios');
const chalk = require('chalk');

/**
 * License verification module
 * Checks license key against api.iamemre.dev
 */
class LicenseManager {
  constructor(licenseKey) {
    this.licenseKey = licenseKey;
    this.apiUrl = 'https://api.iamemre.dev/check';
    this.isValid = false;
  }

  /**
   * Verify license key with the API
   * @returns {Promise<boolean>} true if license is valid
   */
  async verify() {
    try {
      console.log(chalk.cyan('🔐 Lisans kontrolü yapılıyor...'));
      
      const response = await axios.get(this.apiUrl, {
        params: { key: this.licenseKey },
        timeout: 10000,
        headers: {
          'User-Agent': 'Discord-Token-Joiner/1.0'
        }
      });

      // Check if the response is successful
      if (response.status === 200 && response.data) {
        // Assuming the API returns a success indicator
        const isValid = response.data.valid === true || 
                       response.data.status === 'valid' || 
                       response.data.success === true;
        
        this.isValid = isValid;
        
        if (isValid) {
          console.log(chalk.green('✅ Lisans başarıyla doğrulandı!'));
          if (response.data.expires) {
            console.log(chalk.yellow(`⏰ Lisans bitiş tarihi: ${response.data.expires}`));
          }
          if (response.data.user) {
            console.log(chalk.blue(`👤 Kullanıcı: ${response.data.user}`));
          }
          return true;
        } else {
          console.log(chalk.red('❌ Geçersiz lisans anahtarı!'));
          console.log(chalk.yellow('💡 Lütfen geçerli bir lisans anahtarı ile tekrar deneyin.'));
          return false;
        }
      } else {
        console.log(chalk.red('❌ Lisans API\'sinden geçersiz yanıt alındı!'));
        return false;
      }
    } catch (error) {
      if (error.response) {
        // API responded with error status
        console.log(chalk.red(`❌ Lisans doğrulama hatası: ${error.response.status}`));
        if (error.response.data && error.response.data.message) {
          console.log(chalk.yellow(`📝 Mesaj: ${error.response.data.message}`));
        }
      } else if (error.request) {
        // Request was made but no response
        console.log(chalk.red('❌ API\'ye bağlanılamadı!'));
        console.log(chalk.yellow('🔌 İnternet bağlantınızı kontrol edin.'));
      } else {
        console.log(chalk.red(`❌ Hata: ${error.message}`));
      }
      
      this.isValid = false;
      return false;
    }
  }

  /**
   * Check if license is currently valid
   * @returns {boolean}
   */
  checkValid() {
    return this.isValid;
  }

  /**
   * Display license banner
   */
  displayBanner() {
    console.log(chalk.cyan.bold('\n' + '═'.repeat(60)));
    console.log(chalk.cyan.bold('          DISCORD TOKEN JOINER - LICENSE SYSTEM'));
    console.log(chalk.cyan.bold('═'.repeat(60) + '\n'));
  }
}

module.exports = LicenseManager;
