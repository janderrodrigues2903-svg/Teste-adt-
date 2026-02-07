<?php

const NO_CONTENT = array("data" => array("message" => "requested data not found!"), "status" => 404);
const BAD_REQUEST = array("data" => array("message" => "invalid data!"), "status" => 400);

const ERROR_GENERIC = array("data" => array("message" => "an error occured during request execution!"), "status" => 500);

const UPDATE_FAILED = array("data" => array("message" => "unable to update data!"), "status" => 404);
const UPDATE_SUCCEDED = array("data" => array("message" => "data updated successfully!"), "status" => 200);

const DELETE_FAILED = array("data" => array("message" => "unable to delete data!"), "status" => 404);
const DELETE_SUCCEDED = array("data" => array("message" => "data deleted successfully!"), "status" => 200);
