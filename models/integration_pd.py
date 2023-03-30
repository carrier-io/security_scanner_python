from typing import Optional, List
from pylon.core.tools import log
from pydantic import BaseModel, validator


class IntegrationModel(BaseModel):
    requirements: Optional[List] = ['requirements.txt']
    save_intermediates_to: Optional[str] = '/data/intermediates/sast'

    def check_connection(self) -> bool:
        try:
            return True
        except Exception as e:
            log.exception(e)
            return False
    

