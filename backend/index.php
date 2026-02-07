<?php

@include __DIR__.'/bootstrap.php';
require_once DIR_APP.'/vendor/autoload.php';
include __DIR__.'/inc/inc.codes.php';

use Slim\Factory\AppFactory;
use ContatoSeguro\Classes\Util\ValidateArgs;
use ContatoSeguro\Classes\Database\UserContr;
use ContatoSeguro\Classes\Database\AdressContr;
use ContatoSeguro\Classes\Database\CompanyContr;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app = AppFactory::create();

$app->addErrorMiddleware(true, true, true);

unset($app->getContainer()['errorHandler']);
unset($app->getContainer()['phpErrorHandler']);

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});


$app->get('/', function (Request $request, Response $response, array $args) {
    $response->getBody()->write(json_encode(["msg" => "home"]));
    return $response->withStatus(200)->withHeader('Content-type', 'application/json');
});

$app->get('/api/user', function (Request $request, Response $response, array $args) {

    $userCtr = new UserContr();
    $users = $userCtr->getAllUsers();

    $response->getBody()->write(json_encode($users));
    return $response->withStatus(200)->withHeader('Content-type', 'application/json');
});


$app->get('/api/user/{id}', function (Request $request, Response $response, array $args) {

    if(ValidateArgs::validateId($args['id'])) {
        try {
            $userCtr = new UserContr();
            $data = $userCtr->getUser($args['id']);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }


    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');

});


$app->post('/api/user/create', function (Request $request, Response $response, array $args) {
    $body = json_decode($request->getBody()->getContents(), true);

    if(ValidateArgs::validateBody('user', $body, ["name", "email", "companies"])) {

        // Validação de data de nascimento (se informada)
        if(isset($body['birth_date']) && !empty($body['birth_date'])) {
            if(!ValidateArgs::validateBirthDate($body['birth_date'])) {
                $response->getBody()->write(json_encode(["error" => "Data de nascimento inválida. A data deve estar no formato YYYY-MM-DD, não pode ser futura e deve ser posterior a 1900-01-01."]));
                return $response->withStatus(400)->withHeader('Content-type', 'application/json');
            }
        }

        $companies = $body['companies'];
        unset($body['companies']);

        try {
            $userCtr = new UserContr();
            $data = $userCtr->insertUser($body);

            $userCtr->insertUserCompanies($data['data']['id'], $companies);
            $data = $userCtr->getUser($data['data']['id']);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }

    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');
});


$app->patch('/api/user/{id}/update', function (Request $request, Response $response, array $args) {
    $body = json_decode($request->getBody()->getContents(), true);

    if(ValidateArgs::validateId($args['id']) && ValidateArgs::validateBody('user', $body)) {
        
        // Validação de data de nascimento (se informada)
        if(isset($body['birth_date']) && !empty($body['birth_date'])) {
            if(!ValidateArgs::validateBirthDate($body['birth_date'])) {
                $response->getBody()->write(json_encode(["error" => "Data de nascimento inválida. A data deve estar no formato YYYY-MM-DD, não pode ser futura e deve ser posterior a 1900-01-01."]));
                return $response->withStatus(400)->withHeader('Content-type', 'application/json');
            }
        }

        try {
            $userCtr = new UserContr();
            $data = $userCtr->updateUser($args['id'], $body);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }

    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');
});


$app->delete('/api/user/{id}/delete', function (Request $request, Response $response, array $args) {

    if(ValidateArgs::validateId($args['id'])) {
        try {
            $userCtr = new UserContr();
            $data = $userCtr->deleteUser($args['id']);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }

    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');
});


$app->get('/api/company', function (Request $request, Response $response, array $args) {

    $companyCtr = new CompanyContr();
    $companies = $companyCtr->getAllCompanies();

    $response->getBody()->write(json_encode($companies));
    return $response->withStatus(200)->withHeader('Content-type', 'application/json');
});


$app->get('/api/company/{id}', function (Request $request, Response $response, array $args) {

    if(ValidateArgs::validateId($args['id'])) {
        try {
            $companyCtr = new CompanyContr();
            $data = $companyCtr->getCompany($args['id']);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }

    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');

});

$app->post('/api/company/create', function (Request $request, Response $response, array $args) {
    $body = json_decode($request->getBody()->getContents(), true);

    if(ValidateArgs::validateBody('company', $body, ["name", "cnpj", "adress"]) && ValidateArgs::validateBody('adress', $body["adress"], ["cep", "country", "state", "city", "street", "number", "district"])) {

        try {
            $adressCtr = new AdressContr();
            $body['id_adress'] = $adressCtr->insertAdress($body["adress"]);
            unset($body['adress']);

            $companyCtr = new CompanyContr();
            $data = $companyCtr->insertCompany($body);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }

    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');
});

$app->patch('/api/company/{id}/update', function (Request $request, Response $response, array $args) {
    $body = json_decode($request->getBody()->getContents(), true);

    if(ValidateArgs::validateId($args['id']) && ValidateArgs::validateBody('company', $body) && ValidateArgs::validateBody('adress', $body["adress"])) {

        try {
            $adressCtr = new AdressContr();
            $adressCtr->updateAdress($body["id_adress"], $body["adress"]);
            unset($body['adress']);

            $companyCtr = new CompanyContr();
            $data = $companyCtr->updateCompany($args['id'], $body);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }

    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');
});


$app->delete('/api/company/{id}/delete', function (Request $request, Response $response, array $args) {

    if(ValidateArgs::validateId($args['id'])) {
        try {
            $companyCtr = new CompanyContr();
            $data = $companyCtr->deleteCompany($args['id']);
        } catch(Exception $e) {
            $data = ERROR_GENERIC;
        }
    } else {
        $data = BAD_REQUEST;
    }

    $response->getBody()->write(json_encode($data['data']));
    return $response->withStatus($data['status'])->withHeader('Content-type', 'application/json');
});



try {
    @$app->run();
} catch(Exception $e) {

}
