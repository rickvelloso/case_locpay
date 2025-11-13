from pydantic import BaseModel
from typing import Literal

"""
Esta é a FONTE ÚNICA DA VERDADE (Single Source of Truth)
para a estrutura de dados de um contrato.

Arquitetura:
- ContractFeaturesBase: Features comuns a todos os modelos
- ContractFeaturesV1: Modelo base (sem dados externos)
- ContractFeaturesV2: Modelo enriquecido (com score_bureau)

Qualquer mudança nas features de entrada deve ser feita AQUI.
"""

class ContractFeaturesBase(BaseModel):
    """Classe base com features comuns a todas as versões do modelo."""
    
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
    
    # Features Categóricas
    Education: str
    EmploymentType: str
    MaritalStatus: str
    HasMortgage: Literal['Yes', 'No']
    HasDependents: Literal['Yes', 'No']
    LoanPurpose: str
    HasCoSigner: Literal['Yes', 'No']


class ContractFeaturesV1(ContractFeaturesBase):
    """Modelo V1 - Features básicas sem dados externos."""
    
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
                "Education": "Bachelor's",
                "EmploymentType": "Full-time",
                "MaritalStatus": "Married",
                "HasMortgage": "Yes",
                "HasDependents": "No",
                "LoanPurpose": "Home",
                "HasCoSigner": "No"
            }
        }


class ContractFeaturesV2(ContractFeaturesBase):
    """Modelo V2 - Features enriquecidas com dados de bureau de crédito."""
    
    # Feature Enriquecida (Bureau de Crédito)
    score_bureau: int
    
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