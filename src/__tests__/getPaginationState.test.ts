import { getPaginationState } from "../getPaginationState";

const DEFAULT_STATE = {
    totalItems: 100,
    pageSize: 10,
    currentPage: 0,
};

/**
 * getPaginationState tests
 */
it("correctly calculates the total number of pages when totalItems > pageSize", () => {
    const { totalPages } = getPaginationState({ ...DEFAULT_STATE, totalItems: 2, pageSize: 1 });
    expect(totalPages).toBe(2);
});

it("correctly calculates the total number of pages when totalItems < pageSize", () => {
    const { totalPages } = getPaginationState({ ...DEFAULT_STATE, totalItems: 1, pageSize: 2 });
    expect(totalPages).toBe(1);
});

it("returns 0 pages when there are no items", () => {
    const { totalPages } = getPaginationState({ ...DEFAULT_STATE, totalItems: 0 });
    expect(totalPages).toBe(0);
});

it("returns false for previousEnabled when on the first page", () => {
    const { previousEnabled } = getPaginationState(DEFAULT_STATE);
    expect(previousEnabled).toBe(false);
});

it("returns true for previousEnabled when not on the first page", () => {
    const { previousEnabled } = getPaginationState({
        pageSize: 1,
        totalItems: 2,
        currentPage: 1,
    });
    expect(previousEnabled).toBe(true);
});

it("returns true for nextEnabled when not on the last page", () => {
    const { nextEnabled } = getPaginationState(DEFAULT_STATE);
    expect(nextEnabled).toBe(true);
});

it("returns false for nextEnabled when on the last page", () => {
    const { nextEnabled } = getPaginationState({ pageSize: 1, totalItems: 2, currentPage: 1 });
    expect(nextEnabled).toBe(false);
});
