import ConlluViewer from '@/components/ConlluViewer';
import Header from '@/components/Header';
import UDSentenceTokens from '@/components/UDSentenceTokens';
import UDTreeView from '@/components/UDTreeView';
import ConlluUtils from '@/functions/ConlluUtils';
import { Conllu } from '@/types/model/Conllu';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

export default function Home() {
  const { t } = useTranslation('home');
  const [generateImageTree, setGenerateImageTree] = useState(false);
  const [generateImageConllu, setGenerateImageConllu] = useState(false);
  const [resetTree, setResetTree] = useState(false);
  const [value, setValue] = useState('');
  const [activeTab, setActiveTab] = useState('conllu');
  const [conllu, setConllu] = useState<Conllu>();

  const render = (data: string) => {
    if (!data) return;
    const conlluSentence = ConlluUtils.convertToSentence(data);
    setConllu(conlluSentence);
  };

  return (
    <>
      <Header />
      <div className="home-container">
        <Card className="ud-viewer-container">
          <Tab.Container defaultActiveKey="conllu">
            <Card.Header>
              <Nav>
                <Nav.Item onClick={() => setActiveTab('conllu')}>
                  <Nav.Link eventKey="conllu">
                    {t('conllu.viewer.title')}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => setActiveTab('editor')}>
                  <Nav.Link eventKey="editor">
                    {t('conllu.editor.title')}
                  </Nav.Link>
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
                    onClick={() => render(value)}
                  >
                    <span>{t('button.label.render')}</span>
                  </Button>
                  <button
                    className="icon-button"
                    type="button"
                    title={t('button.download.tree')}
                    onClick={() =>
                      activeTab === 'ud-tree'
                        ? setGenerateImageTree(true)
                        : setGenerateImageConllu(true)
                    }
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  {activeTab === 'tree' && (
                    <button
                      className="icon-button"
                      type="button"
                      title={t('button.recenter.tree')}
                      onClick={() => setResetTree(true)}
                    >
                      <FontAwesomeIcon icon={faExpand} />
                    </button>
                  )}
                </div>
              </Nav>
            </Card.Header>
            <Card.Body>
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
                    rows={15}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="editor">
                  <UDSentenceTokens conllu={conllu} setConllu={setConllu} />
                </Tab.Pane>
                <Tab.Pane eventKey="tree">
                  {conllu && (
                    <UDTreeView
                      conllu={conllu}
                      resetTree={resetTree}
                      setResetTree={setResetTree}
                      generateImage={generateImageTree}
                      setGenerateImage={setGenerateImageTree}
                    />
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Tab.Container>
        </Card>

        {conllu && (
          <Card className="ud-viewer-container">
            <Tab.Container defaultActiveKey="conllu-viewer">
              <Card.Header>
                <div className="buttons">
                  <button
                    className="icon-button"
                    type="button"
                    title={t('button.download.tree')}
                    onClick={() =>
                      activeTab === 'ud-tree'
                        ? setGenerateImageTree(true)
                        : setGenerateImageConllu(true)
                    }
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  {activeTab === 'ud-tree' && (
                    <button
                      className="icon-button"
                      type="button"
                      title={t('button.recenter.tree')}
                      onClick={() => setResetTree(true)}
                    >
                      <FontAwesomeIcon icon={faExpand} />
                    </button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="conllu-viewer">
                    <ConlluViewer
                      conllu={conllu}
                      generateImage={generateImageConllu}
                      setGenerateImage={setGenerateImageConllu}
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
