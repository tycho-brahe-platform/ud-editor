import ConlluEditor from '@/components/ConlluEditor';
import ConlluViewer from '@/components/ConlluViewer/ConlluViewer';
import Settings from '@/components/Settings';
import TreeView from '@/components/TreeView';
import ConlluUtils from '@/converter/ConlluUtils';
import { Conllu } from '@/types/model/Conllu';
import { Button, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

export default function Home() {
  const { t } = useTranslation('app');
  const [resetTree, setResetTree] = useState(false);
  const [value, setValue] = useState('');
  const [activeTab, setActiveTab] = useState('conllu');
  const [conllu, setConllu] = useState<Conllu>();
  const [openSettings, setOpenSettings] = useState(false);

  const render = (data: string) => {
    if (!data) return;
    const conlluSentence = ConlluUtils.convertToSentence(data);
    setConllu(conlluSentence);
    setActiveTab('graphical');
  };

  useEffect(() => {
    conllu && setValue(ConlluUtils.convertToConllu(conllu));
  }, [conllu]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'tree') {
      setResetTree(true);
    }
    setActiveTab(newValue);
  };

  return (
    <div className="home-container">
      <div className="tabs">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className="nav"
          sx={{
            flexGrow: 1,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            label={t('tab.label.conllu')}
            value="conllu"
            className="nav-item"
          />
          <Tab
            label={t('tab.label.graphical')}
            value="graphical"
            className="nav-item"
            disabled={!conllu}
          />
          <Tab
            label={t('tab.label.viewer')}
            value="editor"
            className="nav-item"
            disabled={!conllu}
          />
          <Tab
            label={t('tab.label.tree')}
            value="tree"
            className="nav-item"
            disabled={!conllu}
          />
        </Tabs>
        <Button
          className="nav-item settings-tab"
          onClick={() => setOpenSettings(true)}
        >
          {t('tab.label.settings')}
        </Button>
      </div>
      <div className="content">
        {activeTab === 'conllu' && (
          <div className="tabpanel" role="tabpanel">
            <div className="textarea-container">
              <Button
                variant="contained"
                color="success"
                onClick={() => render(value)}
                className="render-button"
              >
                {t('button.label.render')}
              </Button>
              <textarea
                className="expression"
                placeholder={t('placeholder.render.conllu')}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
          </div>
        )}
        {activeTab === 'editor' && conllu && (
          <div className="tabpanel" role="tabpanel">
            <ConlluViewer conllu={conllu} setConllu={setConllu} />
          </div>
        )}
        {activeTab === 'graphical' && conllu && (
          <div className="tabpanel" role="tabpanel">
            <ConlluEditor
              conllu={conllu}
              onDependencyChange={(updatedConllu) => {
                setConllu(updatedConllu);
              }}
            />
          </div>
        )}
        {activeTab === 'tree' && conllu && (
          <div className="tabpanel" role="tabpanel">
            <TreeView
              conllu={conllu}
              resetTree={resetTree}
              setResetTree={setResetTree}
            />
          </div>
        )}
      </div>
      {openSettings && <Settings onClose={() => setOpenSettings(false)} />}
    </div>
  );
}
