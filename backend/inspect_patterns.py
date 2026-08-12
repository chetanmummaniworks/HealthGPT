import pandas as pd

path = "../datasets/disease_prediction/raw/Final_Augmented_dataset_Diseases_and_Symptoms.csv"

df = pd.read_csv(path)

X = df.drop(columns=["diseases"])

result = (
    pd.DataFrame({
        "disease": df["diseases"].values,
    })
    .assign(
        unique_patterns=X.groupby(
            df["diseases"].values,
            sort=False
        ).transform("size")
    )
)

# Better calculation: number of unique symptom vectors per disease
rows = []

for disease, group in df.groupby("diseases"):
    symptom_data = group.drop(columns=["diseases"])
    rows.append({
        "disease": disease,
        "total_rows": len(group),
        "unique_patterns": len(symptom_data.drop_duplicates()),
    })

result = pd.DataFrame(rows).sort_values("unique_patterns")

print("\n=== 30 DISEASES WITH FEWEST UNIQUE PATTERNS ===\n")
print(result.head(30).to_string(index=False))

print("\n=== 10 DISEASES WITH MOST UNIQUE PATTERNS ===\n")
print(result.tail(10).to_string(index=False))