<?php

namespace App\Http\Controllers;

use App\Services\CepService;
use Illuminate\Http\JsonResponse;

class CepController extends Controller
{
    public function __construct(
        protected CepService $cepService
    ) {}

    public function show(string $cep): JsonResponse
    {
        $result = $this->cepService->lookup($cep);

        if (isset($result['error'])) {
            return response()->json(
                ['error' => $result['error']],
                $result['status']
            );
        }

        return response()->json($result['data']);
    }
}
