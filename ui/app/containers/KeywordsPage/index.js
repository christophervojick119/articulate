/**
 *
 * KeywordsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import MainTab from 'components/MainTab';
import Form from './Components/Form';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import {
  makeSelectAgent,
  makeSelectKeywords,
  makeSelectTotalKeywords,
} from '../App/selectors';

import {
  loadKeywords,
  trainAgent,
  changeKeywordsPageSize,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class KeywordsPage extends React.Component {

  constructor(props){
    super(props);
    this.changePage = this.changePage.bind(this);
    this.movePageBack = this.movePageBack.bind(this);
    this.movePageForward = this.movePageForward.bind(this);
    this.onSearchKeyword = this.onSearchKeyword.bind(this);
    this.setNumberOfPages = this.setNumberOfPages.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
  }

  state = {
    filter: '',
    currentPage: 1,
    pageSize: this.props.agent.settings.keywordsPageSize,
    numberOfPages: null,
    totalKeywords: null,
  };

  componentWillMount() {
    if(this.props.agent.id) {
      this.props.onLoadKeywords('', this.state.currentPage, this.state.pageSize);
    }
    else {
      // TODO: An action when there isn't an agent
      console.log('YOU HAVEN\'T SELECTED AN AGENT');
    }
  }

  componentDidUpdate(){
    if (this.props.totalKeywords !== this.state.totalKeywords){
      this.setState({
        totalKeywords: this.props.totalKeywords,
      });
      this.setNumberOfPages(this.state.pageSize);
    }
  }

  setNumberOfPages(pageSize){
    const numberOfPages = Math.ceil(this.props.totalKeywords / pageSize);
    this.setState({
      numberOfPages,
    });
  }

  changePage(pageNumber){
    this.setState({
      currentPage: pageNumber,
    });
    this.props.onLoadKeywords(this.state.filter, pageNumber, this.state.pageSize);
  }

  movePageBack(){
    let newPage = this.state.currentPage;
    if (this.state.currentPage > 1){
      newPage = this.state.currentPage - 1;
    }
    this.changePage(newPage);
  }

  movePageForward(){
    let newPage = this.state.currentPage;
    if (this.state.currentPage < this.state.numberOfPages){
      newPage = this.state.currentPage + 1;
    }
    this.changePage(newPage);
  }

  changePageSize(pageSize){
    this.setState({
      currentPage: 1,
      pageSize,
    });
    this.props.onChangeKeywordsPageSize(this.props.agent.id, pageSize);
    this.props.onLoadKeywords(this.state.filter, 1, pageSize);
  }

  onSearchKeyword(filter){
    this.setState({
      filter,
    });
    this.props.onLoadKeywords(filter, this.state.currentPage, this.state.pageSize);
  }

  render() {
    return (
      <Grid container>
        <MainTab
          disableSave
          agentName={this.props.agent.agentName}
          onTrain={this.props.onTrain}
          agentStatus={this.props.agent.status}
          lastTraining={this.props.agent.lastTraining}
          enableTabs
          selectedTab="keywords"
          agentForm={Link}
          agentURL={`/agent/${this.props.agent.id}`}
          reviewURL={`/agent/${this.props.agent.id}/review`}
          reviewForm={Link}
          sayingsForm={Link}
          sayingsURL={`/agent/${this.props.agent.id}/sayings`}
          keywordsForm={
            <Form
              agentId={this.props.agent.id}
              onSearchKeyword={this.onSearchKeyword}
              keywords={this.props.keywords}
              onCreateKeyword={this.props.onCreateKeyword}
              currentPage={this.state.currentPage}
              pageSize={this.state.pageSize}
              numberOfPages={this.state.numberOfPages}
              changePage={this.changePage}
              changePageSize={this.changePageSize}
              movePageBack={this.movePageBack}
              movePageForward={this.movePageForward}
            />
          }
        />
      </Grid>
    );
  }
}

KeywordsPage.propTypes = {
  agent: PropTypes.object,
  keywords: PropTypes.array,
  onLoadKeywords: PropTypes.func,
  onTrain: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  keywords: makeSelectKeywords(),
  totalKeywords: makeSelectTotalKeywords(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadKeywords: (filter, page, pageSize) => {
      dispatch(loadKeywords(filter, page, pageSize));
    },
    onCreateKeyword: (url) => {
      dispatch(push(url))
    },
    onTrain: () => {
      dispatch(trainAgent());
    },
    onChangeKeywordsPageSize: (agentId, pageSize) => {
      dispatch(changeKeywordsPageSize(agentId, pageSize));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'keywords', saga });

export default compose(
  withSaga,
  withConnect
)(KeywordsPage);
