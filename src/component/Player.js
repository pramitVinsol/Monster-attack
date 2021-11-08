import React from "react";

const Player = (props) => {
  const divStyle = {
    width: `${props.maxHealth}%`,
  };
  return (
    <div className={`Player ${props.type}`}>
      <h1 className="PlayerType">{props.type}
      </h1>
      <div className="Progress">
        <div class={`progress-bar bg-${props.color}`} style={divStyle} aria-valuemin="0" aria-valuemax="100">{`${props.maxHealth}%`}</div>
      </div>
    </div>
  );
};

Player.defaultProps = {
  maxHealth: 100,
  type: ''
};

export default Player;