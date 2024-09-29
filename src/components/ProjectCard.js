import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col } from 'react-bootstrap';

export const ProjectCard = ({ title, description, link }) => {
  return (
    <Col size={12} sm={6} md={4}>
      <Card
        style={{ width: '100%', backgroundColor: '#1a1a1a' }}
        className='text-white border-0 shadow-lg rounded-lg m-3'
      >
        <Card.Img variant="top" src="" className="rounded-top" />
        <Card.Body className='p-4'>
          <Card.Title className="text-center text-white mb-3">{title}</Card.Title>
          <Card.Text className='text-gray-50' style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '1rem' }}>
            {description.length > 150 ? `${description.substring(0, 147)}...` : description}
          </Card.Text>
          <div className="d-flex justify-content-center">
            <Button
              style={{ backgroundColor: 'black', borderColor: '#ff9800' }}
              className='rounded-pill px-4 py-2 hover-bg-light'
              href={link}
            >
              Explore More
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};
