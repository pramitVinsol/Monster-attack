import Action from './component/Action';
import Moves from './component/Moves';
import Player from './component/Player';
import { Component } from "react";

class MonsterAttack extends Component {

  constructor(){
    super();
    this.state = {
      isGameStarted: false,
      isSpecialAttackAvailable: true,
      moves: [],
      players: {
        normal: {maxHealth: 0},
        monster: {maxHealth: 0}
    }
    }
  }

  createPlayer = ({maxHealth, maxAttackDamage, maxHeal = 10, minAttackDamage = 1, specialAttackMaxDamage = 20, specialAttackMinDamage = 10, type, color}) => {
    return {
      maxAttackDamage,
      maxHeal,
      maxHealth,
      minAttackDamage,
      specialAttackMaxDamage,
      specialAttackMinDamage,
      type,
      color
    }
  };

  genarateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  startGameHandle = () => {
    let players = {
      normal: {...this.createPlayer({maxAttackDamage: 10, maxHealth: 100, type: 'Player', color:'success'})},
      monster: {...this.createPlayer({maxAttackDamage: 20, maxHealth: 100, maxHeal: 0, type: 'Monster', color:'danger'})}
    };

    this.setState({ players, isGameStarted: true });
  };

  attackDamageGenerator = (players, type) => {
    let playerAttackDamage = 0, monsterAttackDamage = 0;
    const { normal, monster } = players;

    switch (type) {
      case 'special':
        playerAttackDamage = this.genarateRandomNumber(normal.specialAttackMinDamage, normal.specialAttackMaxDamage);
        break;
      case 'normal':
        playerAttackDamage = this.genarateRandomNumber(normal.minAttackDamage, normal.maxAttackDamage);
        break;
      default:
        break;
    }

    monsterAttackDamage = this.genarateRandomNumber(monster.minAttackDamage, monster.maxAttackDamage);

    return {
      playerAttackDamage,
      monsterAttackDamage
    };
  };

  movesGenerator = (type, monsterAttackDamage, playerAttackDamage) => {
    let monsterMove = '', playerMove = '';
    const monsterHardDamage = monsterAttackDamage > 14 ? `HARD` : ``;
    const playerHardDamage = playerAttackDamage > 14 ? `HARD` : ``;

    switch (type) {
      case 'normal':
        monsterMove = `MONSTER HITS PLAYER FOR ${monsterHardDamage} ${monsterAttackDamage}`;
        playerMove = `PLAYER HITS MONSTER FOR ${playerAttackDamage}`;
        break;

      case 'special':
        monsterMove = `MONSTER HITS PLAYER FOR ${monsterHardDamage} ${monsterAttackDamage}`;
        playerMove = `PLAYER HITS MONSTER FOR ${playerHardDamage} ${playerAttackDamage} WITH SPECIAL ATTACK`;
        break;

      case 'heal':
        monsterMove = `MONSTER HITS PLAYER FOR ${monsterHardDamage} ${monsterAttackDamage}`;
        playerMove = `PLAYER HEALS FOR 10`;
        break;

      default:
        break;
    }

    return {
      monsterMove,
      playerMove
    }
  };

  isSpecialAttackAvailable = (updatePlayer) => {
    return updatePlayer.maxHealth > 90;
  };

  attack = (updatedPlayers, monsterAttackDamage, playerAttackDamage) => {
    const { normal, monster } = updatedPlayers;
    normal.maxHealth -= monsterAttackDamage;
    monster.maxHealth -= playerAttackDamage;
    this.setState({ isSpecialAttackAvailable: this.isSpecialAttackAvailable(normal)});
  };

  heal = (updatedPlayers, monsterAttackDamage) => {
    const { normal } = updatedPlayers;
    normal.maxHealth += normal.maxHeal;
    normal.maxHealth -= monsterAttackDamage;
    if(normal.maxHealth > 100) normal.maxHealth = 100;
    this.setState({ isSpecialAttackAvailable: this.isSpecialAttackAvailable(normal)});
  };

  updateMoves = (attackType, monsterAttackDamage, playerAttackDamage) => {
    let move = this.movesGenerator(attackType, monsterAttackDamage, playerAttackDamage);
    let updatedMoves = this.state.moves;
    updatedMoves = [move].concat(updatedMoves);
    this.setState({moves: updatedMoves});
  };

  declareWinner = () => {
    const { normal, monster } = this.state.players;
    if(normal.maxHealth <= 0) {
      alert('Monster won the battle!');
      this.resetHandler();
    } else if(monster.maxHealth <= 0) {
      alert('Player won the battle!');
      this.resetHandler();
    } else if(normal.maxHealth <= 0 && monster.maxHealth <= 0) {
      alert('Battle tied!');
      this.resetHandler();
    }
  };

  initAttack = (attackType, moveType) => {
    let updatedPlayers = {...this.state.players};
    let attackDamage = this.attackDamageGenerator(updatedPlayers, attackType);
    const { monsterAttackDamage, playerAttackDamage } = attackDamage;
    this.attack(updatedPlayers, monsterAttackDamage, playerAttackDamage);
    this.updateMoves(moveType, monsterAttackDamage, playerAttackDamage);
    this.setState({players: updatedPlayers});
    this.declareWinner();
  };

  attackHandler = () => {
    this.initAttack('normal', 'normal');
  };

  specialAttackHandler = () => {
    this.initAttack('special', 'special');
  };

  playerHealHandler = () => {
    let updatedPlayers = {...this.state.players};
    if(updatedPlayers.normal.maxHealth > 100) return;
    let attackDamage = this.attackDamageGenerator(updatedPlayers, 'normal');
    const { monsterAttackDamage } = attackDamage;
    this.heal(updatedPlayers, monsterAttackDamage);
    this.updateMoves('heal', monsterAttackDamage, null);
    this.setState({players: updatedPlayers});
    this.declareWinner();
  };

  resetHandler = () => {
    let updatedPlayers = {...this.state.players};
    const { normal, monster } = updatedPlayers;
    normal.maxHealth = 100;
    monster.maxHealth = 100;
    this.setState({ isGameStarted: false, isSpecialAttackAvailable: true, moves:[], players: updatedPlayers});
  };

  renderPlayers = () => Object.keys(this.state.players).map(key => <Player key={key} {...this.state.players[key]}/>);

  renderMoves = () => this.state.moves.map((move, index) => <Moves move={move} key={index} />);

  render () {
    return this.state.isGameStarted ?
      <div className="Main">
        <section className="Section1">
          <div className="Players">
            {this.renderPlayers()}
          </div>
          <div className="ActionsContainer">
            <Action
              isDisabled={!this.state.isSpecialAttackAvailable}
              onAttackClicked={this.attackHandler}
              onHealClicked={this.playerHealHandler}
              onResetClicked={this.resetHandler}
              onSpecialAttackClicked={this.specialAttackHandler} />
          </div>
        </section>
        <div className="Section2">
          {this.renderMoves()}
        </div>
      </div> : <button className="btn btn-primary start" onClick={this.startGameHandle}>Start</button>;
  };
};

export default MonsterAttack;