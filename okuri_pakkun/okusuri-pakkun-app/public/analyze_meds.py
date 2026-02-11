import json
from collections import defaultdict

def analyze_meds(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    by_name = defaultdict(list)
    for i, med in enumerate(data):
        name = med['brand_name']
        by_name[name].append((i, med))
    
    print(f"Total entries: {len(data)}")
    print("Duplicates by brand name:")
    for name, entries in by_name.items():
        if len(entries) > 1:
            print(f"\n--- {name} ---")
            for idx, med in entries:
                print(f"  Index {idx}: YJ {med['yj_code']}, Source: {med.get('source', 'N/A')}")
                print(f"    Taste: {med['taste_smell']}")

if __name__ == "__main__":
    analyze_meds(r'c:\Users\kiyoshi\Github_repository\okuri_pakkun\okusuri-pakkun-app\public\meds_master.json')
