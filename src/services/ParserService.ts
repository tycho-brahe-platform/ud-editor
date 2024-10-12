import api from '@/configs/api';
import Parser from '@/types/model/Parser';
import ParserResponse from '@/types/response/ParserResponse';

function available() {
  return api.get<Parser[]>(
    `${import.meta.env.VITE_APP_PARSER_URL}/open/available`
  );
}

function render(expression: string) {
  return api.post<ParserResponse>(
    `${import.meta.env.VITE_APP_PARSER_URL}/open/expression`,
    {
      expression,
    }
  );
}

function parse(sentence: string, parser: string) {
  const request = {
    sentence,
    parser,
  };
  return api.post<ParserResponse>(
    `${import.meta.env.VITE_APP_PARSER_URL}/open/sentence`,
    request
  );
}

function stanford(sentence: string, parser: string) {
  const request = {
    sentence,
    parser,
  };
  return api.post<ParserResponse>(
    `${import.meta.env.VITE_APP_PARSER_URL}/open/stanford`,
    request
  );
}

const ParserService = { available, render, parse, stanford };
export default ParserService;
