<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    require_once 'config.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro de configuração: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}

class AuthAPI {
    private $apiKey;
    private static $instance = null;
    
    private function __construct() {
        $this->apiKey = FIREBASE_API_KEY;
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    

    private function __clone() {}
    

    private function __wakeup() {}
    
    public function handleRequest() {
        $action = $_GET['action'] ?? '';
        $input = json_decode(file_get_contents('php://input'), true);
        
        try {
            switch ($action) {
                case 'login':
                    return $this->login($input['email'], $input['password']);
                case 'register':
                    return $this->register($input['email'], $input['password']);
                case 'verify':
                    return $this->verifyToken($input['token']);
                case 'send-code':
                    return $this->sendVerificationCode($input['email']);
                case 'verify-code':
                    return $this->verifyCode($input['email'], $input['code']);
                default:
                    throw new Exception('Ação inválida');
            }
        } catch (Exception $e) {
            http_response_code(400);
            return ['error' => $e->getMessage()];
        }
    }
    
    private function login($email, $password) {
        $url = FIREBASE_AUTH_URL . ":signInWithPassword?key=" . $this->apiKey;
        $data = json_encode([
            'email' => $email,
            'password' => $password,
            'returnSecureToken' => true
        ]);
        
        $response = $this->makeRequest($url, $data);
        
        if (isset($response['error'])) {
            throw new Exception('Email ou senha inválidos');
        }
        
        return [
            'success' => true,
            'token' => $response['idToken'],
            'userId' => $response['localId'],
            'email' => $response['email']
        ];
    }
    
    private function register($email, $password) {
        $url = FIREBASE_AUTH_URL . ":signUp?key=" . $this->apiKey;
        $data = json_encode([
            'email' => $email,
            'password' => $password,
            'returnSecureToken' => true
        ]);
        
        $response = $this->makeRequest($url, $data);
        
        if (isset($response['error'])) {
            throw new Exception('Erro ao criar conta: ' . $response['error']['message']);
        }
        
        return [
            'success' => true,
            'token' => $response['idToken'],
            'userId' => $response['localId'],
            'email' => $response['email']
        ];
    }
    
    private function verifyToken($token) {
        $url = FIREBASE_AUTH_URL . ":lookup?key=" . $this->apiKey;
        $data = json_encode(['idToken' => $token]);
        
        $response = $this->makeRequest($url, $data);
        
        if (isset($response['error'])) {
            throw new Exception('Token inválido');
        }
        
        return [
            'valid' => true,
            'userId' => $response['users'][0]['localId'],
            'email' => $response['users'][0]['email']
        ];
    }
    
    private function sendVerificationCode($email) {

        $code = sprintf('%06d', mt_rand(0, 999999));
        

        $url = FIREBASE_URL . "/verification_codes/" . md5($email) . ".json";
        $data = json_encode([
            'code' => $code,
            'email' => $email,
            'expires' => time() + 300
        ]);
        
        $context = stream_context_create([
            'http' => [
                'method' => 'PUT',
                'header' => 'Content-Type: application/json',
                'content' => $data
            ]
        ]);
        
        file_get_contents($url, false, $context);
        

        return [
            'success' => true,
            'message' => 'Código enviado',
            'code' => $code
        ];
    }
    
    private function verifyCode($email, $code) {
        $url = FIREBASE_URL . "/verification_codes/" . md5($email) . ".json";
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        
        if (!$data || $data['expires'] < time()) {
            throw new Exception('Código expirado');
        }
        
        if ($data['code'] !== $code) {
            throw new Exception('Código inválido');
        }
        

        $context = stream_context_create(['http' => ['method' => 'DELETE']]);
        file_get_contents($url, false, $context);
        
        return ['success' => true, 'verified' => true];
    }
    
    private function makeRequest($url, $data) {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => $data
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        return json_decode($response, true);
    }
}

try {
    $api = AuthAPI::getInstance();
    $result = $api->handleRequest();
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>