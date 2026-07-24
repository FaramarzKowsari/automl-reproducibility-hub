# Methodology and limitations

The Full-mode reference pipeline performs a deterministic train/test split using the selected seed. Numerical columns receive median imputation and standardization. Categorical columns receive most-frequent imputation and one-hot encoding. The selected estimator is trained after preprocessing inside a scikit-learn Pipeline.

Classification metrics include accuracy, precision, recall, F1, ROC AUC when binary probabilities are available, and a confusion matrix. Regression metrics include MAE, RMSE, and R².

## Important limitations

- A random seed controls supported pseudo-random operations; it does not make all platforms mathematically identical.
- Floating-point reductions may vary across package, browser, CPU, and WebAssembly implementations.
- User-uploaded datasets are not persisted by the project.
- The compact AutoML strategy is a transparent candidate comparison, not an exhaustive search service.
- Large datasets are constrained by browser memory. DuckDB-WASM itself is subject to WebAssembly and browser memory ceilings.
