import { Container } from 'react-bootstrap';
import './styles.scss';
import PublicRoutes from '@/routes/PublicRoutes';

function Template() {
  return (
    <Container fluid>
      <PublicRoutes />
    </Container>
  );
}

export default Template;
