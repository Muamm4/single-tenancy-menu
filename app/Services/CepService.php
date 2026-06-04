<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CepService
{
    public function lookup(string $rawCep): array
    {
        $cep = preg_replace('/[^0-9]/', '', $rawCep);

        if (strlen($cep) !== 8) {
            return ['error' => 'CEP inválido', 'status' => 422];
        }

        try {
            $response = Http::get("https://viacep.com.br/ws/{$cep}/json/");
            $data = $response->json();

            if (isset($data['erro']) && $data['erro'] === true) {
                return ['error' => 'CEP não encontrado', 'status' => 404];
            }

            return [
                'status' => 200,
                'data' => [
                    'street' => $data['logradouro'] ?? '',
                    'neighborhood' => $data['bairro'] ?? '',
                    'city' => $data['localidade'] ?? '',
                    'state' => $data['uf'] ?? '',
                    'zip_code' => $cep,
                ],
            ];
        } catch (\Exception $e) {
            return ['error' => 'Erro ao buscar CEP', 'status' => 500];
        }
    }
}
