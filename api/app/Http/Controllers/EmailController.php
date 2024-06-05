<?php

// app/Http/Controllers/EmailController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GraphService;

class EmailController extends Controller
{
    protected $graphService;

    public function __construct(GraphService $graphService)
    {
        $this->graphService = $graphService;
    }

    public function authorize()
    {
        $authUrl = 'https://login.microsoftonline.com/' . env('AZURE_TENANT_ID') . '/oauth2/v2.0/authorize?' . http_build_query([
            'client_id' => env('AZURE_CLIENT_ID'),
            'response_type' => 'code',
            'redirect_uri' => env('AZURE_REDIRECT_URI'),
            'response_mode' => 'query',
            'scope' => 'https://graph.microsoft.com/.default'
        ]);

        return redirect($authUrl);
    }

    public function callback(Request $request)
    {
        $code = $request->query('code');
        $accessToken = $this->graphService->getAccessToken($code);

        // Store the access token in the session or database
        session(['access_token' => $accessToken]);

        return redirect('/emails');
    }

    public function getEmails()
    {
        $accessToken = session('access_token');
        $emails = $this->graphService->getEmails($accessToken);

        // Process and display the emails
        foreach ($emails as $email) {
            echo "Subject: " . $email->getSubject() . "<br>";
            echo "Body: " . $email->getBody()->getContent() . "<br><br>";
        }
    }
}
