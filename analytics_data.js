window.__ANALYTICS_DATA__ = {
  "project": {
    "name": "Framework de Desenvolvimento & Orquestração com IA",
    "last_updated": "2026-09-24",
    "currency_primary": "BRL",
    "currency_secondary": "USD"
  },
  "kpis": {
    "active_users_daily": 0,
    "active_users_monthly": 0,
    "total_signups": 0,
    "mrr_brl": 0.0,
    "mrr_usd": 0.0,
    "checkout_conversion_rate": 0.0,
    "activation_rate": 0.0
  },
  "funnel": [
    {
      "step": "Descoberta / Visitantes",
      "count": 0,
      "conversion_percentage": 0.0
    },
    {
      "step": "Cadastros (Signups)",
      "count": 0,
      "conversion_percentage": 0.0
    },
    {
      "step": "Ativação (Aha! Moment)",
      "count": 0,
      "conversion_percentage": 0.0
    },
    {
      "step": "Checkout Iniciado",
      "count": 0,
      "conversion_percentage": 0.0
    },
    {
      "step": "Assinatura / Pagamento Concluído",
      "count": 0,
      "conversion_percentage": 0.0
    }
  ],
  "events_catalog": [
    {
      "event_name": "user_signed_up",
      "description": "Disparado ao concluir cadastro",
      "target_kpi": "total_signups"
    },
    {
      "event_name": "feature_core_used",
      "description": "Disparado ao gerar primeiro resultado (Ativação)",
      "target_kpi": "activation_rate"
    },
    {
      "event_name": "checkout_started",
      "description": "Disparado ao abrir tela de checkout",
      "target_kpi": "checkout_conversion_rate"
    },
    {
      "event_name": "payment_completed",
      "description": "Webhook confirmado de assinatura ou compra",
      "target_kpi": "mrr_brl"
    }
  ],
  "recent_events": []
};
