from abc import abstractmethod, ABC

class ISecretStore():

    @abstractmethod
    def get_secret(self):
        pass

class Secrets(ABC):
    def __init__(self, secret_store_service: ISecretStore):
        self.secret_store_service = secret_store_service
        self.use_env_vars = secret_store_service is None
        

    def get_secret(self, key):
        secret_value = None
        print("get_secret() use_env_vars " + str(self.use_env_vars))
        print("get_secret() secret_store_service " + str(self.secret_store_service))
        if self.use_env_vars:
            # TODO: implement env var logic
            pass
        else:
            print("get_secret() " + key)
            secret_value = self.get_secret_from_secret_store(key)

        return secret_value

      
    def get_secret_from_secret_store(self, secret_store_key):
        print("get_secret_from_secret_store() " + secret_store_key)
        return self.secret_store_service.get_secret(secret_store_key)