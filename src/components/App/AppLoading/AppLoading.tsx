import { Col, Row } from "react-bootstrap";
import ReactLoading from "react-loading";
import "./style.scss";

function AppLoading() {
  return (
    <Row className="loading-container">
      <Col>
        <ReactLoading
          type="spinningBubbles"
          color="blue"
          height={50}
          width={50}
        />
      </Col>
    </Row>
  );
}

export default AppLoading;
