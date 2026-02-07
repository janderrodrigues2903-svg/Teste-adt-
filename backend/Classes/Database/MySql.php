<?php

namespace ContatoSeguro\Classes\Database;

include_once(dirname(__DIR__, 2).DIRECTORY_SEPARATOR.'inc'.DIRECTORY_SEPARATOR.'inc.connect.php');

class MySql
{
    private $conn;

    public function connect()
    {

        $this->conn = null;

        try {
            $this->conn = new \PDO(
                'mysql:host='.HOST.';
          dbname='.DB,
                USER,
                PASS,
                array(\PDO::MYSQL_ATTR_FOUND_ROWS => true)
            );

            $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch(\Exception $e) {
            echo 'Connection error: '.$e->getMessage();
            throw $e;
        }

        return $this->conn;
    }

}
