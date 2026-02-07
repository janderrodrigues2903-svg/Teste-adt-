<?php

namespace ContatoSeguro\Classes\Util;

use DateTime;

const ALLOWED_PARAMS = array(
  "user" => ["name", "email", "telephone", "birth_date", "birth_city", "companies"],
  "company" => ["name", "cnpj", "id_adress", "adress"],
  "adress" => ["cep", "country", "state", "city", "street", "number", "district", "additional"]
);

class ValidateArgs
{
    public static function validateId($id)
    {

        if(isset($id) && gettype($id) === 'integer' || isset($id) && gettype($id) === 'string' && intval($id) !== 0) {
            $isValid = true;
        } else {
            $isValid = false;
        }

        return $isValid;

    }

    public static function validateBirthDate($birth_date)
    {
        // Verifica se a data foi informada
        if(empty($birth_date)) {
            return true; // Data opcional, então vazio é válido
        }

        // Valida formato de data (YYYY-MM-DD)
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $birth_date)) {
            return false;
        }

        // Converte para objeto DateTime
        $date = DateTime::createFromFormat('Y-m-d', $birth_date);
        
        // Verifica se a data é válida
        if (!$date || $date->format('Y-m-d') !== $birth_date) {
            return false;
        }

        // Verifica se a data não é futura
        $today = new DateTime();
        $today->setTime(0, 0, 0); // Resetar horas para comparar apenas datas
        
        if ($date > $today) {
            return false; // Data futura não é permitida
        }

        // Verifica se a data não é muito antiga (ex: antes de 1900)
        $minDate = DateTime::createFromFormat('Y-m-d', '1900-01-01');
        if ($date < $minDate) {
            return false; // Data muito antiga não é permitida
        }

        return true;
    }

    public static function validateBody($type, $body, $obligatoryParams = null)
    {
        // Verifica se $obligatoryParams é null ANTES de usar array_intersect
        // Se for null, significa que não há parâmetros obrigatórios para validar
        $hasObligatoryParams = ($obligatoryParams === null) || (sizeof(array_intersect($obligatoryParams, array_keys($body))) === sizeof($obligatoryParams));

        if($hasObligatoryParams) {

            foreach($body as $key => $value) {
                if(!in_array($key, ALLOWED_PARAMS[$type])) {
                    return false;
                }
            }

            $isValid = true;
        } else {
            $isValid = false;
        }

        return $isValid;

    }

}
