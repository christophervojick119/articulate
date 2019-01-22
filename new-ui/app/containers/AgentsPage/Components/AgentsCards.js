import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardHeader, Slide }  from '@material-ui/core';
import { Link } from 'react-router-dom';

import messages from '../messages';

const styles = {
  cardsContainer: {
    maxWidth: '990px',
  },
  newAgentCard: {
    border: '1px solid #00bd6f',
    height: '205px',
    width: '205px',
  },
  newAgentCardContent: {
    color: '#00bd6f',
    fontSize: '18px',
    fontFamily: 'Montserrat',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    display: 'grid',
    textAlign: 'center',
  },
  agentCard: {
    border: '1px solid #a2a7b1',
    height: '205px',
    width: '205px',
    cursor: 'pointer',
  },
  emptyCard: {
    border: 0,
    height: 0,
    width: 220,
    backgroundColor: 'transparent',
  },
  agentCardHeader: {
    color: '#4e4e4e',
    fontSize: '22px',
    fontFamily: 'Montserrat',
    textAlign: 'left',
  },
  agentNameCard: {
    fontSize: '18px',
  },
  agentCardContent: {
    color: '#979797',
    fontSize: '14px',
    fontFamily: 'Montserrat',
    textAlign: 'left',
    paddingTop: 0,
  },
  link:{
    textDecoration: 'none',
  },
  menuIcon: {
    float: 'right',
    top: '23px',
    right: '20px',
    cursor: 'pointer',
    position: 'relative',
  },
  trashIcon: {
    position: 'relative',
    top: '2px',
    marginRight: '5px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class AgentsCards extends React.Component {

    constructor(props){
      super(props)
      this.addEmptyCards = this.addEmptyCards.bind(this);
    }

    state = {
      selectedAgent: null,
    };

    addEmptyCards(numOfCards){
      const emptyCards = [];
      //the ui show 4 cards as max per row
      const numberOfRows = Math.ceil(numOfCards / 4);
      for (let index = 0; index < (numberOfRows * 4) - (1 + numOfCards); index++) {
        emptyCards.push(<Grid key={`emptyCard_${index}`} className={this.props.classes.emptyCard} />)
      }
      return emptyCards;
    };

    render(){
      const { classes, agents } = this.props;
      return (
        <Grid className={classes.cardsContainer} justify={window.window.innerWidth < 675 ? 'center' : 'space-between'} container spacing={16}>
          <Grid key='newAgentCard' item>
            <Link to='/agent/create' className={classes.link}>
              <Card className={classes.newAgentCard}>
                <CardContent className={classes.newAgentCardContent}>
                  <FormattedMessage {...messages.createAgent}/>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          {agents.map((agent, index) => (
            <Grid key={`agentCard_${index}`} item>
              <Card onClick={() => {this.props.onGoToUrl(`/agent/${agent.id}`)}} className={classes.agentCard}>
                <CardHeader className={classes.agentCardHeader} titleTypographyProps={{ className: classes.agentNameCard }} title={agent.agentName}/>
                <CardContent className={classes.agentCardContent}>{agent.description}</CardContent>
              </Card>
            </Grid>
          ))}
          {
            this.addEmptyCards(agents.length)
          }
        </Grid>
      )
    }
}

AgentsCards.propTypes = {
  classes: PropTypes.object.isRequired,
  agents: PropTypes.array.isRequired,
  onGoToUrl: PropTypes.func,
};

export default withStyles(styles)(AgentsCards);
