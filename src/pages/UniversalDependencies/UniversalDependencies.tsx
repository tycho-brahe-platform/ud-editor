import ConlluViewer from '@/components/ConlluViewer';
import Header from '@/components/Header';
import HomeActions from '@/components/HeaderActions';
import UDTreeView from '@/components/UDTreeView';
import AuthContext from '@/configs/AuthContext';
import { toastLoading } from '@/configs/store/actions';
import ConlluUtils from '@/functions/ConlluUtils';
import udService from '@/services/UDService';
import { Conllu } from '@/types/model/Conllu';
import {
  faDownload,
  faExpand,
  faUpRightAndDownLeftFromCenter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useContext, useEffect, useState } from 'react';
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

const marginTopMainContainer =
  'calc(var(--spacing-xxlarge) + var(--spacing-large))';

const selector = 'canvas';

export default function UniversalDependencies() {
  const { t } = useTranslation('home');
  const [showHeader, setShowHeader] = useState(true);
  const { state, dispatch } = useContext(AuthContext);
  const [resetTree, setResetTree] = useState(false);
  const [expand, setExpand] = useState(false);

  const [value, setValue] = useState('');
  const [conllu, setConllu] = useState<Conllu>();
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState<string | null>(null);

  const [sentence, setSentence] = useState<string>('');

  const handleChange = (option: string | null) => {
    setModel(option || '');
  };

  const loadModels = () => {
    udService.models().then((r) => {
      setModels(Object.keys(r.data.models));
    });
  };

  const parse = () => {
    if (state.toastLoading || sentence === '' || !model) return;
    dispatch(toastLoading(true));
    udService
      .parse(sentence, model)
      .then((r) => {
        setValue(r.data.result);
        setConllu(ConlluUtils.convertToSentence(r.data.result));
        render(r.data.result);
      })
      .finally(() => {
        dispatch(toastLoading(false));
      });
  };

  const render = (data: string) => {
    if (!data) return;
    const conlluSentence = ConlluUtils.convertToSentence(data);
    setSentence(conlluSentence.attributes.text);
    setConllu(conlluSentence);
    setModel(null);
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <>
      {showHeader && <Header />}
      <HomeActions type="ud" showHeader={showHeader} />
      <div
        className="ud-container"
        style={{ marginTop: showHeader ? marginTopMainContainer : '24px' }}
      >
        <div className="sentence-container">
          <Form.Control
            placeholder={t('placeholder.parse.sentence')}
            className="sentence"
            value={sentence}
            onChange={(e) => {
              setSentence(e.target.value);
            }}
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            onChange={(event: any, newValue: string | null) => {
              handleChange(newValue);
            }}
            options={models}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Model" />}
            value={model}
          />

          <Button variant="success" className="ms-auto" onClick={parse}>
            <span>{t('button.label.execute')}</span>
          </Button>
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
