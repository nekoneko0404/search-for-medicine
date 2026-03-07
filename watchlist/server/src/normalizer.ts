/**
 * 医薬品コード名寄せエンジン
 * レセコンから出力される様々な形式のコードを YJコード(12桁)に変換、または正規化します。
 */

export class CodeNormalizer {
    /**
     * 全角英数字を半角に変換します。
     */
    private static toHalfWidth(str: string): string {
        return str.replace(/[！-～]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        }).replace(/　/g, " ");
    }

    /**
     * 入力されたコードを解析し、正規化された形式に変換します。
     */
    static normalize(code: string): string {
        if (!code) return "";

        // 1. 全角→半角変換 & トリム
        let cleanCode = this.toHalfWidth(code).trim();

        // 2. 記号で分割して、各パーツを調べる（ラベルとコードを切り離すため）
        // コロン、ハイフン、スペース、カッコ等で分割
        const parts = cleanCode.split(/[:：\-\s\.\(\)（）|｜【】\[\]]/).filter(p => p.length > 0);

        for (const part of parts) {
            const alphanumericPart = part.replace(/[^0-9A-Z]/gi, "").toUpperCase();

            // 優先度1: 12桁 YJコード
            if (alphanumericPart.length === 12) {
                // ラベル（CODE, YJ等）だけで構成されていないかチェック
                if (!/^(CODE|RESE|YJCODE|ITEMID)$/.test(alphanumericPart)) {
                    return alphanumericPart;
                }
            }

            // 優先度2: 9桁 レセ電算/厚労省
            if (alphanumericPart.length === 9) {
                if (/^[0-9]{9}$/.test(alphanumericPart)) {
                    return alphanumericPart;
                }
            }
        }

        // 3. 分割で見つからなかった場合、文字列全体から数字と英字のみを抽出して再試行
        let alphanumericOnly = cleanCode.replace(/[^0-9A-Z]/gi, "").toUpperCase();

        // ラベルと思われる単語を先頭から除去
        alphanumericOnly = alphanumericOnly.replace(/^(CODE|YJ|NO|ID|RESE|ITEM|REF)+/, "");

        if (alphanumericOnly.length >= 12) {
            // 12桁 YJコードと思われる部分を抽出
            const yjMatch = alphanumericOnly.match(/[0-9]{1,9}[0-9A-Z]{3,11}/);
            if (yjMatch && yjMatch[0].length === 12) return yjMatch[0];
            return alphanumericOnly.slice(0, 12);
        }

        if (alphanumericOnly.length >= 9) {
            const numMatch = alphanumericOnly.match(/[0-9]{9}/);
            if (numMatch) return numMatch[0];
            return alphanumericOnly.slice(0, 9);
        }

        return alphanumericOnly;
    }

    /**
     * CSV 等から抽出された複数のコードを一括で正規化します。
     */
    static batchNormalize(codes: string[]): string[] {
        return codes.map(c => this.normalize(c)).filter(c => c !== "");
    }
}
