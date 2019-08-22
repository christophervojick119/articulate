import _ from 'lodash';
import { MODEL_AGENT, MODEL_ACTION, MODEL_WEBHOOK } from '../../../util/constants';

module.exports = async function ({ actionData, CSO }) {
    
    const { agentService, globalService } = await this.server.services();
    
    //This will initialize the slots in the current action and also will return the required slots of the action
    const requiredSlots = _.filter(actionData.slots, (slot) => {

        return slot.isRequired;
    });
    const missingSlots = _.filter(requiredSlots, (slot) => {

        if (CSO.currentAction.slots[slot.slotName] && Array.isArray(CSO.currentAction.slots[slot.slotName])){
            return CSO.currentAction.slots[slot.slotName].length === 0;
        }
        return (CSO.currentAction.slots[slot.slotName].value !== undefined && !CSO.currentAction.slots[slot.slotName].value) 
            || (CSO.currentAction.slots[slot.slotName].value === undefined && !CSO.currentAction.slots[slot.slotName].from && !CSO.currentAction.slots[slot.slotName].to);
    });
    CSO.slots = CSO.currentAction.slots;
    if (missingSlots.length > 0) {
        let missingSlotIndex = null;
        missingSlots.some((missingSlot, tempMissingSlotIndex) => {

            CSO.currentAction.slots[missingSlot.slotName].promptCount += 1;
            if (missingSlot.promptCountLimit === undefined || missingSlot.promptCountLimit === null || missingSlot.promptCountLimit >= CSO.currentAction.slots[missingSlot.slotName].promptCount){
                missingSlotIndex = tempMissingSlotIndex;
                return true;
            }
            return false;
        });
        if (missingSlotIndex !== null){
            const missingSlot = missingSlots[missingSlotIndex];
            const response = await agentService.converseCompileResponseTemplates({ responses: missingSlot.textPrompts, templateContext: CSO, isTextPrompt: true, promptCount: CSO.currentAction.slots[missingSlot.slotName].promptCount});
            return { ...response, quickResponses: missingSlots[0].quickResponses, fulfilled: false };
        }
        return { slotPromptLimitReached: true }
    }

    if (actionData.useWebhook || CSO.agent.useWebhook) {
        let modelPath, webhook;
        if (actionData.useWebhook){
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: CSO.agent.id
                },
                {
                    model: MODEL_ACTION,
                    id: actionData.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
            webhook = await globalService.findInModelPath({ modelPath, isFindById: false, isSingleResult: true });
        }
        else {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: CSO.agent.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
            webhook = await globalService.findInModelPath({ modelPath, isFindById, isSingleResult, skip, limit, direction, field });
        }
        const webhookResponse = await agentService.converseCallWebhook({
            url: webhook.webhookUrl,
            templatePayload: webhook.webhookPayload,
            payloadType: webhook.webhookPayloadType,
            method: webhook.webhookVerb,
            headers: webhook.webhookHeaders,
            username: webhook.webhookUser ? webhook.webhookUser : undefined,
            password: webhook.webhookPassword ? webhook.webhookPassword : undefined,
            templateContext: CSO
        });
        if (webhookResponse.textResponse) {
            return { slots: CSO.context.actionQueue[CSO.actionIndex].slots, textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions : [], fulfilled: true, webhook: webhookResponse };
        }
        CSO.webhook = { ...webhookResponse };
        const response = await agentService.converseCompileResponseTemplates({ responses: actionData.responses, templateContext: CSO });
        return { slots: CSO.context.actionQueue[CSO.actionIndex].slots, ...response, quickResponses: actionData.quickResponses, webhook: webhookResponse, fulfilled: true };
    }
    const response = await agentService.converseCompileResponseTemplates({ responses: actionData.responses, templateContext: CSO });
    return { slots: CSO.context.actionQueue[CSO.actionIndex].slots, ...response, quickResponses: actionData.quickResponses, fulfilled: true };
};
