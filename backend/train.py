import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.pipeline import Pipeline as ImblearnPipeline
from imblearn.over_sampling import SMOTE
from schema import ContractFeatures
import joblib

print("Iniciando o script de treinamento (Versão 2.0 - Produção)")

fields = ContractFeatures.model_fields

numeric_features = []
categorical_features = []

print("Lendo o schema.py para definir features...")
for field_name, field_info in fields.items():
    
    field_type = field_info.annotation
    
    if field_type is int or field_type is float:
        numeric_features.append(field_name)
    else:
        categorical_features.append(field_name)

print("Schema lido com sucesso.")
print(f"Features numéricas encontradas: {numeric_features}")
print(f"Features categóricas encontradas: {categorical_features}")

TARGET = 'Default'

try:
    data = pd.read_csv('data/Loan_default.csv')
except FileNotFoundError:
    print("Erro: Arquivo Loan_default.csv não encontrado.")
    exit()

if 'LoanID' in data.columns:
    data = data.drop('LoanID', axis=1)
data = data.dropna(subset=[TARGET])

all_features = numeric_features + categorical_features
X = data[all_features]
y = data[TARGET]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

print(f"Dados carregados: {len(X_train)} amostras de treino, {len(X_test)} amostras de teste.")

numeric_transformer = StandardScaler()
categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ],
    remainder='passthrough'
)

model_pipeline = ImblearnPipeline(steps=[
    ('preprocessor', preprocessor),
    ('sampler', SMOTE(random_state=42)),
    ('classifier', LogisticRegression(random_state=42, max_iter=1000))
])

print("Treinando o pipeline completo (Preprocessor + SMOTE + LogisticRegression)...")
model_pipeline.fit(X_train, y_train)
print("Treinamento concluído.")

model_filename = 'artifacts/risk_model_pipeline.joblib'
joblib.dump(model_pipeline, model_filename)

print(f"Modelo salvo com sucesso como '{model_filename}'")
print("-" * 50)

print("Validando o modelo no conjunto de teste...")
y_pred = model_pipeline.predict(X_test)
y_prob = model_pipeline.predict_proba(X_test)[:, 1] # Probabilidade de ser 1 (Default)

# Lembrete da Matriz:
# [[TN (Bom/Bom)      FP (Bom/Ruim - Atrito)]
#  [FN (Ruim/Bom - Perda) TP (Ruim/Ruim)]]
print("Matriz de Confusão (Dados de Teste):")
print(confusion_matrix(y_test, y_pred))
print("\nRelatório de Classificação (Dados de Teste):")
print(classification_report(y_test, y_pred))

print("\nAnálise das Probabilidades (O que a API vai usar):")
print(f"Média da Probabilidade de Risco (Default): {y_prob.mean():.2f}")
print(f"Max Probabilidade de Risco: {y_prob.max():.2f}")
print(f"Min Probabilidade de Risco: {y_prob.min():.2f}")

print("Script de treinamento finalizado com sucesso.")

try:
    print("Salvando X_test e y_test em CSVs...")
    X_test.to_csv('artifacts/X_test_data.csv', index=False)
    y_test.to_csv('artifacts/y_test_data.csv', index=False)
    print("Dados de teste salvos com sucesso.")
except Exception as e:
    print(f"Erro ao salvar dados de teste: {e}")