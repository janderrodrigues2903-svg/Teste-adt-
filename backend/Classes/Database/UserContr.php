<?php

namespace ContatoSeguro\Classes\Database;

use PDO;
use ContatoSeguro\Classes\Database\MySql;

class UserContr
{
    private $mysql;

    public function __construct()
    {
        $database = new MySql();
        $this->mysql = $database->connect();
    }

    public function insertUser($data)
    {

        $query = 'INSERT INTO user ('.implode(', ', array_keys($data)).')
                VALUES ("'.implode('", "', $data).'")';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $response = array(
                              "status" => 201,
                              "data" => array("id" => $this->mysql->lastInsertId())
                            );
        } else {
            $response = NO_CONTENT;
        }

        return $response;

    }

    public function insertUserCompanies($id_user, $companies)
    {

        foreach($companies as $key => $id_company) {
            $values[] = '("'.$id_user.'", "'.$id_company.'")';
        }

        $query = 'INSERT INTO user_company (id_user, id_company)
                VALUES '.implode(',', $values).'';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return ($stmt->rowCount() > 0) ? true : false;

    }

    public function getUser($id_user)
    {

        $query = '  SELECT  user.*,
                          IF(LENGTH(tmp.companies)>14, 
													  CONCAT(SUBSTRING(tmp.companies, 1,14	), "..."),
														tmp.companies
														) AS companies

                  FROM    user,
                          ( SELECT GROUP_CONCAT(" ",company.name) AS companies
                            FROM company INNER JOIN user_company
                            ON company.id_company = user_company.id_company
                            WHERE user_company.id_user = "'.$id_user.'") AS tmp

                  WHERE   id_user = "'.$id_user.'"
                  AND     user.show = 1';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $response = array(
                              "status" => 200,
                              "data" => $stmt->fetch(PDO::FETCH_ASSOC)
                            );
        } else {
            $response = NO_CONTENT;
        }

        return $response;

    }

    public function getAllUsers()
    {

        $query = '  SELECT  user.*,
                          IF(LENGTH(tmp.companies)>14, 
													  CONCAT(SUBSTRING(tmp.companies, 1,14	), "..."),
														tmp.companies
														) AS companies

                  FROM    user CROSS JOIN  ( SELECT user_company.id_user,
                                                  GROUP_CONCAT(" ",company.name) AS companies
                                            FROM company INNER JOIN user_company
                                            ON company.id_company = user_company.id_company
                                            GROUP BY user_company.id_user) AS tmp
                            ON user.id_user = tmp.id_user
                  WHERE   user.show = 1';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }

    public function updateUser($id_user, $data)
    {

        foreach ($data as $key => $value) {
            $values[] = $key.' = "'.$value.'"';
        }

        $query = 'UPDATE user
                SET '.implode(', ', $values).'
                WHERE user.id_user = "'.$id_user.'"';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $response = UPDATE_SUCCEDED;
        } else {
            $response = UPDATE_FAILED;
        }

        return $response;
    }

    public function deleteUser($id_user)
    {

        $query = 'UPDATE user
                SET user.show = 0
                WHERE user.id_user = "'.$id_user.'"';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $response = DELETE_SUCCEDED;
        } else {
            $response = DELETE_FAILED;
        }

        return $response;
    }

}
