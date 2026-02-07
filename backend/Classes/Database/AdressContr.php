<?php

namespace ContatoSeguro\Classes\Database;

use PDO;
use ContatoSeguro\Classes\Database\MySql;

class AdressContr
{
    private $mysql;

    public function __construct()
    {
        $database = new MySql();
        $this->mysql = $database->connect();
    }

    public function getAdress($id_adress)
    {

        $query = '  SELECT  adress.*
                  FROM adress
                  WHERE adress.id_adress = "'.$id_adress.'"';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);

    }

    public function getAllAdresses()
    {

        $query = '  SELECT  adress.*
                  FROM    adress';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertAdress($data)
    {

        $query = 'INSERT INTO adress('.implode(', ', array_keys($data)).')
                VALUES ("'.implode('", "', $data).'")';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return ($stmt->rowCount() > 0) ? $this->mysql->lastInsertId() : false;

    }

    public function updateAdress($id_adress, $data)
    {

        foreach ($data as $key => $value) {
            $values[] = $key.' = "'.$value.'"';
        }

        $query = 'UPDATE adress
                SET '.implode(', ', $values).'
                WHERE adress.id_adress = "'.$id_adress.'"';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return $stmt->rowCount();

    }

    public function deleteAdress($id_adress)
    {

        $query = 'DELETE adress
                WHERE adress.id_adress = "'.$id_adress.'"';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return $stmt->rowCount();

    }

}
