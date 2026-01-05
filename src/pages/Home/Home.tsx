import ConlluViewer from '@/components/ConlluViewer';
import UDSentenceTokens from '@/components/UDSentenceTokens';
import UDTreeView from '@/components/UDTreeView';
import ConlluUtils from '@/functions/ConlluUtils';
import { Conllu } from '@/types/model/Conllu';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

export default function Home() {
  const { t } = useTranslation('home');
  const [resetTree, setResetTree] = useState(false);
  const [value, setValue] = useState('');
  const [activeTab, setActiveTab] = useState('conllu');
  const [conllu, setConllu] = useState<Conllu>();

  const render = (data: string) => {
    if (!data) return;
    const conlluSentence = ConlluUtils.convertToSentence(data);
    setConllu(conlluSentence);
    setActiveTab('graphical');
  };

  useEffect(() => {
    conllu && setValue(ConlluUtils.convertToConllu(conllu));
  }, [conllu]);

  if (conllu && activeTab === 'tree')
    return (
      <UDTreeView
        conllu={conllu}
        resetTree={resetTree}
        setResetTree={setResetTree}
        setActiveTab={setActiveTab}
      />
    );

  return (
    <div className="home-container">
      <Tab.Container
        activeKey={activeTab}
        onSelect={(k) => k && setActiveTab(k)}
      >
        <Nav>
          <Nav.Item onClick={() => setActiveTab('conllu')}>
            <Nav.Link eventKey="conllu">{t('conllu.viewer.title')}</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setActiveTab('graphical')}>
            <Nav.Link eventKey="graphical">
              {t('conllu.graphical.title')}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setActiveTab('editor')}>
            <Nav.Link eventKey="editor">{t('conllu.editor.title')}</Nav.Link>
          </Nav.Item>
          <Nav.Item
            onClick={() => {
              setActiveTab('tree');
              setResetTree(true);
            }}
          >
            <Nav.Link eventKey="ud-tree">{t('ud.tree.title')}</Nav.Link>
          </Nav.Item>
          <div className="buttons">
            <Button
              variant="success"
              className="ms-auto"
              size="sm"
              onClick={() => render(value)}
            >
              <span>{t('button.label.render')}</span>
            </Button>
          </div>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="conllu">
            <Form.Control
              className="expression"
              as="textarea"
              placeholder={t('placeholder.render.conllu')}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="editor">
            <UDSentenceTokens conllu={conllu} setConllu={setConllu} />
          </Tab.Pane>
          <Tab.Pane eventKey="graphical">
            {conllu && (
              <ConlluViewer
                conllu={conllu}
                onDependencyChange={(updatedConllu) => {
                  setConllu(updatedConllu);
                }}
              />
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
