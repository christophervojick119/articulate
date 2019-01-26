import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Button, InputAdornment  } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

import trashIcon from '../../../images/trash-icon.svg';

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
  categoryParameterInputContainer: {
    padding: '0px 12px !important',
  },
  addParameterButtonContainer: {
    padding: '15px 0px !important',
  },
  categoryParameterInput: {
    marginTop: '0px',
  },
  deleteIcon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
    float: 'right',
    marginRight: '24px',
    marginTop: '17px',
  }
};

/* eslint-disable react/prefer-stateless-function */
class CategoryParametersForm extends React.Component {

  render(){
    const { classes, intl, category } = this.props;
    return (
      <Grid item xs={12}>
        <Grid className={classes.formContainer} container item xs={12}>
          <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
            {Object.keys(category.parameters).map((parameter, parameterIndex) => (
              <Grid key={`value_${parameterIndex}`} container justify='space-between' spacing={24} item xs={12}>
                <Grid className={classes.categoryParameterInputContainer} item xs={6}>
                  <TextField
                    id='parameterName'
                    className={parameterIndex !== 0 ? classes.categoryParameterInput : ''}
                    value={parameter}
                    label={parameterIndex === 0 ? intl.formatMessage(messages.newCategoryParameterNameTextField) : null}
                    placeholder={intl.formatMessage(messages.newCategoryParameterNameTextFieldPlaceholder)}
                    onChange={(evt) => { this.props.onChangeParameterName(parameter, evt.target.value) }}
                    margin='normal'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid className={classes.categoryParameterInputContainer} item xs={6}>
                  <TextField
                    id='parameterValue'
                    className={parameterIndex !== 0 ? classes.categoryParameterInput : ''}
                    defaultValue={category.parameters[parameter]}
                    label={parameterIndex === 0 ? intl.formatMessage(messages.newCategoryParameterValueTextField) : null}
                    placeholder={intl.formatMessage(messages.newCategoryParameterValueTextFieldPlaceholder)}
                    onChange={(evt) => { this.props.onChangeParameterValue(parameter, evt.target.value) }}
                    margin='normal'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          style={{    
                            position: 'absolute',
                            left: '90%',
                            top: '17px'
                          }}
                          position="end"
                        >                
                          <img key={`deleteHeader_${parameterIndex}`} onClick={() => { this.props.onDeleteParameter(parameter) }} className={classes.deleteIcon} src={trashIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            ))}
            <Grid container item xs={12}>
                <Grid className={classes.addParameterButtonContainer} item xs={12}>
                  <Button className={classes.button} onClick={() => { this.props.onAddNewParameter({ name: '', value: ''}) } } variant='contained'>
                    <FormattedMessage {...messages.addParameter} />
                  </Button>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>  
    );
  }
}

CategoryParametersForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  errorState: PropTypes.object,
  category: PropTypes.object,
  onAddNewParameter: PropTypes.func,
  onDeleteParameter: PropTypes.func,
  onChangeParameterName: PropTypes.func,
  onChangeParameterValue: PropTypes.func,
};

export default injectIntl(withStyles(styles)(CategoryParametersForm));
