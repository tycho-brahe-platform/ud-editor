import api from '@/configs/api';

function models() {
  return api.get(`${import.meta.env.VITE_APP_PARSER_URL}/open/ud/models`);
}

function parse(sentence: string, parser: string) {
  const request = {
    data: sentence,
    model: parser,
  };

  return api.post(
    `${import.meta.env.VITE_APP_PARSER_URL}/open/ud/process`,
    request
  );
}

const UDService = { models, parse };
export default UDService;
