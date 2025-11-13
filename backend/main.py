from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from typing import Literal, Dict
from schema import ContractFeatures
from sklearn.metrics import confusion_matrix, classification_report
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API Preditiva de Risco Imobiliário (LocPay)",
    description="Microserviço de IA para simular a análise de risco de inadimplência de inquilinos.",
    version="0.2.0"
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

model = None
X_test = None
y_test = None

class ScoreResponse(BaseModel):
    prediction_label: int
    probability_high_risk: float
    probability_low_risk: float
    business_recommendation: str

class ConfusionMatrixDetails(BaseModel):
    true_negatives: int
    false_positives: int
    false_negatives: int
    true_positives: int

class BusinessMetrics(BaseModel):
    total_test_samples: int
    erro_de_prejuizo_count: int
    erro_de_atrito_count: int
    
class ThresholdEvaluationResponse(BaseModel):
    threshold_usado: float
    matriz_confusao: ConfusionMatrixDetails
    metricas_de_negocio: BusinessMetrics
    classification_report: Dict

@app.on_event("startup")
async def startup_event():
    global model, X_test, y_test 
    
    try:
        model = joblib.load('artifacts/risk_model_pipeline.joblib')
        print("Modelo 'artifacts/risk_model_pipeline.joblib' carregado com sucesso.")
    except FileNotFoundError:
        print("ERRO: Arquivo do modelo 'artifacts/risk_model_pipeline.joblib' não encontrado.")
    except Exception as e:
        print(f"ERRO ao carregar o modelo: {e}")

    try:
        X_test = pd.read_csv('artifacts/X_test_data.csv')
        y_test_df = pd.read_csv('artifacts/y_test_data.csv')
        y_test = y_test_df.squeeze()
        print("Dados de teste (X_test, y_test) carregados com sucesso.")
        print(f"Carregadas {len(X_test)} amostras de teste para simulação.")
    except FileNotFoundError:
        print("ERRO: Arquivos 'artifacts/X_test_data.csv' ou 'artifacts/y_test_data.csv' não encontrados.") 
    except Exception as e:
        print(f"ERRO ao carregar dados de teste: {e}")

    if model is None or X_test is None or y_test is None:
        print("AVISO: API está subindo com artefatos faltando. O endpoint /evaluate_threshold falhará.")
    else:
        print("API pronta e todos os artefatos (modelo e dados de teste) carregados.")

@app.get("/", tags=["Health Check"])
async def read_root():
    """Verifica se a API está online."""
    return {"status": "API de Risco Imobiliário está online e operacional."}

@app.post("/score", response_model=ScoreResponse, tags=["Scoring (1. Individual)"])
async def get_risk_score(features: ContractFeatures):
    """
    Recebe os dados do contrato/cliente e retorna o score de risco.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo não está carregado. Verifique os logs do servidor.")

    input_data = pd.DataFrame([features.model_dump()])

    try:
        probabilities = model.predict_proba(input_data)
        prob_low_risk = float(probabilities[0][0])
        prob_high_risk = float(probabilities[0][1])
        prediction = int(model.predict(input_data)[0])

        recommendation = ""
        if prob_high_risk > 0.75:
            recommendation = "Recusa Automática (Risco > 75%)"
        elif prob_high_risk > 0.50:
            recommendation = "Análise Manual (Risco > 50%)"
        else:
            recommendation = "Aprovação Automática (Risco < 50%)"

        return {
            "prediction_label": prediction,
            "probability_high_risk": prob_high_risk,
            "probability_low_risk": prob_low_risk,
            "business_recommendation": recommendation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno durante a predição: {str(e)}")

@app.get("/evaluate_threshold", response_model=ThresholdEvaluationResponse, tags=["Scoring (2. Simulador de Negócio)"])
async def evaluate_threshold(
    threshold: float = Query(default=0.5, ge=0.0, le=1.0, description="Ponto de corte (0.0 a 1.0) para classificar como Risco Alto (1)")
):
    """
    Simula o impacto de um ponto de corte (threshold) de risco em
    TODO o conjunto de dados de teste (76.605 amostras).
    
    - **Erro de Prejuízo (FN)**: Quantos clientes ruins foram aprovados.
    - **Erro de Atrito (FP)**: Quantos clientes bons foram recusados.
    """
    if model is None or X_test is None or y_test is None:
        raise HTTPException(status_code=503, detail="Artefatos de teste não carregados. Verifique os logs do servidor.")

    try:
        probabilities = model.predict_proba(X_test)[:, 1]
        
        y_pred_new = np.where(probabilities > threshold, 1, 0)
        
        cm = confusion_matrix(y_test, y_pred_new)
        
        tn, fp, fn, tp = cm.ravel()
        
        report = classification_report(y_test, y_pred_new, output_dict=True)
        
        matrix_details = {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        }
        
        business_details = {
            "total_test_samples": len(y_test),
            "erro_de_prejuizo_count": int(fn),
            "erro_de_atrito_count": int(fp)
        }

        return {
            "threshold_usado": threshold,
            "matriz_confusao": matrix_details,
            "metricas_de_negocio": business_details,
            "classification_report": report
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro durante a avaliação: {str(e)}")