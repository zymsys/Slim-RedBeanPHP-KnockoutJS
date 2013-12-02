<?php
use RedBean_Facade as R;

$client = R::dispense('client');
$client->name = 'George Bailey';
$client->nice = true;
$id = R::store($client);

$client = R::dispense('client');
$client->name = 'Mary Hatch';
$client->nice = true;
$id = R::store($client);

$client = R::dispense('client');
$client->name = 'Henry F. Potter';
$client->nice = false;
$id = R::store($client);

