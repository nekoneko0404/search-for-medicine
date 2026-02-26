import { describe, it, expect } from 'vitest';
import { getRouteFromYJCode, processQuery, matchStatusFilter, groupDataByIngredient } from './logic';

describe('Watchlist Logic', () => {
    describe('getRouteFromYJCode', () => {
        it('should correctly determine routes', () => {
            expect(getRouteFromYJCode('1124017F2022')).toBe('内'); // 5th digit '0'
            expect(getRouteFromYJCode('4291413G1022')).toBe('注'); // 5th digit '4'
            expect(getRouteFromYJCode('2319702X1028')).toBe('外'); // 5th digit '7'
            expect(getRouteFromYJCode(null)).toBeNull();
            expect(getRouteFromYJCode('123')).toBeNull();
        });
    });

    describe('processQuery', () => {
        it('should split queries into include and exclude', () => {
            const result = processQuery('アセトアミノフェン ー小児');
            expect(result.include).toContain('アセトアミノフェン');
            expect(result.exclude).toContain('小児');
        });

        it('should handle multiple spaces', () => {
            const result = processQuery('  A   B  ');
            expect(result.include).toEqual(['a', 'b']);
        });
    });

    describe('matchStatusFilter', () => {
        it('should match statuses correctly', () => {
            const selected = ['通常出荷', '供給停止'];
            expect(matchStatusFilter('通常出荷', selected)).toBe(true);
            expect(matchStatusFilter('限定出荷', selected)).toBe(false);
            expect(matchStatusFilter('供給停止（在庫消尽をもって供給停止）', selected)).toBe(true);
            expect(matchStatusFilter('データなし', selected)).toBe(true);
        });
    });

    describe('groupDataByIngredient', () => {
        it('should group items and aggregate counts', () => {
            const data = [
                { ingredientName: 'Drug A', route: '内', category: 'A', shipmentStatus: '通常出荷' },
                { ingredientName: 'Drug A', route: '内', category: 'A', shipmentStatus: '通常出荷' },
                { ingredientName: 'Drug A', route: '内', category: 'A', shipmentStatus: '限定出荷' },
                { ingredientName: 'Drug B', route: '外', category: 'B', shipmentStatus: '供給停止' }
            ];
            const grouped = groupDataByIngredient(data);

            expect(grouped['Drug A|内']).toBeDefined();
            expect(grouped['Drug A|内'].counts.normal).toBe(2);
            expect(grouped['Drug A|内'].counts.limited).toBe(1);

            expect(grouped['Drug B|外']).toBeDefined();
            expect(grouped['Drug B|外'].counts.stopped).toBe(1);
        });
    });
});
