---
id: icu-los-prediction
title:
  en: "Early prediction of prolonged ICU stay"
  zh: "ICU 延长住院的早期预测"
period: "2026"
role: "Independent project"
stack: ["Python", "scikit-learn", "XGBoost", "SHAP", "Jupyter", "LaTeX"]
status: archived
hero: "figures/roc-pr.png"
order: 1
---

**Problem.** Prolonged ICU stay affects bed turnover, staffing, and discharge planning. Can routinely collected data from the first 24 h after ICU admission identify patients likely to stay for 72 h or longer?

**Approach.** I used the openly available MIMIC-IV Clinical Database Demo v2.2 (100 patients, 128 first ICU stays) and extracted 17 demographic, vital-sign, laboratory, and early-intervention variables. After a stratified 70/30 split, I compared L2-regularized logistic regression, random forest, and XGBoost with five-fold cross-validated AUROC, then evaluated calibration, decision curves, and SHAP values on the held-out test set.

**Result.** Random forest achieved the highest cross-validated AUROC (0.778) and a test AUROC of 0.739 (95% CI 0.559–0.883), with PR-AUC 0.698 and Brier score 0.204. Logistic regression had a comparable test AUROC (0.750) and better calibration (Brier 0.183). Minimum GCS, maximum temperature, maximum lactate, mechanical ventilation, and maximum heart rate were the most influential predictors.

**Boundary.** The demo contains only 100 patients and 48 events, comes from a single center, and has no external validation. This is a reproducible methodological demonstration, not a clinical conclusion.

**中文摘要。** 本项目基于 MIMIC-IV Demo v2.2，纳入 128 个成人首次 ICU 住院，使用入 ICU 24 小时内的 17 个变量预测延长 ICU 停留（LOS ≥ 72 小时）。随机森林交叉验证 AUROC 为 0.778，测试集 AUROC 为 0.739（95% CI 0.559–0.883），但样本量小、单中心、缺乏外部验证，结果仅用于方法学展示。

[Report PDF](/files/icu-los-report.pdf) · [Jupyter Notebook](/files/icu-los-analysis.ipynb)
