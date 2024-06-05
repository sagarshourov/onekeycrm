<?php

// app/Services/GraphService.php
namespace App\Services;

use Microsoft\Graph\Graph;
use Microsoft\Graph\Model;
use GuzzleHttp\Client;

class GraphService
{
    protected $clientId;
    protected $clientSecret;
    protected $tenantId;
    protected $redirectUri;
    protected $graph;

    public function __construct()
    {
        $this->clientId = env('AZURE_CLIENT_ID');
        $this->clientSecret = env('AZURE_CLIENT_SECRET');
        $this->tenantId = env('AZURE_TENANT_ID');
        $this->redirectUri = env('AZURE_REDIRECT_URI');
        $this->graph = new Graph();
    }

    public function getAccessToken($code)
    {
        $client = new Client();
        $response = $client->post('https://login.microsoftonline.com/' . $this->tenantId . '/oauth2/v2.0/token', [
            'form_params' => [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'code' => $code,
                'redirect_uri' => $this->redirectUri,
                'grant_type' => 'authorization_code',
                'scope' => 'https://graph.microsoft.com/.default'
            ]
        ]);

        $data = json_decode($response->getBody()->getContents(), true);
        return $data['access_token'];
    }

    public function getEmails($accessToken)
    {
        $this->graph->setAccessToken($accessToken);

        $messages = $this->graph->createRequest("GET", "/me/messages")
                                ->setReturnType(Model\Message::class)
                                ->execute();

        return $messages;
    }
}
