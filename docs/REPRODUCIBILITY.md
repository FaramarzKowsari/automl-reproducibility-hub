# Reproducibility contract

A complete experiment manifest records:

1. Schema version and experiment ID.
2. Creation timestamp and execution mode.
3. Dataset ID, version, SHA-256, shape, target, and source.
4. Task, strategy, estimator, train/test split, and seed.
5. Explicit exposed parameters.
6. Candidate results, winner, and metrics.
7. Runtime and package versions.
8. Code fingerprint and scientific notes.

The experiment ID is the first 16 hexadecimal characters of a SHA-256 digest over a canonical JSON representation of the manifest before the ID is inserted.

To reproduce a run outside the browser, export the JSON manifest and Python skeleton, acquire the exact dataset bytes, verify the SHA-256 digest, install matching package versions, and reconstruct the preprocessing/model pipeline.
