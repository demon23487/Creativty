<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json');
    echo json_encode([
        'ok' => true,
        'message' => 'PHP is running'
    ]);
    exit;
}
header("Content-Type: application/json");

// Use SQLite in the same directory
$dbFile = __DIR__ . '/db.sqlite';
$db = new PDO("sqlite:$dbFile");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Create tables if not exist
$db->exec("
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    token TEXT NOT NULL
  );
");

$db->exec("
  CREATE TABLE IF NOT EXISTS creations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
");

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Invalid JSON"]);
  exit;
}

$action = $input["action"] ?? "";

if ($action === "auth") {
  handleAuth($db, $input);
} elseif ($action === "save") {
  handleSave($db, $input);
} elseif ($action === "list") {
  handleList($db, $input);
} else {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Unknown action"]);
}

function handleAuth($db, $input) {
  $username = trim($input["username"] ?? "");
  $password = trim($input["password"] ?? "");

  if (!$username || !$password) {
    echo json_encode(["ok" => false, "error" => "Username and password required"]);
    return;
  }

  $stmt = $db->prepare("SELECT * FROM users WHERE username = :u LIMIT 1");
  $stmt->execute([":u" => $username]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user) {
    // Login
    if ($user["password"] !== hash("sha256", $password)) {
      echo json_encode(["ok" => false, "error" => "Invalid credentials"]);
      return;
    }
    // Reuse existing token
    echo json_encode([
      "ok" => true,
      "username" => $user["username"],
      "token" => $user["token"],
    ]);
  } else {
    // Register
    $token = bin2hex(random_bytes(16));
    $hashed = hash("sha256", $password);

    $stmt = $db->prepare("INSERT INTO users (username, password, token) VALUES (:u, :p, :t)");
    try {
      $stmt->execute([":u" => $username, ":p" => $hashed, ":t" => $token]);
    } catch (Exception $e) {
      echo json_encode(["ok" => false, "error" => "Username already exists"]);
      return;
    }

    echo json_encode([
      "ok" => true,
      "username" => $username,
      "token" => $token,
    ]);
  }
}

function handleSave($db, $input) {
  $headers = getallheaders();
  $authHeader = $headers["Authorization"] ?? "";
  $token = str_replace("Bearer ", "", $authHeader);

  if (!$token) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Unauthorized"]);
    return;
  }

  $stmt = $db->prepare("SELECT id FROM users WHERE token = :t LIMIT 1");
  $stmt->execute([":t" => $token]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Invalid token"]);
    return;
  }

  $type = $input["type"] ?? "other";
  $content = $input["content"] ?? "";

  if (!$content) {
    echo json_encode(["ok" => false, "error" => "No content"]);
    return;
  }

  $stmt = $db->prepare("INSERT INTO creations (user_id, type, content, created_at) VALUES (:uid, :type, :c, :t)");
  $stmt->execute([
    ":uid" => $user["id"],
    ":type" => $type,
    ":c" => $content,
    ":t" => time(),
  ]);

  echo json_encode(["ok" => true]);
}

function handleList($db, $input) {
  $headers = getallheaders();
  $authHeader = $headers["Authorization"] ?? "";
  $token = str_replace("Bearer ", "", $authHeader);

  if (!$token) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Unauthorized"]);
    return;
  }

  $stmt = $db->prepare("SELECT id FROM users WHERE token = :t LIMIT 1");
  $stmt->execute([":t" => $token]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Invalid token"]);
    return;
  }

  $stmt = $db->prepare("SELECT type, content, created_at FROM creations WHERE user_id = :uid ORDER BY created_at DESC");
  $stmt->execute([":uid" => $user["id"]]);
  $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(["ok" => true, "items" => $items]);
}
