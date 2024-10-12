import Header from '@/components/Header';
import HomeActions from '@/components/HeaderActions';
import PennExpression from '@/components/PennExpression';
import PennSentence from '@/components/PennSentence';
import TreeView from '@/components/TreeView';
import TychoFormat from '@/components/TychoFormat';
import SynviewerCytoscape from '@/functions/SynviewerCytoscape';
import { CytoscapeTree } from '@/types/model/Tree';
import { useEffect, useState } from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

const marginTopMainContainer =
  'calc(var(--spacing-xxlarge) + var(--spacing-large))';

const selector = 'canvas';

export default function Home() {
  const { t } = useTranslation('home');
  const [showHeader, setShowHeader] = useState(true);
  const [cy, setCy] = useState<any>();
  const [expand, setExpand] = useState(false);

  const [expression, setExpression] = useState('');
  const [tree, setTree] = useState<CytoscapeTree>();
  const [sentence, setSentence] = useState('');

  const display = () => {
    if (!tree) {
      const el = document.getElementById(selector);
      if (el) el.innerHTML = '<label>sentence not parsed</label>';
      return;
    }

    const thisCy = SynviewerCytoscape.init(selector, tree);
    setCy(thisCy);
  };

  useEffect(() => {
    display();
  }, [tree]);

  return (
    <>
      {showHeader && <Header />}
      <HomeActions type="tycho" showHeader={showHeader} />
      <Row
        className="main-container"
        style={{ marginTop: showHeader ? marginTopMainContainer : '24px' }}
      >
        {!expand && (
          <Col xs={12} sm={4}>
            <Tabs defaultActiveKey="sentence">
              <Tab eventKey="sentence" title={t('tab.label.parse')}>
                <PennSentence
                  sentence={sentence}
                  setSentence={setSentence}
                  setExpression={setExpression}
                  setTree={setTree}
                />
              </Tab>
              <Tab eventKey="tree" title={t('tab.label.render')}>
                <PennExpression
                  expression={expression}
                  setSentence={setSentence}
                  setExpression={setExpression}
                  setTree={setTree}
                />
              </Tab>
              <Tab eventKey="tycho" title={t('tab.label.tycho')}>
                <TychoFormat setTree={setTree} />
              </Tab>
            </Tabs>
          </Col>
        )}
        <Col xs={12} sm={expand ? 12 : 8} className="position-relative">
          {tree && (
            <TreeView
              expand={expand}
              setExpand={setExpand}
              cy={cy}
              setShowHeader={setShowHeader}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
