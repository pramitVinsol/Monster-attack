import React from 'react';
import Button from './Button';

const Action = (props) => (
  <div className="actions">
    <Button actionType="attack" clicked={props.onAttackClicked} type="danger">Attack</Button>
    <Button actionType="special-attack" clicked={props.onSpecialAttackClicked} isDisabled={props.isDisabled} type="warning">Special Attack</Button>
    <Button actionType="heal" clicked={props.onHealClicked} type="success">Heal</Button>
    <Button actionType="give-up" clicked={props.onResetClicked} type="dark">Give Up</Button>
  </div>
);

Action.defaultProps = {
  isDisabled: false,
  onAttackClicked: () => {},
  onHealClicked: () => {},
  onResetClicked: () => {},
  onSpecialAttackClicked: () => {}
};

export default Action;