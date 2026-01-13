import SentenceItem from '@/types/SentenceItem';
import { types, UserStore } from './types';

function reducer(state: UserStore, action: any): UserStore {
  switch (action.type) {
    case types.CONLLU:
      return {
        ...state,
        conllu: action.payload,
      };
    case types.SET_SENTENCES:
      return {
        ...state,
        sentences: action.payload as SentenceItem[],
      };
    case types.SET_SELECTED_INDEX:
      return {
        ...state,
        selectedIndex: action.payload as number,
      };
    case types.UPDATE_SENTENCE_STATUS:
      const { index, status } = action.payload as {
        index: number;
        status: string;
      };
      const updatedSentences = state.sentences.map((sentence, i) => {
        if (i === index) {
          const updatedConllu = {
            ...sentence.conllu,
            attributes: {
              ...sentence.conllu.attributes,
              text_status: status,
            },
          };
          return { ...sentence, textStatus: status, conllu: updatedConllu };
        }
        return sentence;
      });
      const updatedState = {
        ...state,
        sentences: updatedSentences,
      };
      // If the updated sentence is the currently selected one, also update the current conllu
      if (state.selectedIndex === index) {
        updatedState.conllu = updatedSentences[index].conllu;
      }
      return updatedState;
    default:
      return state;
  }
}

export default reducer;
