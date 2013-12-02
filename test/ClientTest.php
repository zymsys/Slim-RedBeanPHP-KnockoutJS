<?php
use Zymurgy\App;
use RedBean_Facade as R;

class ClientTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        R::setup('sqlite::memory:');
        require('seed.php');
    }

    public function tearDown()
    {
        R::close();
    }

    public function testGetClients()
    {
        \Slim\Environment::mock(array(
            'PATH_INFO' => '/api/client/list',
        ));
        $app = new App();
        $response = $app->invoke();

        $data = json_decode($response->body());
        $this->assertInternalType('array', $data);
        $this->assertCount(3, $data, "Three client exists");
        $this->assertEquals("Mary Hatch", $data[1]->name, "Second client is Mary");

        $headers = $response->headers();
        $this->assertEquals('application/json', $headers['content-type'], "JSON content returned");
    }

    public function testSaveNewClient()
    {
        $expectedName = 'George Bailey';
        \Slim\Environment::mock(array(
            'PATH_INFO' => '/api/client',
            'REQUEST_METHOD' => 'POST',
            'slim.input' => http_build_query(array(
                'id' => '',
                'name' => $expectedName,
                'nice' => 'true',
            )),
        ));
        $app = new App();
        $response = $app->invoke();

        $data = json_decode($response->body());
        $this->assertInstanceOf('stdClass', $data);
        $this->assertObjectHasAttribute('newId', $data);
        $this->assertGreaterThan(0, $data->newId);

        $client = R::load('client', $data->newId);
        $this->assertEquals($expectedName, $client->name);
    }

    public function testSaveExistingClient()
    {
        $clients = R::findAll('client');
        $count = count($clients);
        $first = array_shift($clients);
        $first->name .= 'son';

        $query = http_build_query(array(
            'name' => $first->name,
            'nice' => $first->nice,
        ));
        \Slim\Environment::mock(array(
            'PATH_INFO' => '/api/client/' . $first->id,
            'REQUEST_METHOD' => 'PUT',
            'CONTENT_TYPE' => 'application/x-www-form-urlencoded',
            'CONTENT_LENGTH' => strlen($query),
            'slim.input' => $query,
        ));
        $app = new App();
        $response = $app->invoke();

        $data = json_decode($response->body());
        $this->assertInstanceOf('stdClass', $data);
        $this->assertObjectNotHasAttribute('newId', $data);
        $updated = R::load('client', $first->id);
        $this->assertEquals($count, R::count('client'), "Count doesn't change on update");
        $this->assertEquals($first->name, $updated->name, "Update updates");
    }

    public function testDeleteClient()
    {
        $clients = R::findAll('client');
        $count = count($clients);
        $first = array_shift($clients);

        \Slim\Environment::mock(array(
            'PATH_INFO' => '/api/client/' . $first->id,
            'REQUEST_METHOD' => 'DELETE',
        ));
        $app = new App();
        $response = $app->invoke();

        $data = json_decode($response->body());
        $this->assertInstanceOf('stdClass', $data);
        $clientsAfter = R::findAll('client');
        $firstAfter = array_shift($clients);
        $this->assertEquals($count - 1, count($clientsAfter), "Count is one less than it was");
        $this->assertNotEquals($first->name, $firstAfter->name, "First client is different than before");
    }
}