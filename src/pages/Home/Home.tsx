import ConlluEditor from '@/components/ConlluEditor';
import ConlluViewer from '@/components/ConlluViewer/ConlluViewer';
import FileDrawer from '@/components/FileDrawer';
import SentenceNavigation from '@/components/SentenceNavigation';
import Settings from '@/components/Settings';
import Support from '@/components/Support';
import TreeView from '@/components/TreeView';
import AuthContext from '@/configs/AuthContext';
import { conllu } from '@/configs/store/actions';
import ConlluUtils from '@/converter/ConlluUtils';
import { Button, Tab, Tabs } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

export default function Home() {
  const { t } = useTranslation(['app', 'file']);
  const { state, dispatch } = useContext(AuthContext);

  const [resetTree, setResetTree] = useState(false);
  const [value, setValue] = useState('');
  const [activeTab, setActiveTab] = useState('conllu');
  const [openSettings, setOpenSettings] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openFileDrawer, setOpenFileDrawer] = useState(false);

  const render = (data: string) => {
    if (!data) return;
    const conlluSentence = ConlluUtils.convertToSentence(data);
    dispatch(conllu(conlluSentence));
    setActiveTab('graphical');
  };

  useEffect(() => {
    state.conllu && setValue(ConlluUtils.convertToConllu(state.conllu));
  }, [state.conllu]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        render(value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [value]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Warn user if there are sentences loaded (potential unsaved changes)
      if (state.sentences.length > 0) {
        event.preventDefault();
        // Modern browsers ignore custom messages, but we still need to set returnValue
        event.returnValue = t('file:warning.unsaved.changes');
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.sentences.length, t]);

  const isNotEmptyConllu = useMemo(
    () => ConlluUtils.isNotEmptyConllu(state.conllu),
    [state.conllu]
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'tree') {
      setResetTree(true);
    }
    if (newValue === 'file') {
      setOpenFileDrawer(true);
    } else {
      setActiveTab(newValue);
    }
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
            label={t('file:tab.label.file')}
            value="file"
            className="nav-item"
          />
          <Tab
            label={t('tab.label.conllu')}
            value="conllu"
            className="nav-item"
          />
          <Tab
            label={t('tab.label.graphical')}
            value="graphical"
            className="nav-item"
            disabled={!isNotEmptyConllu}
          />
          <Tab
            label={t('tab.label.viewer')}
            value="editor"
            className="nav-item"
            disabled={!isNotEmptyConllu}
          />
          <Tab
            label={t('tab.label.tree')}
            value="tree"
            className="nav-item"
            disabled={!isNotEmptyConllu}
          />
        </Tabs>
        <SentenceNavigation
          onSentenceSelect={() => {
            setActiveTab('graphical');
          }}
        />
        <Button
          className="nav-item settings-tab"
          onClick={() => setOpenSettings(true)}
        >
          {t('tab.label.settings')}
        </Button>
        <Button
          className="nav-item settings-tab"
          onClick={() => setOpenSupport(true)}
        >
          {t('tab.label.support')}
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
        {activeTab === 'editor' && isNotEmptyConllu && (
          <div className="tabpanel" role="tabpanel">
            <ConlluViewer />
          </div>
        )}
        {activeTab === 'graphical' && isNotEmptyConllu && (
          <div className="tabpanel" role="tabpanel">
            <ConlluEditor />
          </div>
        )}
        {activeTab === 'tree' && isNotEmptyConllu && (
          <div className="tabpanel" role="tabpanel">
            <TreeView resetTree={resetTree} setResetTree={setResetTree} />
          </div>
        )}
      </div>
      {openSettings && <Settings onClose={() => setOpenSettings(false)} />}
      {openSupport && <Support onClose={() => setOpenSupport(false)} />}
      <FileDrawer
        open={openFileDrawer}
        onClose={() => {
          setOpenFileDrawer(false);
        }}
        onSentenceSelect={() => {
          setActiveTab('graphical');
        }}
      />
    </div>
  );
}
