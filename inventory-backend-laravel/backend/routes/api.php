<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

$flask = 'http://127.0.0.1:5000';

Route::get('/health', fn() => Http::get("$flask/health")->json());

Route::get('/inventory', function() use ($flask) {
    return Http::get("$flask/inventory")->json();
});

Route::get('/logs', function() use ($flask) {
    return Http::get("$flask/logs")->json();
});

Route::get('/anomalies', function() use ($flask) {
    return Http::get("$flask/anomalies")->json();
});

Route::post('/submit_scan', function(Request $request) use ($flask) {
    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    $file = $request->file('file');

    $response = Http::attach(
        'file',
        file_get_contents($file->getRealPath()), 
        $file->getClientOriginalName()
    )->post("$flask/submit_scan");

    return $response->json();
});