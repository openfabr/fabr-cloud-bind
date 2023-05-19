import random
from ..libs.secrets import ISecretStore

class FakeSecretService(ISecretStore):

    def get_secret(self, key):
        secret_value = key + "supersecretfaked" + str(random.randint(1, 100))
        return secret_value
