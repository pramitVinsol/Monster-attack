import React from "react";

const Moves = (props) => (
  <div className="MovesContainer">
    <div className="MonsterMove"><b>{props.move.monsterMove}</b></div>
    <div className="PlayerMove"><b>{props.move.playerMove}</b></div>
  </div>
);

Moves.defaultProps = {
  move: {
    monsterMove: '',
    playerMove: ''
  }
};

export default Moves;