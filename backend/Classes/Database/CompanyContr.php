<?php

namespace ContatoSeguro\Classes\Database;

use PDO;

class CompanyContr
{
    private $mysql;

    public function __construct()
    {
        $database = new MySql();
        $this->mysql = $database->connect();
    }

    public function getCompany($id_company)
    {

        $query = '  SELECT  company.id_company,
                          company.name,
                          company.cnpj,
                          company.show,
                          adress.*,
                          tmp.users AS users

                  FROM company LEFT JOIN adress
                  ON company.id_adress = adress.id_adress,
                  ( SELECT GROUP_CONCAT(" ",user.name) AS users
                    FROM user INNER JOIN user_company
                    ON user.id_user = user_company.id_user) AS tmp

                  WHERE company.id_company = "'.$id_company.'"';

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

    public function getAllCompanies()
    {

        $query = ' SELECT  company.id_company,
                        company.name,
                        company.cnpj,
                        company.show,
                        adress.*,
                        IF(LENGTH(tmp.users)>14, 
													  CONCAT(SUBSTRING(tmp.users, 1,14	), "..."),
														tmp.users
														) AS users

                  FROM company LEFT JOIN adress
                  ON company.id_adress = adress.id_adress

                  LEFT JOIN
                  ( SELECT user_company.id_company,
                                                GROUP_CONCAT(" ",user.name) AS users
                                          FROM user INNER JOIN user_company
                                          ON user.id_user = user_company.id_user
                                          GROUP BY user_company.id_company) AS tmp
                  ON company.id_company = tmp.id_company

                  WHERE company.show = 1';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertCompany($companyData)
    {

        $query = 'INSERT INTO company('.implode(', ', array_keys($companyData)).')
                VALUES ("'.implode('", "', $companyData).'")';

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

    public function updateCompany($id_company, $data)
    {

        foreach ($data as $key => $value) {
            $values[] = $key.' = "'.$value.'"';
        }

        $query = 'UPDATE company
                SET '.implode(', ', $values).'
                WHERE company.id_company = "'.$id_company.'"';

        $stmt = $this->mysql->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $response = UPDATE_SUCCEDED;
        } else {
            $response = UPDATE_FAILED;
        }

        return $response;

    }

    public function deleteCompany($id_company)
    {

        $query = 'UPDATE company
                SET company.show = 0
                WHERE company.id_company = "'.$id_company.'"';

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
