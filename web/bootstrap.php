<?php
use Zymurgy\App;
use RedBean_Facade as R;

require_once '../vendor/autoload.php';

if (empty(R::$currentDB)) {
    R::setup('mysql:host=localhost;dbname=srk','root');
}

$app = new App;
$app->run();

R::close();
