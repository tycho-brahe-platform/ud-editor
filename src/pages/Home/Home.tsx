import ConlluViewer from '@/components/ConlluViewer';
import Header from '@/components/Header';
import UDTreeView from '@/components/UDTreeView';
import ConlluUtils from '@/functions/ConlluUtils';
import { Conllu } from '@/types/model/Conllu';
import {
  faDownload,
  faExpand,
  faUpRightAndDownLeftFromCenter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

export default function Home() {
  const { t } = useTranslation('home');
  const [resetTree, setResetTree] = useState(false);
  const [expand, setExpand] = useState(false);

  const [value, setValue] = useState('');
  const [conllu, setConllu] = useState<Conllu>();

  const [sentence, setSentence] = useState<string>('');

  const render = (data: string) => {
    if (!data) return;
    const conlluSentence = ConlluUtils.convertToSentence(data);
    setSentence(conlluSentence.attributes.text);
    setConllu(conlluSentence);
  };

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="sentence-container">
          <Form.Control
            placeholder={t('placeholder.parse.sentence')}
            className="sentence"
            value={sentence}
            onChange={(e) => {
              setSentence(e.target.value);
            }}
          />
        </div>
        <Card className="conllu-container">
          <Card.Header>
            <span>CoNLL-U</span>
            <div className="buttons">
              <Button
                variant="success"
                className="ms-auto"
                onClick={() => render(value)}
              >
                <span>{t('button.label.render')}</span>
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Form.Control
              className="expression"
              as="textarea"
              placeholder={t('placeholder.render.conllu')}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              rows={15}
            />
          </Card.Body>
        </Card>

        {conllu && (
          <Card className="ud-viewer-container">
            <Tab.Container defaultActiveKey="conllu-viewer">
              <Card.Header>
                <Nav>
                  <Nav.Item>
                    <Nav.Link eventKey="conllu-viewer">
                      {t('conllu.viewer.title')}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item onClick={() => setResetTree(true)}>
                    <Nav.Link eventKey="ud-tree">{t('ud.tree.title')}</Nav.Link>
                  </Nav.Item>
                </Nav>

                <div className="buttons">
                  <button
                    className="icon-button"
                    type="button"
                    title={t('button.download.tree')}
                    // onClick={generateImage}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    className="icon-button d-none"
                    type="button"
                    title={t('button.expand.tree')}
                    onClick={() => setExpand(!expand)}
                  >
                    <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    title={t('button.recenter.tree')}
                    // onClick={reset}
                  >
                    <FontAwesomeIcon icon={faExpand} />
                  </button>
                </div>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="conllu-viewer">
                    <ConlluViewer conllu={conllu} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="ud-tree">
                    <UDTreeView
                      conllu={conllu}
                      expand={expand}
                      setExpand={setExpand}
                      resetTree={resetTree}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>
        )}
      </div>
    </>
  );
}
