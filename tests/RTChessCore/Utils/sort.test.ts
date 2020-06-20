import { CreatedAt, sortByCreatedAtASC } from '../../../packages/RTChessCore/src/Utils/sort';

describe("Sort", () => {
  describe("sortByCreatedAtASC", () => {
    test("Should sort with the newest first", () => {
      const one = { id: 1, getCreatedAt: () => new Date(1592125167570) };
      const two = { id: 2, getCreatedAt: () => new Date(1592125167570 + 10) };
      const three = { id: 3, getCreatedAt: () => new Date(1592125167570 + 345987) };
      const four = { id: 4, getCreatedAt: () => new Date(1592125167570 + 345987987) };

      const list: CreatedAt[] = [three, two, one, four];

      list.sort(sortByCreatedAtASC);

      expect(list).toStrictEqual([
        four,
        three,
        two,
        one
      ]);
    });
  });
});
