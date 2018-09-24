/**
 *
 * Linechart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { scaleTime, scaleLinear } from 'd3-scale';
import { area as areaCreator } from 'd3-shape';
import { extent, max } from 'd3-array';
import {
  stack as stackCreator,
  scaleOrdinal,
  select,
  zoom as zoomCreator,
  event as d3event,
  zoomIdentity,
} from 'd3';
import { axisBottom, axisLeft } from 'd3-axis';
// import { select } from 'd3-selection';
// import { axisBottom, axisLeft } from 'd3-axis';

import {
  uniq,
  forEachObjIndexed,
  set,
  pipe,
  groupBy,
  map,
  values,
  sort,
  length,
  head,
  last,
  lensProp,
  reduce,
  sum,
} from 'ramda';

function mapDataToStack(xAccessory, ids) {
  const ONE_DAY = 86400000;
  const defaultIndexes = ids.reduce((p, i) => set(lensProp(i), 0, p), {});

  return pipe(
    groupBy(
      d =>
        `${d.datetime.getHours()}-${d.datetime.getDate()}-${d.datetime.getMonth()}-${d.datetime.getFullYear()}`,
    ),
    map(messages => ({
      ...defaultIndexes,
      ...map(length, groupBy(u => u.userId, messages)),
      timestamp: xAccessory(head(messages)),
    })),
    values,
    sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    reduce((state, message) => {
      const previous = last(state);
      if (!previous) {
        return [message];
      }
      if (message.timestamp.getTime() - ONE_DAY * 31 > previous.timestamp) {
        return [
          ...state,
          {
            ...defaultIndexes,
            timestamp: new Date(
              new Date(previous.timestamp.getTime()).setDate(
                previous.timestamp.getDate() + 1,
              ),
            ),
          },
          {
            ...defaultIndexes,
            timestamp: new Date(
              new Date(message.timestamp.getTime()).setDate(
                message.timestamp.getDate() - 1,
              ),
            ),
            prev: true,
          },
          message,
        ];
      }
      return [...state, message];
    }, []),
    // map(m => {
    //   const total = ids.reduce((p, i) => p + m[i], 0);
    //   return {
    //     ...m,
    //     ...ids.reduce(
    //       (p, i) =>
    //         set(lensProp(i), total === 0 ? 1 / ids.length : m[i] / total, p),
    //       {},
    //     ),
    //   };
    // }),
    sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
  );
}

const zoom = zoomCreator().scaleExtent([1 / 4, 8]);

const color = scaleOrdinal().range([
  '#be5926',
  '#686cc8',
  '#57b14b',
  '#ae56c2',
  '#a6b447',
  '#ce4685',
  '#52ae88',
  '#d64546',
  '#5b9ed4',
  '#df8b30',
  '#c681bd',
  '#c49c40',
  '#aa5159',
  '#6d7631',
  '#d88c6c',
]);

function Linechart(props) {
  const { width, height } = props;

  const margins = {
    top: 10,
    right: 0,
    bottom: 0,
    left: 0,
  };

  const ids = uniq(props.data.map(messages => messages.userId));
  const stack = stackCreator().keys(ids);
  const area = areaCreator()
    .x(d => xScale(d.data.timestamp))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));

  const pointList = mapDataToStack(d => d.datetime, ids)(props.data);

  const xScale = scaleTime()
    .rangeRound([0, width - margins.left - margins.right])
    .domain(extent(pointList, d => d.timestamp));

  const yScale = scaleLinear()
    .range([height - margins.top - margins.bottom, 0])
    .domain([0, max(pointList, d => sum(ids.map(id => d[id])))]);

  zoom
    .translateExtent([[-width, -Infinity], [2 * width, Infinity]])
    .on('zoom', zoomed);

  let xAxisElement;

  const xAxis = axisBottom(xScale);
  const stacked = stack(pointList);

  const refs = {};
  function zoomed() {
    const xz = d3event.transform.rescaleX(xScale);
    xAxisElement.call(xAxis.scale(xz));
    area.x(d => xz(d.data.timestamp));
    forEachObjIndexed((ref, key) => ref.attr('d', area(stacked[key])))(refs);
  }

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margins.left}, ${margins.top})`}>
        {stacked.map((data, i) => (
          <path
            ref={element => {
              if (element) {
                refs[i] = select(element);
              }
            }}
            key={ids[i]}
            fillOpacity="1"
            d={area(data)}
            fill={color(i)}
          />
        ))}
        <g
          ref={element => {
            if (element) {
              xAxisElement = select(element).call(xAxis);
            }
          }}
        />
        <g
          ref={element => {
            if (element) {
              select(element).call(axisLeft(yScale));
            }
          }}
        />
      </g>
      <rect
        ref={element => {
          if (element) {
            select(element).call(zoom, zoom.transform, zoomIdentity);
          }
        }}
        width={width}
        height={height}
        fill="none"
        pointerEvents="all"
      />
    </svg>
  );
}

Linechart.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Linechart;
