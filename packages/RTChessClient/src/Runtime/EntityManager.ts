export default class EntityManager {
}

let total = 0;

export const getEntityId = (): number => {
  return ++total;
};

