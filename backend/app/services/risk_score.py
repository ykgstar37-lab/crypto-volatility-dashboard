import math


def compute_risk_score(predictions: list[dict]) -> tuple[float, str]:
    """Compute composite risk score (0-100) from model predictions."""
    vols = [p["annualized_vol"] for p in predictions if p["annualized_vol"] > 0]
    if not vols:
        return 0.0, "N/A"

    avg_vol = sum(vols) / len(vols)

    # Map annualized vol to 0-100 scale
    # BTC typical range: 30% (calm) to 120%+ (extreme)
    score = min(100, max(0, (avg_vol - 20) / 100 * 100))
    score = round(score, 1)

    if score < 25:
        label = "Low"
    elif score < 50:
        label = "Moderate"
    elif score < 75:
        label = "High"
    else:
        label = "Extreme"

    return score, label
