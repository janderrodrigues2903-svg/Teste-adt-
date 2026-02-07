<?php

namespace ContatoSeguro\Classes\Tests;

use PHPUnit\Framework\TestCase;
use ContatoSeguro\Classes\Database\UserContr;

require_once(dirname(__DIR__, 1).DIRECTORY_SEPARATOR.'classes'.DIRECTORY_SEPARATOR.'class.UserContr.php');

class UserContrTest extends TestCase
{
    public function testGetUserDataFromDatabase()
    {

        $userCtr = new UserContr();
        $userData = $userCtr->getUser(1);

        $expectedData = array(
          'id_user' => '1',
          'name' => 'test',
          'email' => 'test@mail.com',
          'telephone' => '51999999999',
          'birth_date' => '2000-01-01',
          'birth_city' => 'Porto Alegre'
        );

        $this->assertEquals($expectedData, $userData);

    }

}
