import AuthContext from '@/configs/AuthContext';
import { message } from '@/configs/store/actions';
import CytoscapeTreeConverter from '@/converter/CytoscapeTreeConverter';
import MessageUtils from '@/functions/MessageUtils';
import ParserService from '@/services/ParserService';
import { CytoscapeTree } from '@/types/model/Tree';
import { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  expression: string;
  setSentence: (s: string) => void;
  setTree: (c: CytoscapeTree | undefined) => void;
  setExpression: (s: string) => void;
};

export default function PennExpression({
  expression,
  setSentence,
  setTree,
  setExpression,
}: Props) {
  const { t } = useTranslation('home');
  const { dispatch } = useContext(AuthContext);

  const replace = (curly: boolean) => {
    if (curly) {
      setExpression(expression.replaceAll('(', '[').replaceAll(')', ']'));
    } else {
      setExpression(expression.replaceAll('[', '(').replaceAll(']', ')'));
    }
  };

  const render = () => {
    if (expression === '') return;
    ParserService.render(expression)
      .then((r) => {
        setTree(new CytoscapeTreeConverter().execute(r.data.struct));
        setSentence(r.data.sentence);
        setExpression(r.data.expression);
      })
      .catch((err) => {
        dispatch(message(MessageUtils.getError(err, t)));
      });
  };

  return (
    <div className="penn-expression-container">
      <Form.Control
        className="expression"
        as="textarea"
        placeholder={t('placeholder.render.sentence')}
        value={expression}
        onChange={(e) => {
          setExpression(e.target.value);
        }}
        rows={26}
      />
      <div className="buttons">
        <Button variant="secondary" onClick={() => replace(false)}>
          {t('button.label.parentheses')}
        </Button>
        <Button
          variant="secondary"
          className="ms-3"
          onClick={() => replace(true)}
        >
          {t('button.label.brackets')}
        </Button>
        <Button variant="success" className="ms-auto" onClick={render}>
          <span>{t('button.label.execute')}</span>
        </Button>
      </div>
    </div>
  );
}
