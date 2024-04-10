"use client"
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const [ageResponse, genderResponse, countryResponse] = await Promise.all([
        fetch(`https://api.agify.io/?name=${name}`),
        fetch(`https://api.genderize.io/?name=${name}`),
        fetch(`https://api.nationalize.io/?name=${name}`)
      ]);

      if (!ageResponse.ok || !genderResponse.ok || !countryResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [ageData, genderData, countryData] = await Promise.all([
        ageResponse.json(),
        genderResponse.json(),
        countryResponse.json()
      ]);

      setResult({
        age: ageData.age,
        gender: genderData.gender,
        country: countryData.country[0].country_id
      });
      setName('')
      toast.success('Data Fetched Successfully!!!')
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again. Request limit reached');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col className='mx-auto'>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center justify-content-center">
                <Form.Group className="" controlId="exampleForm.ControlInput1">
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter Your Name"
                    className='w-100'
                  />
                </Form.Group>
                <button type="submit" className="btn btn-primary ms-1" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </Form>
            {error && <p className="text-danger text-center mt-2">{error}</p>}

            {result !== null && <div className="d-flex flex-column justify-content-center align-items-center">
              <Card style={{ width: '400px', marginTop: '40px' }}>
                <Card.Body >
                  {result && (
                    <>
                      <p> <b>Age:</b> {result.age}</p> <hr />
                      <p> <b>Gender:</b> {result.gender}</p> <hr />
                      <p> <b>Country:</b> {result.country}</p>
                    </>
                  )}
                </Card.Body>
              </Card>
            </div>}
          </Col>
        </Row>
      </Container>
        <Toaster
         position="top-right"
      />
    </>
  );
}
