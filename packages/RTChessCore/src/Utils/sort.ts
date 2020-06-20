export interface CreatedAt {
 getCreatedAt: () => Date;
}

export const sortByCreatedAtASC = (a: CreatedAt, b: CreatedAt) => {
  return b.getCreatedAt().getTime() - a.getCreatedAt().getTime();
};
