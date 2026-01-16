import requests
import time
import json
from colorama import Fore, Style, init

# Initialize colorama for colored console output
init(autoreset=True)

class DiscordURLSniper:
    def __init__(self, config_path="config.json"):
        """
        Initialize the Discord URL Sniper with MFA support
        
        Args:
            config_path: Path to the configuration file
        """
        self.config = self.load_config(config_path)
        self.token = self.config.get("token")
        self.password = self.config.get("password")
        self.guild_id = self.config.get("guild_id")
        self.target_vanity = self.config.get("target_vanity")
        self.check_interval = self.config.get("check_interval", 1.0)
        
        self.base_url = "https://discord.com/api/v9"
        self.headers = {
            "Authorization": self.token,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
    def load_config(self, config_path):
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"{Fore.RED}Error: Config file not found at {config_path}")
            exit(1)
        except json.JSONDecodeError:
            print(f"{Fore.RED}Error: Invalid JSON in config file")
            exit(1)
    

    
    def check_vanity_available(self, vanity_code):
        """
        Check if a vanity URL is available
        
        Args:
            vanity_code: The vanity code to check
            
        Returns:
            bool: True if available, False otherwise
        """
        url = f"{self.base_url}/invites/{vanity_code}"
        
        try:
            response = self.session.get(url)
            
            if response.status_code == 404:
                return True  # Vanity is available
            elif response.status_code == 200:
                return False  # Vanity is taken
            else:
                print(f"{Fore.YELLOW}Unexpected status code: {response.status_code}")
                return False
        except Exception as e:
            print(f"{Fore.RED}Error checking vanity: {e}")
            return False
    
    def claim_vanity(self, vanity_code):
        """
        Attempt to claim a vanity URL with MFA support
        
        Args:
            vanity_code: The vanity code to claim
            
        Returns:
            bool: True if successful, False otherwise
        """
        url = f"{self.base_url}/guilds/{self.guild_id}/vanity-url"
        
        payload = {
            "code": vanity_code
        }
        
        # First attempt without MFA
        try:
            response = self.session.patch(url, json=payload)
            
            # Check if MFA is required
            if response.status_code == 401:
                try:
                    response_data = response.json()
                    
                    if response_data.get("code") == 60003:  # MFA required
                        print(f"{Fore.CYAN}MFA required, using password...")
                        return self.claim_vanity_with_mfa(vanity_code)
                    else:
                        print(f"{Fore.RED}Authentication failed")
                        print(f"{Fore.RED}Status Code: {response.status_code}")
                        print(f"{Fore.RED}Response: {response.text}")
                        return False
                except ValueError:
                    print(f"{Fore.RED}Authentication failed")
                    print(f"{Fore.RED}Status Code: {response.status_code}")
                    print(f"{Fore.RED}Raw Response: {response.text}")
                    return False
            
            elif response.status_code == 200:
                print(f"{Fore.GREEN}✓ Successfully claimed vanity: {vanity_code}")
                return True
            
            elif response.status_code == 429:
                retry_after = response.json().get("retry_after", 5)
                print(f"{Fore.YELLOW}Rate limited. Retry after {retry_after} seconds")
                return False
            
            else:
                print(f"{Fore.RED}Failed to claim vanity: {response.status_code}")
                print(f"{Fore.RED}Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"{Fore.RED}Error claiming vanity: {e}")
            return False
    
    def claim_vanity_with_mfa(self, vanity_code):
        """
        Claim vanity URL with MFA (password authentication)
        
        Args:
            vanity_code: The vanity code to claim
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.password:
            print(f"{Fore.RED}Password not configured for MFA authentication")
            return False
        
        url = f"{self.base_url}/guilds/{self.guild_id}/vanity-url"
        
        payload = {
            "code": vanity_code,
            "password": self.password
        }
        
        try:
            response = self.session.patch(url, json=payload)
            
            if response.status_code == 200:
                print(f"{Fore.GREEN}✓ Successfully claimed vanity with MFA: {vanity_code}")
                return True
            elif response.status_code == 401:
                print(f"{Fore.RED}MFA authentication failed. Check your password.")
                print(f"{Fore.RED}Status Code: {response.status_code}")
                print(f"{Fore.RED}Raw Response: {response.text}")
                try:
                    response_json = response.json()
                    print(f"{Fore.RED}Response JSON: {response_json}")
                except:
                    pass
                return False
            elif response.status_code == 429:
                retry_after = response.json().get("retry_after", 5)
                print(f"{Fore.YELLOW}Rate limited. Retry after {retry_after} seconds")
                return False
            else:
                print(f"{Fore.RED}Failed to claim vanity with MFA: {response.status_code}")
                print(f"{Fore.RED}Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"{Fore.RED}Error claiming vanity with MFA: {e}")
            return False
    
    def start_sniping(self):
        """
        Start monitoring and attempting to snipe the target vanity URL
        """
        print(f"{Fore.CYAN}{'='*50}")
        print(f"{Fore.CYAN}Discord URL Sniper with MFA Support")
        print(f"{Fore.CYAN}{'='*50}")
        print(f"{Fore.YELLOW}Target vanity: {self.target_vanity}")
        print(f"{Fore.YELLOW}Guild ID: {self.guild_id}")
        print(f"{Fore.YELLOW}Check interval: {self.check_interval}s")
        print(f"{Fore.YELLOW}MFA enabled: {Fore.GREEN}Yes{Style.RESET_ALL}" if self.password else f"{Fore.YELLOW}MFA enabled: {Fore.RED}No{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*50}\n")
        
        attempt_count = 0
        
        while True:
            attempt_count += 1
            
            print(f"{Fore.CYAN}[Attempt {attempt_count}] Checking availability of '{self.target_vanity}'...", end=" ")
            
            if self.check_vanity_available(self.target_vanity):
                print(f"{Fore.GREEN}AVAILABLE!")
                print(f"{Fore.CYAN}Attempting to claim...")
                
                if self.claim_vanity(self.target_vanity):
                    print(f"{Fore.GREEN}{'='*50}")
                    print(f"{Fore.GREEN}SUCCESS! Vanity URL claimed successfully!")
                    print(f"{Fore.GREEN}{'='*50}")
                    break
                else:
                    print(f"{Fore.RED}Failed to claim. Continuing to monitor...")
            else:
                print(f"{Fore.RED}Taken")
            
            time.sleep(self.check_interval)

def main():
    """Main entry point"""
    try:
        sniper = DiscordURLSniper()
        sniper.start_sniping()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Sniping stopped by user.")
    except Exception as e:
        print(f"{Fore.RED}Fatal error: {e}")

if __name__ == "__main__":
    main()
