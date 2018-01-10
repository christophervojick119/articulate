import {
  agentDomainsLoaded,
  agentDomainsLoadingError,
  agentEntitiesLoaded,
  agentEntitiesLoadingError,
  agentsLoaded,
  agentsLoadingError,
  intentCreated,
  intentCreationError,
  scenarioCreated,
  scenarioCreationError,
} from 'containers/App/actions';
import {
  CREATE_INTENT,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENT_ENTITIES,
  LOAD_AGENTS,
} from 'containers/App/constants';
import {
  makeSelectIntentData,
  makeSelectScenarioData,
} from 'containers/IntentPage/selectors';
import _ from 'lodash';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import request from 'utils/request';

function* postScenario(intentId, intentName) {
  const scenarioData = yield select(makeSelectScenarioData());

  scenarioData.intent = intentName;
  if (!scenarioData.useWebhook){
    delete scenarioData.webhookUrl
  }

  const requestURL = `http://127.0.0.1:8000/intent/${intentId}/scenario`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scenarioData),
  };

  try {
    const scenario = yield call(request, requestURL, requestOptions);
    yield put(scenarioCreated(scenario, scenario.id));
  } catch (error) {
    const errorData = yield error.json();
    yield put(scenarioCreationError({
      ...errorData,
    }));
  }
}

export function* postIntent() {
  const intentData = yield select(makeSelectIntentData());

  const examples = _.map(intentData.examples, (example) => {
    example.entities.forEach(entity => {
      example.userSays = example.userSays.replace(entity.value, `{${entity.entity}}`);
    });
    return example.userSays;
  });

  intentData.examples = examples;

  const requestURL = `http://127.0.0.1:8000/intent`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(intentData),
  };

  try {
    const intent = yield call(request, requestURL, requestOptions);
    yield call(postScenario, intent.id, intent.intentName);
    yield put(intentCreated(intent, intent.id));
  } catch (error) {
    const errorData = yield error.json();
    yield put(intentCreationError({
      ...errorData,
    }));
  }
}

export function* createIntent() {
  const watcher = yield takeLatest(CREATE_INTENT, postIntent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgents() {
  const requestURL = `http://127.0.0.1:8000/agent`;

  try {
    const agents = yield call(request, requestURL);
    yield put(agentsLoaded(agents));
  } catch (error) {
    const errorData = yield error.json();
    yield put(agentsLoadingError({
      ...errorData,
    }));
  }
}

export function* loadAgents() {
  const watcher = yield takeLatest(LOAD_AGENTS, getAgents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgentDomains(payload) {
  const agentId = payload.agentId.split('~')[0];
  const requestURL = `http://127.0.0.1:8000/agent/${agentId}/domain`;

  try {
    const agentDomains = yield call(request, requestURL);
    yield put(agentDomainsLoaded(agentDomains));
  } catch (error) {
    const errorData = yield error.json();
    yield put(agentDomainsLoadingError({
      ...errorData,
    }));
  }
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgentEntities(payload) {
  const agentId = payload.agentId.split('~')[0];
  const requestURL = `http://127.0.0.1:8000/agent/${agentId}/entity`;

  try {
    const agentEntities = yield call(request, requestURL);
    yield put(agentEntitiesLoaded(agentEntities));
  } catch (error) {
    const errorData = yield error.json();
    yield put(agentEntitiesLoadingError({
      ...errorData,
    }));
  }
}

export function* loadAgentEntities() {
  const watcher = yield takeLatest(LOAD_AGENT_ENTITIES, getAgentEntities);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  createIntent,
  loadAgents,
  loadAgentDomains,
  loadAgentEntities,
];
