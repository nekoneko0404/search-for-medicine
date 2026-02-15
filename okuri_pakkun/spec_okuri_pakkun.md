Web App Specification: "Okusuri Pakkun" (Pediatric Medication Support)

1. Project Overview
A web application to advise caregivers on how to administer pediatric medications based on medical evidence. The app identifies specific "taste/smell" and "food compatibility" (good/bad) for each medication, strictly distinguishing between different manufacturers (brands) for the same active ingredient.

*   **Target Drug Formulations:** Powdered medications (powders, dry syrups, fine granules, etc.) and syrups only.

2. Core Functional Requirements
2.1 Search & Identification
Input: Medication brand name (e.g., "Klaricid").

Query Parameter Support: Accept ?yj_code=... or ?name=... for direct access.

Autocomplete: Must show [Brand Name] + [Formulation] + [Manufacturer/Brand Suffix].

Reasoning: The taste of "Clarithromycin" varies significantly (e.g., Strawberry vs. Chocolate) depending on the manufacturer.

Target Logic: Use YJ Codes or HOT codes for 1:1 matching with PMDA data.

2.2 Data Display (The 4 Pillars)
Taste & Smell (①薬の味・におい): Derived from PMDA XML <char_desc> and Manufacturer Interview Forms (IF).

Good Compatibility (②相性の良い食品): Clinically verified foods that mask bitterness or improve intake (e.g., Chocolate, Condensed milk).

Bad Compatibility (③相性の悪い食品): Foods that increase bitterness (e.g., acidic juices for macrolides) or inhibit absorption.

Special Notes (④その他注意事項): Safety alerts (e.g., No honey for <1yr, iron-milk interaction).

2.3 Evidence-Based Logic
Priority 1: PMDA (Package Inserts), Manufacturer Interview Forms (IF).
Priority 2: Official guidelines from medical institutions such as:
    *   国立成育医療研究センター
    *   ほくしんファミリークリニック
    *   愛知医科大学
    *   CAPSクリニック
    *   東京都病院経営本部
    *   日本経済新聞社 (NIKKEI Medical)
Strict Prohibition: No personal blogs, SNS, or crowd-sourced "hacks."
Fallback: If no professional evidence exists, display "Information Not Available."

3. System Architecture & API Integration
3.1 PMDA Live Integration (Prototype Scope)
Trigger: On search or daily batch.
Action: Parse PMDA Open Data (XML) to fetch the latest "Description" and "Precautions."
    *   PMDA XML File Specification: [https://www.jpma.or.jp/information/evaluation/results/allotment/lofurc000000c744-att/xml_guidance.pdf](https://www.jpma.or.jp/information/evaluation/results/allotment/lofurc000000c744-att/xml_guidance.pdf)
Sync: Merge PMDA's latest text with the local "Food Compatibility Matrix."

3.2 Backend Data Structure (JSON)
The "Food Compatibility Matrix" must be maintained as a structured file (e.g., meds_master.json).
*   **Data Sourcing Strategy:** For stability, cost-effectiveness, and ensuring clear evidence sources for medical information, it is recommended to aggregate data into a Google Drive spreadsheet and output it via Google Apps Script (GAS) or directly reference it. Real-time investigation by AI for medical information is not recommended due to potential reliability issues, API costs, and difficulty in consistently citing sources.

JSON Example:
```json
{
  "yj_code": "6149002R1020",
  "brand_name": "Clarithromycin DS 10%",
  "manufacturer": "TAKATA",
  "taste_smell": "Chocolate",
  "good_compatibility": ["Vanilla Ice Cream", "Chocolate Cream", "Cocoa"],
  "bad_compatibility": ["Orange Juice", "Sport Drinks", "Apple Juice"],
  "special_notes": "Acidity dissolves the bitterness-masking coating.",
  "source": "Takata Seiyaku Interview Form / Hokushin General Hospital"
}
```

4. Technical Requirements
*   **Frontend Framework:** React/Next.js (Must use latest versions with vulnerability countermeasures applied).
*   **UI/UX Design:** Integrate as a feature within `drug-navigator`, adopting its existing design language and user experience (e.g., using Tailwind CSS).
*   **Version Control:** Git (GitHub repository).
*   **Deployment:** Cloudflare Pages (or similar Cloudflare services for Next.js applications).

5. Implementation Steps for Gemini Code Assist
Data Scrubbing: Generate a comprehensive JSON matrix from the provided URL sources (Clarithromycin, Ceftditoren, etc.) and official guidelines.
XML Parser: Build a service to fetch/parse PMDA XML files using the YJ code based on the provided XML guidance.
UI Component: Create a search interface using React/Next.js that handles the manufacturer-specific autocomplete, consistent with `drug-navigator`'s UI.
Logic Layer: Create a "Compatibility Engine" that compares the active ingredient and manufacturer to output specific warnings.
Testing: Implement unit and integration tests to ensure data accuracy and functional reliability.

6. Medication List Sort Order
The medication list must be sorted according to the following category order, with medications within each category sorted by YJ code (ascending):

1. **抗生剤 (Antibiotics)** - YJ Code 3-digit prefix: 611-624
   - 611: 主としてグラム陽性菌に作用するもの
   - 612: 主としてグラム陰性菌に作用するもの
   - 613: 主としてグラム陽性・陰性菌に作用するもの
   - 614: 主としてグラム陽性菌、マイコプラズマに作用するもの
   - 615: 主としてグラム陽性・陰性菌、リケッチア、クラミジアに作用するもの
   - 616: 主として抗酸菌に作用するもの
   - 617: 主としてカビに作用するもの
   - 619: その他の抗生物質製剤
   - 621: サルファ剤
   - 622: 抗結核剤
   - 623: 抗ハンセン病剤
   - 624: 合成抗菌剤
2. **抗ウイルス薬 (Antivirals)** - YJ Code 3-digit prefix: 625
3. **抗アレルギー薬 (Anti-allergy)** - YJ Code 2-digit prefix: 44
4. **その他 (Others)** - All other YJ codes in ascending order
5. **漢方薬 (Kampo/Herbal Medicine)** - YJ Code 2-digit prefix: 52

5. **漢方薬 (Kampo/Herbal Medicine)** - YJ Code 2-digit prefix: 52
6. **その他 (Others)** - All other YJ codes in ascending order

This sort order must be maintained when updating the medication database to ensure consistency and usability.

7. Print Specification
- **Target Page**: Registered Medication List (/medications)
- **Layout Reference**:
    - **Scaling**: Content scaled to 100% (original size) for maximum readability.
    - **Header**:
        - App Title & Icon
        - QR Code linking to `https://search-for-medicine.pages.dev/`
        - Page URL text
    - **Body**: Grid layout of medication cards (2 columns).
    - **Footer**: Standard browser footer (URL/Date/Page Number) or custom if needed.
- **Tech Stack**: CSS `@media print`, `react-qr-code`.