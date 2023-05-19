from fabr_bind.libs.secrets import Secrets

class MySecrets(Secrets):
    def api1(self):
        return self.get_secret("fabrbind/test/myapisecret")


