/**
 *
 * PieChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { pie, arc } from 'd3';
import './styles.css';

function PieChart(props) {
  const width = props.width || 50;
  const height = props.height || 50;
  const radius = props.width / 2;
  return (
    <svg width={width} height={height} className="pie-chart--scene">
      <g transform={`translate(${radius}, ${radius})`}>
        {pie()(props.values).map(d => (
          <path
            key={`${d.value}-${d.index}`}
            d={arc()
              .outerRadius(radius - 1)
              .innerRadius(0)(d)}
          />
        ))}
      </g>
    </svg>
  );
}

PieChart.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number),
};

export default PieChart;
