import { getPaginationMeta, PaginationState } from "../getPaginationMeta";

const MULTI_PAGE_FIRST_PAGE: PaginationState = {
    totalItems: 100,
    pageSize: 10,
    currentPage: 0,
};

describe("getPaginationMeta", () => {
    it("correctly calculates startIndex and lastIndex on the first page", () => {
        const meta = getPaginationMeta(MULTI_PAGE_FIRST_PAGE);
        expect(meta.startIndex).toBe(0);
        expect(meta.endIndex).toBe(9);
    });

    it("correctly calculates startIndex and endIndex on the second page", () => {
        const meta = getPaginationMeta({ ...MULTI_PAGE_FIRST_PAGE, currentPage: 1 });
        expect(meta.startIndex).toBe(10);
        expect(meta.endIndex).toBe(19);
    });

    it("correctly calculates startIndex and endIndex on the last page", () => {
        const meta = getPaginationMeta({ ...MULTI_PAGE_FIRST_PAGE, currentPage: 9 });
        expect(meta.startIndex).toBe(90);
        expect(meta.endIndex).toBe(99);
    });

    it("correctly calculates endIndex on a half-full last page", () => {
        const meta = getPaginationMeta({ totalItems: 92, pageSize: 10, currentPage: 9 });
        expect(meta.endIndex).toBe(91);
    });
});
