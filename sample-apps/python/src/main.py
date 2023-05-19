import random
from fabr_bind.secret_services.FakeSecretService import FakeSecretService

from fabr_bind.MySecrets import MySecrets

def main():
  print("Welcome FABR bind sample Python app!")
  
  from_fake_secrets = MySecrets(FakeSecretService())
  
  api_secret = from_fake_secrets.api1()

  print("The api secret is:", api_secret)

if __name__ == "__main__":
  main()