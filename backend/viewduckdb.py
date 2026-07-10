from pathlib import Path

dataset_dir = Path(r"C:\insight-engine\backend\data\datasets")

csv_files = list(dataset_dir.glob("*.csv"))

if not csv_files:
    print("No datasets found.")
    exit()

latest_csv = max(csv_files, key=lambda p: p.stat().st_mtime)

print(f"Loading: {latest_csv}")

df = pd.read_csv(latest_csv)

con = duckdb.connect(":memory:")
con.register("dataset", df)

print(con.execute("SELECT * FROM dataset").fetchdf())

con.close()