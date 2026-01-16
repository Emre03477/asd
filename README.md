# 🚀 Discord Token Joiner - Self Bot

![Discord](https://img.shields.io/badge/Discord-v13-7289DA?style=for-the-badge&logo=discord)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

Discord.js v13 tabanlı, lisans sistemi ile korunan profesyonel bir token joiner bot.

## ✨ Özellikler

- 🔐 **Lisans Sistemi**: `api.iamemre.dev` üzerinden lisans doğrulama
- 🤖 **Self Bot**: Discord.js v13 self bot desteği
- 🎯 **Toplu Katılım**: Birden fazla token ile otomatik sunucu katılımı
- 🎨 **Görsel Arayüz**: Renkli ve animasyonlu konsol çıktısı
- ⚡ **Hız Kontrol**: Rate limit koruması ile güvenli işlem
- 📊 **Detaylı Raporlama**: Başarı/başarısızlık oranları ve istatistikler
- 🛡️ **Hata Yönetimi**: Kapsamlı hata yakalama ve raporlama

## 📋 Gereksinimler

- Node.js 16.x veya üzeri
- npm veya yarn
- Geçerli Discord token'ları
- api.iamemre.dev lisans anahtarı

## 🔧 Kurulum

1. Repository'yi klonlayın:
```bash
git clone https://github.com/Emre03477/asd.git
cd asd
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Yapılandırma dosyasını oluşturun:
```bash
cp config.example.json config.json
```

4. `config.json` dosyasını düzenleyin:
```json
{
  "license_key": "YOUR_LICENSE_KEY_HERE",
  "tokens_to_join": [
    "TOKEN_1",
    "TOKEN_2",
    "TOKEN_3"
  ],
  "invite_code": "YOUR_INVITE_CODE"
}
```

## 🚀 Kullanım

Bot'u başlatmak için:
```bash
npm start
```

veya

```bash
node index.js
```

## ⚙️ Yapılandırma

### config.json Parametreleri

| Parametre | Açıklama | Örnek |
|-----------|----------|-------|
| `license_key` | api.iamemre.dev lisans anahtarınız | `"abc123xyz789"` |
| `tokens_to_join` | Sunucuya katılacak token listesi | `["token1", "token2"]` |
| `invite_code` | Discord davet kodu | `"abc123"` veya `"https://discord.gg/abc123"` |

## 📊 Örnek Çıktı

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              DISCORD TOKEN JOINER V1.0                     ║
║              Made with ❤️  by Emre                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

════════════════════════════════════════════════════════════
          DISCORD TOKEN JOINER - LICENSE SYSTEM
════════════════════════════════════════════════════════════

🔐 Lisans kontrolü yapılıyor...
✅ Lisans başarıyla doğrulandı!
✅ Sistem hazır!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Toplam Token: 3
🎯 Davet Kodu: abc123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Token 1/3 işleniyor...
✅ Token 1: User#1234 - Başarıyla katıldı!
⏳ Token 2/3 işleniyor...
✅ Token 2: User#5678 - Başarıyla katıldı!
⏳ Token 3/3 işleniyor...
✅ Token 3: User#9012 - Başarıyla katıldı!

════════════════════════════════════════════════════════════
                    SONUÇLAR
════════════════════════════════════════════════════════════
✅ Başarılı: 3
❌ Başarısız: 0
📊 Toplam: 3
📈 Başarı Oranı: 100.00%
════════════════════════════════════════════════════════════

✨ İşlem tamamlandı! Teşekkürler! ✨
```

## 🔐 Lisans API

Bu bot, lisans doğrulama için `api.iamemre.dev/check?key=YOUR_KEY` API'sini kullanır.

API Yanıt Formatı:
```json
{
  "valid": true,
  "status": "valid",
  "success": true,
  "expires": "2024-12-31",
  "user": "username"
}
```

## ⚠️ Uyarılar

- **Self bot kullanımı Discord ToS'a aykırıdır!** Bu kodu sadece eğitim amaçlı kullanın.
- Token'larınızı asla kimseyle paylaşmayın
- Rate limit'lere dikkat edin
- Spam yapmayın

## 🛠️ Teknolojiler

- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) - Discord self bot kütüphanesi
- [axios](https://axios-http.com/) - HTTP istekleri için
- [chalk](https://github.com/chalk/chalk) - Renkli konsol çıktısı

## 📝 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 👤 Yazar

Made with ❤️ by **Emre**

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Sorularınız için:
- 🌐 Website: [iamemre.dev](https://iamemre.dev)
- 📧 Email: [contact@iamemre.dev](mailto:contact@iamemre.dev)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!