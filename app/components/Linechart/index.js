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
  curveStep,
} from 'd3';
import { axisBottom, axisLeft } from 'd3-axis';

import { forEachObjIndexed, sum } from 'ramda';
const ONE_DAY = 86400000;

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
  const zoom = zoomCreator().scaleExtent([1, 18]);

  const margins = {
    top: 15,
    right: 0,
    bottom: 24,
    left: 35,
  };

  // const ids = uniq(props.data.map(messages => messages.userId));
  const stack = stackCreator().keys(props.ids);
  const area = areaCreator()
    .curve(curveStep)
    .x(d => xScale(d.data.timestamp))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    // Cut when no messages since 31 days
    .defined(
      (d, i, data) =>
        data[i - 1]
          ? d.data.timestamp.getTime() - ONE_DAY * 31 <
            data[i - 1].data.timestamp
          : true,
    );

  const pointList = props.data;

  const xScale = scaleTime()
    .rangeRound([0, width - margins.left - margins.right])
    .domain(extent(pointList, d => d.timestamp));

  const yScale = scaleLinear()
    .range([height - margins.top - margins.bottom, 0])
    .domain([0, max(pointList, d => sum(props.ids.map(id => d[id])))]);

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
            key={props.ids[i]}
            fillOpacity="1"
            d={area(data)}
            fill={color(i)}
          />
        ))}
      </g>
      <g
        transform={`translate(${margins.left}, ${height - margins.bottom})`}
        ref={element => {
          if (element) {
            xAxisElement = select(element).call(xAxis);
          }
        }}
      />
      <g
        transform={`translate(${margins.left}, ${margins.top})`}
        ref={element => {
          if (element) {
            select(element).call(axisLeft(yScale));
          }
        }}
      />
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
  ids: PropTypes.arrayOf(String),
};

export default Linechart;
