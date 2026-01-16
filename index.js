const { Client } = require('discord.js-selfbot-v13');
const chalk = require('chalk');
const fs = require('fs');
const LicenseManager = require('./license');

/**
 * Discord Token Joiner Bot
 * A self bot that joins multiple tokens to a Discord server
 */
class TokenJoiner {
  constructor(config) {
    this.config = config;
    this.licenseManager = new LicenseManager(config.license_key);
    this.mainClient = null;
    this.joinedCount = 0;
    this.failedCount = 0;
  }

  /**
   * Display ASCII banner
   */
  displayBanner() {
    console.clear();
    console.log(chalk.magenta.bold('\n╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.magenta.bold('║                                                            ║'));
    console.log(chalk.cyan.bold('║              DISCORD TOKEN JOINER V1.0                     ║'));
    console.log(chalk.cyan.bold('║              Made with ❤️  by Emre                         ║'));
    console.log(chalk.magenta.bold('║                                                            ║'));
    console.log(chalk.magenta.bold('╚════════════════════════════════════════════════════════════╝\n'));
  }

  /**
   * Animate loading
   */
  async animateLoading(message, duration = 2000) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const startTime = Date.now();
    let i = 0;
    
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        process.stdout.write(`\r${chalk.cyan(frames[i])} ${message}`);
        i = (i + 1) % frames.length;
        
        if (Date.now() - startTime >= duration) {
          clearInterval(interval);
          process.stdout.write('\r' + ' '.repeat(60) + '\r');
          resolve();
        }
      }, 80);
    });
  }

  /**
   * Initialize and verify license
   */
  async initialize() {
    this.displayBanner();
    this.licenseManager.displayBanner();
    
    // Verify license
    const isValid = await this.licenseManager.verify();
    
    if (!isValid) {
      console.log(chalk.red.bold('\n❌ Lisans doğrulanamadı! Program sonlandırılıyor...\n'));
      process.exit(1);
    }
    
    await this.animateLoading('Sistem hazırlanıyor...', 1500);
    console.log(chalk.green('✅ Sistem hazır!\n'));
  }

  /**
   * Join a single token to the server
   */
  async joinToken(token, index, inviteCode) {
    return new Promise(async (resolve) => {
      try {
        const client = new Client({
          checkUpdate: false
        });

        // Set timeout for joining
        const timeout = setTimeout(() => {
          console.log(chalk.yellow(`⚠️  Token ${index + 1}: Zaman aşımı`));
          client.destroy().catch(() => {});
          resolve({ success: false, reason: 'timeout' });
        }, 30000);

        client.once('ready', async () => {
          try {
            console.log(chalk.blue(`🔄 Token ${index + 1}: ${client.user.tag} - Sunucuya katılıyor...`));
            
            // Join the server using invite code
            await client.acceptInvite(inviteCode);
            
            clearTimeout(timeout);
            console.log(chalk.green(`✅ Token ${index + 1}: ${client.user.tag} - Başarıyla katıldı!`));
            
            // Delay before destroying client
            setTimeout(() => {
              client.destroy().catch(() => {});
            }, 2000);
            
            resolve({ success: true, user: client.user.tag });
          } catch (error) {
            clearTimeout(timeout);
            console.log(chalk.red(`❌ Token ${index + 1}: ${client.user.tag} - Katılma hatası: ${error.message}`));
            client.destroy().catch(() => {});
            resolve({ success: false, reason: error.message });
          }
        });

        client.on('error', (error) => {
          console.log(chalk.red(`❌ Token ${index + 1}: Bağlantı hatası`));
          resolve({ success: false, reason: error.message });
        });

        // Login with token
        await client.login(token);
      } catch (error) {
        console.log(chalk.red(`❌ Token ${index + 1}: Giriş hatası - ${error.message}`));
        resolve({ success: false, reason: error.message });
      }
    });
  }

  /**
   * Start the token joining process
   */
  async start() {
    await this.initialize();

    console.log(chalk.cyan.bold('━'.repeat(60)));
    console.log(chalk.white.bold(`📊 Toplam Token: ${this.config.tokens_to_join.length}`));
    console.log(chalk.white.bold(`🎯 Davet Kodu: ${this.config.invite_code}`));
    console.log(chalk.cyan.bold('━'.repeat(60) + '\n'));

    // Process tokens one by one with delay
    for (let i = 0; i < this.config.tokens_to_join.length; i++) {
      const token = this.config.tokens_to_join[i];
      
      console.log(chalk.yellow(`⏳ Token ${i + 1}/${this.config.tokens_to_join.length} işleniyor...`));
      
      const result = await this.joinToken(token, i, this.config.invite_code);
      
      if (result.success) {
        this.joinedCount++;
      } else {
        this.failedCount++;
      }

      // Delay between tokens to avoid rate limiting
      if (i < this.config.tokens_to_join.length - 1) {
        const delay = 3000 + Math.random() * 2000; // 3-5 seconds random delay
        await this.animateLoading(`Sonraki token için bekleniyor... (${Math.floor(delay / 1000)}s)`, delay);
      }
    }

    // Display final results
    this.displayResults();
  }

  /**
   * Display final results
   */
  displayResults() {
    console.log('\n' + chalk.cyan.bold('═'.repeat(60)));
    console.log(chalk.cyan.bold('                    SONUÇLAR'));
    console.log(chalk.cyan.bold('═'.repeat(60)));
    console.log(chalk.green(`✅ Başarılı: ${this.joinedCount}`));
    console.log(chalk.red(`❌ Başarısız: ${this.failedCount}`));
    console.log(chalk.white(`📊 Toplam: ${this.config.tokens_to_join.length}`));
    console.log(chalk.yellow(`📈 Başarı Oranı: ${((this.joinedCount / this.config.tokens_to_join.length) * 100).toFixed(2)}%`));
    console.log(chalk.cyan.bold('═'.repeat(60) + '\n'));
    console.log(chalk.magenta.bold('✨ İşlem tamamlandı! Teşekkürler! ✨\n'));
  }
}

