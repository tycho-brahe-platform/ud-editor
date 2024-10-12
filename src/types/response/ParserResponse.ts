import { Struct } from '../model/Struct';

type ParserResponse = {
  sentence: string;
  struct: Struct;
  expression: string;
};

export default ParserResponse;
