import CytoscapeTreeConverter from '@/converter/CytoscapeTreeConverter';
import { CytoscapeTree } from '@/types/model/Tree';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  setTree: (c: CytoscapeTree) => void;
};

export default function PennExpression({ setTree }: Props) {
  const { t } = useTranslation('home');
  const [value, setValue] = useState('');

  const render = () => {
    if (!value) return;
    const tree = new CytoscapeTreeConverter().execute(JSON.parse(value));
    tree && setTree(tree);
  };

  return (
    <div className="tycho-format-container">
      <Form.Control
        className="expression"
        as="textarea"
        placeholder={t('placeholder.render.tycho')}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        rows={26}
      />
      <div className="buttons">
        <Button variant="success" className="ms-auto" onClick={render}>
          <span>{t('button.label.execute')}</span>
        </Button>
      </div>
    </div>
  );
}
