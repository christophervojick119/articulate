/*
 * ConversationBar
 *
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';

import { Grid, Typography, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import rightArrowIcon from '../../images/right-arrow-icon.svg';

import messages from './messages';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { 
  makeSelectNotifications,
  makeSelectMessages,
  makeSelectAgent,
  makeSelectWaitingResponse,
  makeSelectConversationStateObject,
  makeSelectSettings 
} from '../../containers/App/selectors';

import {
  closeNotification,
  sendMessage,
  resetSession,
  loadSettings,
} from '../../containers/App/actions';

import LoadingWave from '../LoadingWave';
import CodeModal from '../CodeModal';
import Notifications from './components/Notifications';
import gravatars from '../Gravatar';

const styles = {
  container: {
    height: '100%',
    width: '300px',
    position: 'fixed',
    zIndex: 1,
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderLeft: '1px solid #c5cbd8',
  },
  clearAll: {
    borderBottom: '1px solid #979797',
    borderLeft: '1px solid #979797',
    borderRight: '1px solid #979797',
    borderRadius: '0px 0px 3px 3px',
    height: '30px',
    width: '85px',
    position: 'fixed',
    top: '0px',
    right: '107px',
    backgroundColor: '#f6f7f8',
  },
  clearAllLabel: {
    paddingTop: '5px',
    paddingLeft: '16px',
    fontSize: '12px',
    fontWeight: 300,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  toggle: {
    cursor: 'pointer',
    height: '35px',
    width: '25px',
    borderRadius: '3px 0px 0px 3px',
    position: 'fixed',
    right: '300px',
    top: '20px',
    zIndex: 2,
    backgroundColor: '#00c582',
    boxShadow: '0 1px 4px 1px #00bd6f',
  },
  arrow: {
    paddingTop: '10px',
    paddingLeft: '8px',
    height:'25px',
  },
  inputContainer: {
    padding: '10px',
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: 298,
  },
  messagesContainer: {
    marginRight: '20px',
    marginTop: '20px',
  },
  userMessage: {
    '&:hover': {
      boxShadow: '0 2px 10px 0px #000000',
    },
    color: '#fff',
    backgroundColor: '#00bd6f',
    borderRadius: '3px',
    padding: '8px',
    wordBreak: 'break-word'
  },
  userMessageContainer: {
    position: 'relative',
    display: '-webkit-box',
    display: '-moz-box',
    display: '-ms-flexbox',
    display: '-webkit-flex',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
    marginRight: '12px',
    marginLeft: '60px',
  },
  agentMessage: {
    '&:hover': {
      boxShadow: '0 2px 10px 0px #000000',
    },
    color: '#4A4A4A',
    borderRadius: '3px',
    padding: '8px',
    marginRight: '60px',
    marginLeft: '15px',
    marginBottom: '16px',
  },
  agentName: {
    display: 'block',
    marginLeft: '15px',
    fontWeight: '500',
    fontSize: '10px',
    marginBottom: '3px',
  },
  messageSource: {
    '&:hover': {
      textDecoration: 'underline',
    },
    cursor: 'pointer',
    fontSize: '10px',
    display: 'block',
    marginTop: '10px',
  },
  contentContainer: {
    width: '317px',
    position: 'fixed',
    top: '50px',
    bottom: '95px',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  agentIcon: {
    marginRight: '5px',
    height: '20px',
    position: 'relative',
    top: '3px',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class ConversationBar extends React.PureComponent {

  state = {
    userMessage: '',
    repeatPreviousMessage: null,
    openCodeModal: false,
  };

  componentWillMount() {
    if (!this.props.settings.defaultAgentLanguage){
      this.props.onLoadSettings();
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView(true);
  };

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.container}>
        <Grid onClick={() => this.props.onResetSession()} container className={classes.clearAll}>
          <Typography className={classes.clearAllLabel}>
            {intl.formatMessage(messages.clearAll)}
          </Typography>
        </Grid>
        <Grid container onClick={() => { this.props.onToggleConversationBar(false) }} className={classes.toggle}>
          <img className={classes.arrow} src={rightArrowIcon}></img>
        </Grid>
        <Grid className={classes.contentContainer}>
          <Notifications notifications={this.props.notifications} onCloseNotification={this.props.onCloseNotification} />
          <Grid className={classes.messagesContainer}>
            {
              this.props.messages.map((message, index) => {
                if (message.author === 'User'){
                  return (
                    <Grid key={`message_${index}`} item className={classes.userMessageContainer}>
                      <Typography className={classes.userMessage}>
                        {message.message}
                      </Typography>
                    </Grid>
                  );
                }

                return (
                  <Grid key={`message_${index}`}>
                    <Typography style={{ color: this.props.agent.uiColor}} className={classes.agentName}>
                      {this.props.agent.gravatar !== '' ? gravatars[this.props.agent.gravatar - 1]({ color: this.props.agent.uiColor, className: classes.agentIcon }) : null}
                      {message.author}
                    </Typography>
                    <Typography style={{ border: `1px solid ${this.props.agent.uiColor}`}} className={classes.agentMessage}>
                      {message.message}
                      {message.docId ?
                        <span onClick={() => { this.setState({openCodeModal: true, conversationStateObject: message.conversationStateObject })}} className={classes.messageSource}>
                          {'</> '}<span className={classes.messageSourceLink}>{intl.formatMessage(messages.seeSource)}</span>
                        </span>
                        : null}
                    </Typography>
                  </Grid>
                );

              })
            }
            {
              this.props.waitingResponse ?
                <LoadingWave agentName={<Typography style={{ color: this.props.agent.uiColor}} className={classes.agentName}>
                {this.props.agent.gravatar !== '' ? gravatars[this.props.agent.gravatar - 1]({ color: this.props.agent.uiColor, className: classes.agentIcon }) : null}
                {this.props.agent.agentName}
              </Typography>} /> :
                null
            }
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            >
            </div>
          </Grid>
        </Grid>
        <Grid container className={classes.inputContainer}>
          <Grid item xs={12}>
            <TextField
              id='userMessage'
              value={this.state.userMessage}
              placeholder={intl.formatMessage(messages.userMessagePlaceholder)}
              onChange={(evt) => { this.setState({ userMessage: evt.target.value }) }}
              onKeyDown={(evt) => {
                if(evt.key === 'Enter' && evt.target.value !== ''){
                  evt.preventDefault();
                  this.props.onSendMessage(evt.target.value);
                  this.setState({
                    userMessage: '',
                  })
                }
                if (evt.key === 'ArrowUp') {
                  if (this.props.messages.length > 0) {
                    const messages = this.props.messages;
                    let len = this.state.repeatPreviousMessage || messages.length;
                    let message = null;

                    while (len-- && !message) {
                      if (messages[len].author === "User") {
                        this.state.repeatPreviousMessage = len;
                        message = messages[len].message;
                      }
                    }

                    evt.target.value = message;
                  }
                }
              }}
              margin='normal'
              fullWidth
            />
          </Grid>
        </Grid>
        <CodeModal handleClose={() => { this.setState({ openCodeModal: false }) }} conversationStateObject={this.state.conversationStateObject} open={this.state.openCodeModal} />
      </Grid>
    );
  }
}

ConversationBar.propTypes = {
  classes: PropTypes.object,
  intl: intlShape.isRequired,
  notifications: PropTypes.array,
  conversationStateObject: PropTypes.object,
  onResetSession: PropTypes.func,
  onCloseNotification: PropTypes.func,
  onSendMessage: PropTypes.func,
}; 

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  notifications: makeSelectNotifications(),
  messages: makeSelectMessages(),
  waitingResponse: makeSelectWaitingResponse(),
  conversationStateObject: makeSelectConversationStateObject(),
  settings: makeSelectSettings(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetSession: () => {
      dispatch(resetSession());
    },
    onCloseNotification: (index) => {
      dispatch(closeNotification(index));
    },
    onSendMessage: (message) => {
      dispatch(sendMessage({
        author: 'User',
        message,
      }));
    },
    onLoadSettings: () => {
      dispatch(loadSettings())
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// const withSaga = injectSaga({ key: 'keywordsEdit', saga });

const withDefinedStyles = withStyles(styles);

export default compose(
  withDefinedStyles,
  withConnect,
  injectIntl,
)(ConversationBar);
