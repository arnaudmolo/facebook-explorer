import {
  set,
  pipe,
  groupBy,
  map,
  values,
  sort,
  head,
  lensProp,
  reduce,
  countBy,
} from 'ramda';

const groupByHours = groupBy(
  d =>
    `${d.datetime.getHours()}-${d.datetime.getDate()}-${d.datetime.getMonth()}-${d.datetime.getFullYear()}`,
);
const groupByMinutes = groupBy(d => `${d.datetime.getHours()}`);
const getDefaultIndexes = reduce((p, i) => set(lensProp(i), 0, p), {});
const chronologicalSort = sort(
  (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
);
const countByUserId = countBy(u => u.userId);

export function orderByDate(xAccessory, ids) {
  const defaultIndexes = getDefaultIndexes(ids);
  return pipe(
    groupByHours,
    map(messages => ({
      ...defaultIndexes,
      ...countByUserId(messages),
      timestamp: xAccessory(head(messages)),
    })),
    values,
    chronologicalSort,
  );
}

export function agregateByHours(xAccessory, ids) {
  const defaultIndexes = getDefaultIndexes(ids);
  return pipe(
    groupByMinutes,
    map(messages => {
      const baseDate = xAccessory(head(messages));
      const date = new Date();
      date.setHours(baseDate.getHours());
      date.setMinutes(baseDate.getMinutes());

      return {
        ...defaultIndexes,
        ...countByUserId(messages),
        timestamp: date,
      };
    }),
    values,
    chronologicalSort,
  );
}
