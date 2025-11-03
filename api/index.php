<?php
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

try {
    require_once 'config.php';
} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(['error' => 'Erro de configuração']);
    exit;
}

class LightAPI {
    private $firebaseUrl;
    private $userId;
    
    public function __construct() {
        $this->firebaseUrl = FIREBASE_URL;
        $this->userId = $this->getUserFromToken();
    }
    
    private function getUserFromToken() {
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? '';
        
        if (!$token) {
            throw new Exception('Token não fornecido');
        }
        
        $url = FIREBASE_AUTH_URL . ":lookup?key=" . FIREBASE_API_KEY;
        $data = json_encode(['idToken' => str_replace('Bearer ', '', $token)]);
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => $data
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        $result = json_decode($response, true);
        
        if (isset($result['error'])) {
            throw new Exception('Token inválido');
        }
        
        return $result['users'][0]['localId'];
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        
        try {
            switch ($method) {
                case 'GET':
                    if ($action === 'status') {
                        return $this->getLightStatus();
                    }
                    break;
                    
                case 'POST':
                    if ($action === 'toggle') {
                        $input = json_decode(file_get_contents('php://input'), true);
                        return $this->setLightState($input['state'] ?? '');
                    }
                    break;
            }
            
            throw new Exception('Ação inválida');
            
        } catch (Exception $e) {
            http_response_code(400);
            return ['error' => $e->getMessage()];
        }
    }
    
    private function getLightStatus() {
        $url = $this->firebaseUrl . "/devices/dispositivo-do-breno/config/led13Mode.json";
        $response = file_get_contents($url);
        
        if ($response === false) {
            throw new Exception('Erro ao conectar com Firebase');
        }
        
        $state = json_decode($response, true) ?: 'off';
        return ['state' => $state];
    }
    
    private function setLightState($state) {
        if (!in_array($state, ['on', 'off'])) {
            throw new Exception('Estado inválido');
        }
        
        $configUrl = $this->firebaseUrl . "/devices/dispositivo-do-breno/config/led13Mode.json";
        $statusUrl = $this->firebaseUrl . "/devices/dispositivo-do-breno/status/led13Mode.json";
        $statusValue = $state === 'on' ? 'ligado' : 'desligado';
        
        $context = stream_context_create([
            'http' => [
                'method' => 'PUT',
                'header' => 'Content-Type: application/json',
                'content' => json_encode($state)
            ]
        ]);
        
        $statusContext = stream_context_create([
            'http' => [
                'method' => 'PUT',
                'header' => 'Content-Type: application/json',
                'content' => json_encode($statusValue)
            ]
        ]);
        
        $configResponse = file_get_contents($configUrl, false, $context);
        $statusResponse = file_get_contents($statusUrl, false, $statusContext);
        
        if ($configResponse === false || $statusResponse === false) {
            throw new Exception('Erro ao atualizar Firebase');
        }
        
        return ['success' => true, 'state' => $state];
    }
}

try {
    ob_end_clean();
    $api = new LightAPI();
    echo json_encode($api->handleRequest());
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno: ' . $e->getMessage()]);
}
?>