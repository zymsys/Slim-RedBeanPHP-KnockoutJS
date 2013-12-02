<?php
namespace Zymurgy;

use RedBean_Facade as R;

class ClientController
{
    const TABLE_NAME = 'client';
    public static function addRoutes(App $app)
    {
        $app->get('/api/client/list', function () use ($app) {
            $result = R::findAll(self::TABLE_NAME);
            $app->response()->header('content-type', 'application/json');
            echo json_encode(R::exportAll($result));
        });
        $app->post('/api/client', function () use ($app) {
            $client = R::dispense(self::TABLE_NAME);
            $client->name = $app->request()->post('name');
            $client->nice = !!$app->request()->post('nice');
            $id = R::store($client);
            $response = array(
                'status' => 'ok',
                'newId' => $id,
            );
            $app->response()->header('content-type', 'application/json');
            echo json_encode($response);
        });
        $app->put('/api/client/:id', function ($id) use ($app) {
            $client = R::load(self::TABLE_NAME, $id);
            $client->name = $app->request()->put('name');
            $client->nice = !!$app->request()->put('nice');
            R::store($client);
            $app->response()->header('content-type', 'application/json');
            $response = array(
                'status' => 'ok',
            );
            echo json_encode($response);
        });
        $app->delete('/api/client/:id', function ($id) use ($app) {
            $client = R::load(self::TABLE_NAME, $id);
            R::trash($client);
            echo json_encode(array('status' => 'ok'));
        });
    }
}