import React from 'react';
import Helmet from 'react-helmet';

import {
  Row,
  Col,
} from 'react-materialize';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Alert from 'react-s-alert';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import TableHeader from '../../components/TableHeader';
import ColorPicker from '../../components/ColorPicker';
import Preloader from '../../components/Preloader';

import { createEntity, resetStatusFlags } from '../../containers/App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectEntity,
  makeSelectError,
  makeSelectSuccess,
  makeSelectLoading,
  makeSelectIntentMissing,
  makeSelectInWizard,
} from '../../containers/App/selectors';

import {
  addExample,
  addSynonym,
  changeEntityData,
  removeExample,
  removeSynonym,
  switchColorPickerDisplay,
  closeColorPicker,
  resetEntityData,
} from './actions';
import Examples from './Components/Examples';

import messages from './messages';
import { makeSelectEntityData, makeDisplayColorPicker } from './selectors';

export class EntityPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
  }

  componentWillMount() {
    this.props.resetForm();
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onChangeEntityData('agent', currentAgent.agentName);
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if (currentAgent !== this.props.currentAgent) {
      this.props.onChangeEntityData('agent', currentAgent.agentName);
    }
  }

  onChangeInput(evt, field) {
    this.props.onChangeEntityData(field, evt.target.value);
  }

  componentDidUpdate() {
    if (this.props.success){
      Alert.success(messages.successMessage.defaultMessage, {
          position: 'bottom'
      });
      this.props.onSuccess.bind(null, this.props.inWizard)();
    }

    if (this.props.error){
      Alert.error(this.props.error.message, {
          position: 'bottom'
      });
    }
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.lastExample.scrollIntoView(true);
  };

  render() {
    const { loading, error, success, entity, displayColorPicker, currentAgent } = this.props;
    const entityProps = {
      loading,
      error,
      success,
      entity,
      displayColorPicker,
    };

    let breadcrumbs = [];
    if (currentAgent){
      breadcrumbs = [{ link: `/agent/${currentAgent.id}`, label: `Agent: ${currentAgent.agentName}`}, { label: '+ Creating entities'},];
    }
    else {
      breadcrumbs = [{ label: '+ Creating entities'}, ];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          { entityProps.loading ? <Preloader color='#00ca9f' size='big' /> : null }
        </Col>
        <Helmet
          title="Create Entity"
          meta={[
            { name: 'description', content: 'Create an entity' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} />
        <Content>
          <ContentHeader title={messages.createEntityTitle} subTitle={messages.createEntityDescription} />
          <Form>
            <Row>
              <FormTextInput
                label={messages.entityName}
                placeholder={messages.entityNamePlaceholder.defaultMessage}
                inputId="entityName"
                onChange={(evt) => this.onChangeInput(evt, 'entityName')}
                required
                s={10}
              />
              <InputLabel s={2} text={messages.entityColor} />
              <ColorPicker color={this.props.entityData.uiColor}
                handleClose={this.props.handleClose}
                handleClick={this.props.handleClick}
                handleColorChange={this.props.handleColorChange}
                displayColorPicker={this.props.displayColorPicker}
                s={2}
              />
              <InputLabel text={messages.examples} />
            </Row>
          </Form>

          <TableContainer id={'examplesTable'}>
            <Table>
              <TableHeader
                columns={[
                  {
                    label: messages.valueColumn.defaultMessage,
                    tooltip: messages.valueColumnTooltip.defaultMessage,
                    width: '30%',
                  },
                  {
                    label: messages.synonymsColum.defaultMessage,
                    tooltip: messages.synonymsColumTooltip.defaultMessage,
                    width: '70%',
                  },
                ]}
              />
              <Examples
                examples={this.props.entityData.examples}
                addExampleFunction={this.props.onAddExample}
                removeExampleFunction={this.props.onRemoveExample}
                removeSynonymFunction={this.props.onRemoveSynonym}
                addSynonymFunction={this.props.onAddSynonym}
              />
            </Table>
          </TableContainer>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(el) => {
              this.lastExample = el;
            }}
          >
          </div>
          <ActionButton label={messages.actionButton} onClick={this.props.onSubmitForm.bind(null, this.props.inWizard)} />
        </Content>
      </div>
    );
  }
}

EntityPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  entity: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onChangeEntityData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  onRemoveExample: React.PropTypes.func,
  onAddExample: React.PropTypes.func,
  onRemoveSynonym: React.PropTypes.func,
  onAddSynonym: React.PropTypes.func,
  entityData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  resetForm: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeEntityData: (field, value) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(changeEntityData({ value, field }));
    },
    onRemoveExample: (example, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(removeExample(example));
    },
    onAddExample: (evt) => {
      if (evt.charCode === 13) {
        dispatch(dispatch(resetStatusFlags()));
        dispatch(addExample(evt.target.value));
        evt.target.value = null;
      }
    },
    onRemoveSynonym: (example, synonym, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(removeSynonym({ example, synonym }));
    },
    onAddSynonym: (exampleValue, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      if (evt.charCode === 13) {
        dispatch(addSynonym({ example: exampleValue, synonym: evt.target.value }));
        evt.target.value = null;
      }
    },
    onSubmitForm: (inWizard, evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createEntity());
    },
    handleClick: () => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(switchColorPickerDisplay());
    },
    handleClose: () => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(closeColorPicker());
    },
    handleColorChange: (color) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(changeEntityData({ value: color, field: 'uiColor' }));
    },
    resetForm: () => {
      dispatch(resetEntityData());
    },
    onSuccess: (inWizard) =>{
      dispatch(resetStatusFlags());
      if (inWizard){
        dispatch(push('/wizard/intent'));
      }
      else {
        dispatch(push('/entities'));
      }
    }
  };
}

const mapStateToProps = createStructuredSelector({
  entity: makeSelectEntity(),
  entityData: makeSelectEntityData(),
  displayColorPicker: makeDisplayColorPicker(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  success: makeSelectSuccess(),
  inWizard: makeSelectInWizard(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityPage);
