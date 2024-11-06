<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use GuzzleHttp\Psr7\Request;

// naha aweh anjir

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

}
