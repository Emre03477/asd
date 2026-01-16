# Discord URL Sniper with MFA Support

A Discord vanity URL sniper with Multi-Factor Authentication (MFA/2FA) support. This tool monitors Discord vanity URLs and automatically claims them when they become available.

## Features

- ✅ **MFA/2FA Support** - Full support for accounts with Multi-Factor Authentication enabled
- ✅ **Real-time Monitoring** - Continuously checks vanity URL availability
- ✅ **Automatic Claiming** - Instantly claims URLs when they become available
- ✅ **Rate Limit Handling** - Respects Discord's rate limits
- ✅ **Colored Console Output** - Easy-to-read status updates
- ✅ **Configurable Settings** - Customizable check intervals and targets

## Requirements

- Python 3.7 or higher
- Discord account with appropriate permissions
- Guild/Server with vanity URL feature enabled (requires Level 3 boost or higher)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Emre03477/asd.git
cd asd
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

1. Edit `config.json` with your details:

```json
{
  "token": "YOUR_DISCORD_TOKEN_HERE",
  "password": "YOUR_ACCOUNT_PASSWORD_HERE",
  "guild_id": "YOUR_GUILD_ID_HERE",
  "target_vanity": "desiredvanity",
  "check_interval": 1.0
}
```

### Configuration Parameters:

- **token**: Your Discord account token
- **password**: Your Discord account password (required for MFA verification on sensitive operations)
- **guild_id**: The ID of the Discord server where you want to set the vanity URL
- **target_vanity**: The vanity URL code you want to snipe
- **check_interval**: Time in seconds between availability checks (default: 1.0)

### How to Get Your Discord Token:

1. Open Discord in your browser (discord.com/app)
2. Press `F12` to open Developer Tools
3. Go to the `Console` tab
4. Type: `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`
5. Press Enter and copy the token

### How to Get Your Guild ID:

1. Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
2. Right-click on your server icon
3. Click "Copy Server ID"

## Usage

Run the sniper:

```bash
python discord_sniper.py
```

The script will:
1. Load configuration from `config.json`
2. Start monitoring the target vanity URL
3. Automatically claim it when available (with MFA if configured)
4. Display colored status updates in the console

### Example Output:

```
==================================================
Discord URL Sniper with MFA Support
==================================================
Target vanity: myvanity
Guild ID: 123456789012345678
Check interval: 1.0s
MFA enabled: Yes
==================================================

[Attempt 1] Checking availability of 'myvanity'... Taken
[Attempt 2] Checking availability of 'myvanity'... Taken
[Attempt 3] Checking availability of 'myvanity'... AVAILABLE!
Attempting to claim...
MFA required, using password...
✓ Successfully claimed vanity with MFA: myvanity
==================================================
SUCCESS! Vanity URL claimed successfully!
==================================================
```

## Security Notes

- **Never share your Discord token** - It provides full access to your account
- **Keep your password secure** - Store it safely in the config.json file
- **Use at your own risk** - Automated tools may violate Discord's Terms of Service
- **Consider using an alt account** - Avoid risking your main account
- The config.json file contains sensitive information - add it to .gitignore

## How It Works

1. **Monitoring**: The script continuously checks if the target vanity URL is available by making requests to Discord's API
2. **Detection**: When a vanity URL returns a 404 status, it means it's available
3. **Claiming**: The script immediately attempts to claim the URL for your server
4. **MFA Handling**: If your account has 2FA enabled, the script automatically uses your password for MFA verification
5. **Success**: Once claimed, your server's vanity URL is updated

## Troubleshooting

### "Password not configured for MFA authentication"
- Make sure you have added your Discord account password to the `password` field in config.json
- This is required for accounts with 2FA enabled

### "MFA authentication failed"
- Verify your password is correct in the config.json file
- Ensure you're using the correct Discord account password

### "Rate limited"
- Discord has rate limits to prevent abuse
- The script automatically waits when rate limited
- Consider increasing `check_interval` to reduce frequency

### "Failed to claim vanity"
- Ensure you have proper permissions in the server (Manage Server permission)
- Verify the server has the vanity URL feature unlocked (Level 3 boost)
- Check that your token is valid and not expired

## Dependencies

- **requests**: HTTP library for making API calls
- **colorama**: Library for colored terminal output

## Disclaimer

This tool is for educational purposes only. Use of automated tools may violate Discord's Terms of Service. The authors are not responsible for any consequences resulting from the use of this software. Use at your own risk.

## License

This project is provided as-is without any warranty. Feel free to modify and use as needed.

## Contributing

Contributions, issues, and feature requests are welcome!

## Author

Created by Emre03477