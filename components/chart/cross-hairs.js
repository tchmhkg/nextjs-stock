import React from "react";
import classNames from "classnames";

const CrossHairs = props => {
  const { x, y, chart_dims } = props;

  if (x + y === 0) {
    return <></>;
  }

  return (
    <>
      <line
        x1={0}
        y1={y}
        x2={chart_dims.pixel_width}
        y2={y}
        className={classNames({
          cross_hair: true,
          horz: true
        })}
      />
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={chart_dims.pixel_height}
        className={classNames({
          cross_hair: true,
          vert: true
        })}
      />
    </>
  );
};

export default CrossHairs;