/**
 * Main entry point
 */
async function main() {
  try {
    // Check if config file exists
    if (!fs.existsSync('./config.json')) {
      console.log(chalk.red('\n❌ config.json dosyası bulunamadı!'));
      console.log(chalk.yellow('💡 config.example.json dosyasını config.json olarak kopyalayın ve düzenleyin.\n'));
      process.exit(1);
    }

    // Load configuration
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    // Validate configuration
    if (!config.license_key || config.license_key === 'YOUR_LICENSE_KEY_HERE') {
      console.log(chalk.red('\n❌ Lütfen config.json dosyasında geçerli bir lisans anahtarı belirtin!\n'));
      process.exit(1);
    }

    if (!config.invite_code || config.invite_code === 'YOUR_INVITE_CODE') {
      console.log(chalk.red('\n❌ Lütfen config.json dosyasında geçerli bir davet kodu belirtin!\n'));
      process.exit(1);
    }

    if (!config.tokens_to_join || config.tokens_to_join.length === 0) {
      console.log(chalk.red('\n❌ Lütfen config.json dosyasında en az bir token belirtin!\n'));
      process.exit(1);
    }

    // Create and start token joiner
    const joiner = new TokenJoiner(config);
    await joiner.start();

  } catch (error) {
    console.log(chalk.red(`\n❌ Kritik hata: ${error.message}\n`));
    if (error.stack) {
      console.log(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.log(chalk.red('\n❌ İşlenmeyen hata:'), error);
});

process.on('uncaughtException', (error) => {
  console.log(chalk.red('\n❌ Yakalanmayan hata:'), error);
  process.exit(1);
});

// Start the application
if (require.main === module) {
  main();
}

module.exports = TokenJoiner;
