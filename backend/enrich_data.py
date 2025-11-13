"""
Script de Enriquecimento de Dados com Simulação de Bureau de Crédito
=====================================================================

Este script enriquece os dados base de crédito com scores simulados de bureau,
criando dados mais realistas para treinar o Modelo V2.

Lógica de Simulação:
- Clientes inadimplentes (Default=1): Score entre 300-600 (baixo)
- Clientes adimplentes (Default=0): Score entre 650-950 (alto)
"""

import pandas as pd
import numpy as np


INPUT_PATH = 'data/Loan_default.csv'
OUTPUT_PATH = 'data/Loan_default_ENRICHED.csv'


def generate_bureau_score(default_status):
    """
    Gera um score de bureau simulado baseado no status de inadimplência.
    
    Args:
        default_status (int): 1 para inadimplente, 0 para adimplente
        
    Returns:
        int: Score de bureau simulado
    """
    if default_status == 1:
        # Cliente inadimplente: score baixo (300-600)
        return np.random.randint(300, 600)
    else:
        # Cliente adimplente: score alto (650-950)
        return np.random.randint(650, 950)


def main():
    """Função principal de enriquecimento de dados."""
    print(f"[INFO] Carregando dados de: {INPUT_PATH}")
    
    df = pd.read_csv(INPUT_PATH)
    print(f"[INFO] {len(df)} registros carregados")
    
    np.random.seed(42)
    
    print("[INFO] Gerando scores de bureau simulados...")
    df['score_bureau'] = df['Default'].apply(generate_bureau_score)
    
    print(f"[INFO] Salvando dados enriquecidos em: {OUTPUT_PATH}")
    df.to_csv(OUTPUT_PATH, index=False)
    
    print("[SUCCESS] ✅ Dados enriquecidos com sucesso!")
    print(f"[INFO] Nova coluna 'score_bureau' adicionada")
    print(f"[INFO] Estatísticas do score_bureau:")
    print(df['score_bureau'].describe())
    
    print(f"\n[INFO] Distribuição por status de Default:")
    print(df.groupby('Default')['score_bureau'].describe())


if __name__ == "__main__":
    main()
