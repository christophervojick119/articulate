import {
  Button,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import _ from 'lodash';

import PropTypes from 'prop-types';
import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import Immutable from 'seamless-immutable';

import addActionIcon from '../../../images/add-action-icon.svg';
import clearIcon from '../../../images/clear-icon.svg';
import pencilIcon from '../../../images/pencil-icon.svg';
import searchIcon from '../../../images/search-icon.svg';

import trashIcon from '../../../images/trash-icon.svg';

import messages from '../messages';

import SayingRow from './SayingRow';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  deleteCell: {
    width: '20px',
  },
  deleteIcon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
  },
  highlightLabel: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
  pagesLabel: {
    color: '#a2a7b1',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageControl: {
    marginTop: '5px',
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    khtmlUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  pageSubControl: {
    display: 'inline',
  },
  pageNumberSubControl: {
    display: 'inline',
    float: 'right',
  },
  pageTextfield: {
    width: '75px',
    margin: '5px',
    marginTop: '0px !important',
    direction: 'ltr',
  },
  pageCursors: {
    cursor: 'pointer',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageCursorsDisabled: {
    display: 'inline',
    padding: '5px',
    color: '#a2a7b1',
    top: '39px',
    position: 'relative',
  },
  pageSizeLabels: {
    display: 'inline',
    margin: '0px 5px',
    top: '39px',
    position: 'relative',
  },
  categorySelect: {
    '&:hover': {
      backgroundColor: '#fff',
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      borderRight: 'none',
    },
    '&:focus': {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      borderRight: 'none',
    },
    backgroundColor: '#f6f7f8',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    borderRight: 'none',
  },
  sayingInput: {
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
  },
  searchCategoryContainer: {
    minWidth: '288px',
    borderBottom: '1px solid #4e4e4e',
  },
  searchCategoryField: {
    width: '200px',
    paddingLeft: '5px',
    fontSize: '14px',
  },
  addCategoryButton: {
    width: '62px',
    height: '26px',
    top: '3px',
  },
  categoryDataContainer: {
    display: 'inline',
  },
  editCategoryIcon: {
    '&:hover': {
      filter: 'invert(1)',
    },
    position: 'relative',
    top: '2px',
    marginLeft: '10px',
  },
  clearIconContainer: {
    display: 'inline',
    width: '100px',
  },
  clearIcon: {
    position: 'relative',
    top: '15px',
    left: '60px',
  },
  sayingInputContainer: {
    border: '1px solid #a2a7b1',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  addActionIcon: {
    cursor: 'pointer',
    marginRight: '10px',
  },
  actionBackgroundContainer: {
    '&:hover': {
      backgroundColor: '#4e4e4e',
      color: '#fff',
    },
    cursor: 'pointer',
    margin: '0px 5px 0px 5px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#e2e5e7',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
  },
  actionLabel: {
    textDecoration: 'none',
    color: 'inherit',
  },
  deleteActionX: {
    '&:hover': {
      fontWeight: 'bold',
    },
    paddingLeft: '5px',
    fontWeight: 300,
    cursor: 'pointer',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SayingsDataForm extends React.Component {

  state = {
    filterInput: '',
    filteringCategories: false,
    categoriesDropdownOpen: false,
    errorCategory: false,
    openActions: false,
    anchorEl: null,
    changedPage: false,
  };

  scrollToNextPageCursor() {
    const pageControl = document.querySelector('#pageControl');
    if (pageControl) {
      pageControl.scrollIntoView(true);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.currentPage !== nextProps.currentPage || this.props.sayingsPageSize !== nextProps.sayingsPageSize) {
      this.setState({
        changedPage: true,
      });
    }
    else {
      if (!_.isEqual(Immutable.asMutable(this.props.sayings, { deep: true }), Immutable.asMutable(nextProps.sayings, { deep: true }))) {
        this.setState({
          changedPage: false,
        });
      }
    }
  }

  componentDidUpdate() {
    if (this.state.changedPage) {
      this.scrollToNextPageCursor();
    }
  }

  render() {
    const { classes, intl, sayings, category, userSays } = this.props;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
          <Grid container item xs={12}>
            <Grid item lg={2} md={2} sm={4} xs={4}>
              <TextField
                select
                id='category'
                value={category || 'select'}
                label={intl.formatMessage(messages.categorySelect)}
                onClick={
                  () => {
                    this.setState({
                      changedPage: false,
                      categoriesDropdownOpen: !this.state.categoriesDropdownOpen,
                    });
                  }
                }
                onChange={(evt) => {
                  if (['filter', 'create', 'no results'].indexOf(evt.target.value) === -1) {
                    this.props.onSelectCategory(evt.target.value);
                  }
                  this.setState({
                    changedPage: false,
                    categoriesDropdownOpen: false,
                  });
                }}
                margin='normal'
                fullWidth
                inputProps={{
                  className: classes.categorySelect,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={this.state.errorCategory ? intl.formatMessage(messages.requiredField) : ''}
                error={this.state.errorCategory}
              >
                {category || this.state.categoriesDropdownOpen ? null :
                  <MenuItem key='select' value='select'>
                    <FormattedMessage {...messages.categorySelectDefault} />
                  </MenuItem>}
                <MenuItem className={classes.searchCategoryContainer} value="filter">
                  <Grid container justify='flex-end'>
                    <img src={searchIcon} />
                    <Input
                      inputProps={{
                        style: {
                          border: 'none',
                        },
                      }}
                      value={this.state.filterInput}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        return 0;
                      }}
                      disableUnderline
                      className={classes.searchCategoryField}
                      onChange={(evt) => {
                        this.setState({
                          filteringCategories: evt.target.value.length > 0,
                          filterInput: evt.target.value,
                        });
                        this.props.onSearchCategory(evt.target.value);
                      }}
                    />
                    {
                      this.state.filteringCategories ?
                        <div className={classes.clearIconContainer}>
                          <img
                            onClick={(evt) => {
                              evt.stopPropagation();
                              this.props.onSearchCategory('');
                              this.setState({
                                filteringCategories: false,
                                filterInput: '',
                              });
                              return 0;
                            }} className={classes.clearIcon} src={clearIcon}
                          />
                        </div>
                        :
                        <Button
                          onClick={() => {
                            this.props.onGoToUrl(`/agent/${this.props.agentId}/category/create`);
                          }} className={classes.addCategoryButton} variant='contained'
                        ><FormattedMessage {...messages.categoryAdd} /></Button>
                    }
                  </Grid>
                </MenuItem>
                {
                  this.state.filteringCategories ?
                    this.props.agentFilteredCategories.length > 0 ?
                      this.props.agentFilteredCategories.map((filteredCategory, index) => (
                        <MenuItem key={`category_${index}`} value={filteredCategory.id}>
                          <Grid container justify='space-between'>
                            <div className={classes.categoryDataContainer}>
                              <span>{filteredCategory.categoryName}</span>
                            </div>
                            {
                              filteredCategory.id === category && !this.state.categoriesDropdownOpen ?
                                null :
                                <div className={classes.categoryDataContainer}>
                                  <span>{filteredCategory.actionThreshold * 100}%</span>
                                  <img
                                    onClick={() => {
                                      this.props.onGoToUrl(`/agent/${this.props.agentId}/category/${filteredCategory.id}`);
                                    }} className={classes.editCategoryIcon} src={pencilIcon}
                                  />
                                </div>
                            }
                          </Grid>
                        </MenuItem>
                      ))
                      :
                      [<MenuItem key='no results' value='no results'>
                        <FormattedMessage {...messages.categoryNoResults} />
                      </MenuItem>,
                        <MenuItem key='create' value='create'>
                          <Button
                            onClick={() => {
                              this.props.onGoToUrl(`/agent/${this.props.agentId}/category/create`);
                            }} className={classes.addCategoryButton} variant='contained'
                          ><FormattedMessage {...messages.categoryAdd} /></Button>
                        </MenuItem>]
                    :
                    this.props.agentCategories.map((agentCategory, index) => (
                      <MenuItem key={`category_${index}`} value={agentCategory.id}>
                        <Grid container justify='space-between'>
                          <div className={classes.categoryDataContainer}>
                            <span>{agentCategory.categoryName}</span>
                          </div>
                          {
                            agentCategory.id === category && !this.state.categoriesDropdownOpen ?
                              null :
                              <div className={classes.categoryDataContainer}>
                                <span>{agentCategory.actionThreshold * 100}%</span>
                                <img
                                  onClick={() => {
                                    this.props.onGoToUrl(`/agent/${this.props.agentId}/category/${agentCategory.id}`);
                                  }} className={classes.editCategoryIcon} src={pencilIcon}
                                />
                              </div>
                          }
                        </Grid>
                      </MenuItem>
                    ))
                }
              </TextField>
            </Grid>
            <Grid item lg={10} md={10} sm={8} xs={8}>
              <TextField
                id='newSaying'
                defaultValue={userSays || undefined}
                label={intl.formatMessage(messages.sayingTextField)}
                placeholder={intl.formatMessage(messages.sayingTextFieldPlaceholder)}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    if (!category || category === '' || category === 'select') {
                      this.setState({
                        errorCategory: true,
                      });
                    }
                    else {
                      this.setState({
                        errorCategory: false,
                      });
                      ev.preventDefault();
                      this.props.onAddSaying(ev.target.value);
                      ev.target.value = '';
                    }
                  }
                }}
                margin='normal'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  className: classes.sayingInput,
                  style: {
                    border: 'none',
                  },
                }}
                InputProps={{
                  className: classes.sayingInputContainer,
                  endAdornment: (
                    <InputAdornment position="end">
                      {this.props.newSayingActions.map((action, index) => {
                        let actionId = this.props.agentActions.filter((agentAction) => agentAction.actionName === action);
                        actionId = actionId ? (Array.isArray(actionId) && actionId.length > 0 ? actionId[0].id : 2) : null;
                        return (
                          <div key={`newSayingAction_${index}`} className={classes.actionBackgroundContainer}>
                            <span
                              className={classes.actionLabel}
                              onClick={() => {
                                this.props.onClearSayingToAction();
                                this.props.onGoToUrl(`/agent/${this.props.agentId}/action/${actionId}`);
                              }}
                            >{action.length > 5 ? <Tooltip title={action} placement='top'><span>{`${action.substring(0, 5)}...`}</span></Tooltip> : action}</span>
                            <a
                              onClick={() => {
                                this.props.onDeleteNewSayingAction(action);
                              }} className={classes.deleteActionX}
                            >x</a>
                          </div>
                        );
                      })}
                      <img
                        id='addActions'
                        className={classes.addActionIcon}
                        src={addActionIcon}
                        onClick={(evt) => {
                          this.setState({
                            changedPage: false,
                            openActions: true,
                            anchorEl: evt.currentTarget,
                          });
                        }}
                      >
                      </img>
                    </InputAdornment>
                  ),
                }}
              />
              <Select
                style={{
                  display: 'none',
                }}
                open={this.state.openActions}
                onClose={() => {
                  this.setState({
                    changedPage: false,
                    openActions: false,
                    anchorEl: null,
                  });
                }}
                onOpen={() => {
                  this.setState({
                    changedPage: false,
                    openActions: true,
                  });
                }}
                value={1}
                onChange={(evt) => {
                  this.setState({
                    changedPage: false,
                    openActions: false,
                    anchorEl: null,
                  });
                  if (evt.target.value === 'create') {
                    this.props.onClearSayingToAction();
                    this.props.onGoToUrl(`/agent/${this.props.agentId}/action/create`);
                  }
                  else {
                    //If the user didn't click the edit icon
                    if (!evt._targetInst || (evt._targetInst && evt._targetInst.type !== 'img')) {
                      //Then add the saying for the new action
                      this.props.onAddNewSayingAction(evt.target.value);
                    }
                  }
                }}
                MenuProps={{
                  anchorEl: this.state.anchorEl,
                }}
              >
                <MenuItem value='create'><FormattedMessage className={classes.newItem} {...messages.newAction} /></MenuItem>
                {
                  this.props.agentActions.map((action) => (
                    this.props.newSayingActions.indexOf(action.actionName) === -1 ?
                      <MenuItem
                        style={{ width: '200px' }}
                        key={`action_${action.id}`}
                        value={action.actionName}
                      >
                        <Grid container justify='space-between'>
                          <div className={classes.categoryDataContainer}>
                            <span>{action.actionName.length > 15 ? `${action.actionName.substring(0, 15)}...` : action.actionName}</span>
                          </div>
                          <div className={classes.categoryDataContainer}>
                            <img
                              id={`edit_action_${action.id}`}
                              onClick={() => {
                                this.props.onGoToUrl(`/agent/${this.props.agentId}/action/${action.id}`);
                              }} className={classes.editCategoryIcon} src={pencilIcon}
                            />
                          </div>
                        </Grid>
                      </MenuItem> :
                      null
                  ))
                }
              </Select>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            {sayings.length > 0 ?
              <Grid container>
                <Typography className={classes.highlightLabel}>
                  <FormattedMessage {...messages.highlightTooltip} />
                </Typography>
                <Table>
                  <TableBody>
                    {sayings.map((saying, index) => (
                      <TableRow key={`${saying}_${index}`}>
                        <TableCell>
                          <SayingRow
                            agentId={this.props.agentId}
                            saying={saying}
                            onDeleteAction={this.props.onDeleteAction}
                            agentKeywords={this.props.agentKeywords}
                            agentActions={this.props.agentActions}
                            agentCategories={this.props.agentCategories}
                            onTagKeyword={this.props.onTagKeyword}
                            onUntagKeyword={this.props.onUntagKeyword}
                            onAddAction={this.props.onAddAction}
                            onGoToUrl={this.props.onGoToUrl}
                            onSendSayingToAction={this.props.onSendSayingToAction}
                          />
                        </TableCell>
                        <TableCell className={classes.deleteCell}>
                          <img
                            onClick={() => {
                              this.props.onDeleteSaying(saying.id, saying.category);
                            }} className={classes.deleteIcon} src={trashIcon}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Grid id='pageControl' className={classes.pageControl} item xs={12}>
                  <Grid className={classes.pageSubControl}>
                    <Typography className={classes.pageSizeLabels}>
                      <FormattedMessage {...messages.show} />
                    </Typography>
                    <TextField
                      select
                      className={classes.pageTextfield}
                      id='pageSize'
                      value={this.props.sayingsPageSize}
                      onChange={(evt) => {
                        this.props.changePageSize(evt.target.value);
                      }}
                      margin='normal'
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      <MenuItem key={5} value={5}>
                        5
                      </MenuItem>
                      <MenuItem key={10} value={10}>
                        10
                      </MenuItem>
                      <MenuItem key={25} value={25}>
                        25
                      </MenuItem>
                      <MenuItem key={50} value={50}>
                        50
                      </MenuItem>
                    </TextField>
                    <Typography className={classes.pageSizeLabels}>
                      <FormattedMessage {...messages.entries} />
                    </Typography>
                  </Grid>
                  <Grid className={classes.pageNumberSubControl}>
                    <Typography onClick={this.props.currentPage > 1 ? this.props.movePageBack : null} className={this.props.currentPage > 1 ? classes.pageCursors : classes.pageCursorsDisabled}>
                      <FormattedMessage {...messages.backPage} />
                    </Typography>
                    <TextField
                      id='page'
                      margin='normal'
                      value={this.props.currentPage}
                      onChange={(evt) => {
                        evt.target.value === '' ?
                          this.props.changePage(1) :
                          (evt.target.value <= this.props.numberOfPages && evt.target.value >= 0 ?
                            this.props.changePage(evt.target.value) :
                            false);
                      }}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        style: {
                          textAlign: 'center',
                        },
                        min: 1,
                        max: this.props.numberOfPages,
                        step: 1,
                      }}
                      className={classes.pageTextfield}
                      type='number'
                    />
                    <Typography className={classes.pagesLabel}>
                      / {this.props.numberOfPages}
                    </Typography>
                    <Typography onClick={this.props.currentPage < this.props.numberOfPages ? this.props.movePageForward : null} className={this.props.currentPage < this.props.numberOfPages ? classes.pageCursors : classes.pageCursorsDisabled}>
                      <FormattedMessage {...messages.nextPage} />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid> :
              null
            }
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SayingsDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  sayings: PropTypes.array,
  agentId: PropTypes.string,
  sayingsPageSize: PropTypes.number,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  onAddSaying: PropTypes.func.isRequired,
  onDeleteSaying: PropTypes.func.isRequired,
  onDeleteAction: PropTypes.func.isRequired,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onAddAction: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  currentPage: PropTypes.number,
  numberOfPages: PropTypes.number,
  changePage: PropTypes.func,
  movePageBack: PropTypes.func,
  movePageForward: PropTypes.func,
  changePageSize: PropTypes.func,
  onSelectCategory: PropTypes.func,
  category: PropTypes.string,
  userSays: PropTypes.string,
  onSearchCategory: PropTypes.func,
  newSayingActions: PropTypes.array,
  onAddNewSayingAction: PropTypes.func,
  onDeleteNewSayingAction: PropTypes.func,
  onClearSayingToAction: PropTypes.func,
};

export default injectIntl(withStyles(styles)(SayingsDataForm));
