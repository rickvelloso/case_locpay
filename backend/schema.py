from pydantic import BaseModel
from typing import Literal

"""
Esta é a FONTE ÚNICA DA VERDADE (Single Source of Truth)
para a estrutura de dados de um contrato.

Qualquer mudança nas features de entrada (remoção, adição ou
mudança de tipo) deve ser feita APENAS AQUI.
"""
class ContractFeatures(BaseModel):
    # Features Numéricas
    Age: int
    Income: float
    LoanAmount: float
    CreditScore: int
    MonthsEmployed: int
    NumCreditLines: int
    InterestRate: float
    LoanTerm: int
    DTIRatio: float
    
    # Feature Enriquecida (Bureau de Crédito gerada artificialmente para simular integração com API externa)
    score_bureau: int
    
    # Features Categóricas
    Education: str
    EmploymentType: str
    MaritalStatus: str
    HasMortgage: Literal['Yes', 'No']
    HasDependents: Literal['Yes', 'No']
    LoanPurpose: str
    HasCoSigner: Literal['Yes', 'No']

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 32,
                "Income": 65000.0,
                "LoanAmount": 200000.0,
                "CreditScore": 710,
                "MonthsEmployed": 48,
                "NumCreditLines": 3,
                "InterestRate": 12.5,
                "LoanTerm": 36,
                "DTIRatio": 0.25,
                "score_bureau": 720,
                "Education": "Bachelor's",
                "EmploymentType": "Full-time",
                "MaritalStatus": "Married",
                "HasMortgage": "Yes",
                "HasDependents": "No",
                "LoanPurpose": "Home",
                "HasCoSigner": "No"
            }
        }