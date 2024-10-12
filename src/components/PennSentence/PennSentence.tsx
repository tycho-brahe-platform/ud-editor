import AuthContext from '@/configs/AuthContext';
import { message, toastLoading } from '@/configs/store/actions';
import CytoscapeTreeConverter from '@/converter/CytoscapeTreeConverter';
import MessageUtils from '@/functions/MessageUtils';
import {
  default as parserService,
  default as ParserService,
} from '@/services/ParserService';
import Parser, { STANFORD_MODELS } from '@/types/model/Parser';
import { CytoscapeTree } from '@/types/model/Tree';
import { Autocomplete, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  sentence: string;
  setSentence: (s: string) => void;
  setTree: (c: CytoscapeTree | undefined) => void;
  setExpression: (s: string) => void;
};

export default function PennSentence({
  sentence,
  setSentence,
  setTree,
  setExpression,
}: Props) {
  const { t } = useTranslation('home');
  const { state, dispatch } = useContext(AuthContext);
  const [models, setModels] = useState<Parser[]>([]);
  const [model, setModel] = useState<Parser | null>(null);

  const handleChange = (option: Parser | null) => {
    setModel(option || null);
  };

  const getAvailableParsers = () => {
    parserService
      .available()
      .then((r) => {
        setModels(
          r.data
            .map((p) => ({ ...p, type: 'tycho' } as Parser))
            .concat(STANFORD_MODELS)
        );
      })
      .catch((error) => {
        console.error('Error fetching parsers:', error);
      });
  };

  const parse = () => {
    if (state.toastLoading || sentence === '' || model === null) return;
    dispatch(toastLoading(true));

    const promise =
      model.type === 'stanford'
        ? ParserService.stanford(sentence, model.id)
        : ParserService.parse(sentence, model.id);

    promise
      .then((r) => {
        setTree(new CytoscapeTreeConverter().execute(r.data.struct));
        setExpression(r.data.expression);
      })
      .catch((err) => {
        dispatch(message(MessageUtils.getError(err, t)));
      })
      .finally(() => {
        dispatch(toastLoading(false));
      });
  };

  const createOptionLabel = (option: Parser) => {
    const label = [option.name];
    label.push(
      option.type === 'stanford' ? ' - CoreNLP 4.5.6' : ' - Tycho Rule Parser'
    );
    return label.join('');
  };

  useEffect(() => {
    getAvailableParsers();
  }, []);

  return (
    <div className="penn-sentence-container">
      <Form.Control
        as="textarea"
        placeholder={t('placeholder.parse.sentence')}
        rows={12}
        className="sentence"
        value={sentence}
        onChange={(e) => {
          setSentence(e.target.value);
        }}
      />
      <div className="buttons">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          onChange={(event: any, newValue: Parser | null) => {
            handleChange(newValue);
          }}
          options={models}
          getOptionLabel={createOptionLabel}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Model" />}
        />

        <Button variant="success" className="ms-auto" onClick={parse}>
          <span>{t('button.label.execute')}</span>
        </Button>
      </div>
    </div>
  );
}
