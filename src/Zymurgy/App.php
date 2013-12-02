<?php
namespace Zymurgy;

use Slim\Slim;

class App extends Slim
{
    protected $_can;

    function __construct($userSettings = array())
    {
        parent::__construct($userSettings);

        ClientController::addRoutes($this);
    }

    /**
     * @return \Slim\Http\Response
     */
    public function invoke() {
        $this->middleware[0]->call();
        $this->response()->finalize();
        return $this->response();
    }
}