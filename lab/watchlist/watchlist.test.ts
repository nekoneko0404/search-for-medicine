import { describe, it, expect } from 'vitest';
import { getRouteFromYJCode, processQuery, matchStatusFilter, groupDataByIngredient, summarizeBy9DigitYJ, getStatusPriority } from './logic';

describe('Watchlist Logic', () => {
    it('getStatusPriority assigns correct values to statuses', () => {
        expect(getStatusPriority('供給停止')).toBe(1);
        expect(getStatusPriority('限定出荷・解除予定なし')).toBe(2);
        expect(getStatusPriority('通常出荷')).toBe(3);
        expect(getStatusPriority('データなし')).toBe(9);
    });
    it('summarizeBy9DigitYJ groups items by first 9 digits and counts statuses', () => {
        const mockData = [
            { yjCode: '1234567011', shipmentStatus: '通常出荷' },
            { yjCode: '1234567012', shipmentStatus: '限定出荷' },
            { yjCode: '1234567013', shipmentStatus: '通常出荷' },
            { yjCode: '9999999011', shipmentStatus: '停止' },
        ];
        const summary = summarizeBy9DigitYJ(mockData);
        expect(summary['123456701']).toEqual({ normal: 2, limited: 1, stopped: 0 });
        expect(summary['999999901']).toEqual({ normal: 0, limited: 0, stopped: 1 });
    });

    it('matchStatusFilter works for various status strings', () => {
        expect(matchStatusFilter('通常出荷', ['通常出荷'])).toBe(true);
        expect(matchStatusFilter('限定出荷・解除予定なし', ['限定出荷'])).toBe(true);
        expect(matchStatusFilter('供給停止・全規格', ['供給停止'])).toBe(true);
        expect(matchStatusFilter('データなし', ['通常出荷'])).toBe(true);
    });

    it('processQuery handles include and exclude terms', () => {
        const res = processQuery('アセト -錠');
        expect(res.include).toContain('アセト');
        expect(res.exclude).toContain('錠');
    });

    it('getRouteFromYJCode identifies routes correctly', () => {
        expect(getRouteFromYJCode('1149022F1020')).toBe('内');
        expect(getRouteFromYJCode('4291401A1010')).toBe('注');
        expect(getRouteFromYJCode('2649709M1010')).toBe('外');
    });

    it('groupDataByIngredient groups data correctly', () => {
        const mockData = [
            { ingredientName: 'A', route: '内', shipmentStatus: '通常出荷', yjCode: '123456701' },
            { ingredientName: 'A', route: '内', shipmentStatus: '限定出荷', yjCode: '123456702' },
            { ingredientName: 'B', route: '外', shipmentStatus: '停止', yjCode: '999999901' },
        ];
        const grouped = groupDataByIngredient(mockData);
        expect(grouped['A|内'].counts.normal).toBe(1);
        expect(grouped['A|内'].counts.limited).toBe(1);
        expect(grouped['B|外'].counts.stopped).toBe(1);
    });
});
