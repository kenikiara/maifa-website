<?php
/**
 * /api/articles.php
 * GET    — list/get published articles (public)
 * POST   — create article (admin)
 * PUT    — update article (admin)
 * DELETE — delete article (admin)
 */

require_once __DIR__ . '/../config/helpers.php';
set_cors();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = db();

    // Single article by slug or id
    if (!empty($_GET['slug'])) {
        $stmt = $db->prepare('SELECT * FROM articles WHERE slug = ? AND published = 1');
        $stmt->execute([clean($_GET['slug'])]);
        $article = $stmt->fetch();
        if (!$article) json_err('Article not found', 404);
        json_ok(['article' => $article]);
    }

    if (!empty($_GET['id'])) {
        $stmt = $db->prepare('SELECT * FROM articles WHERE id = ?');
        $stmt->execute([(int) $_GET['id']]);
        $article = $stmt->fetch();
        if (!$article) json_err('Article not found', 404);
        json_ok(['article' => $article]);
    }

    // List
    $where  = ['published = 1'];
    $params = [];

    if (!empty($_GET['category'])) {
        $where[]  = 'category = ?';
        $params[] = clean($_GET['category']);
    }

    $limit  = min((int) ($_GET['limit'] ?? 20), 50);
    $offset = (int) ($_GET['offset'] ?? 0);

    $sql   = 'SELECT id, title, slug, excerpt, category, tags, meta_title, cover_image, author, created_at FROM articles WHERE '
           . implode(' AND ', $where)
           . ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $articles = $stmt->fetchAll();

    // Total count
    $countSql = 'SELECT COUNT(*) FROM articles WHERE ' . implode(' AND ', $where);
    // remove limit/offset params
    $countParams = array_slice($params, 0, -2);
    $total = $db->prepare($countSql);
    $total->execute($countParams);
    $total = (int) $total->fetchColumn();

    json_ok(['articles' => $articles, 'total' => $total]);
}

require_auth();

if ($method === 'POST') {
    $data  = json_body();
    if (empty($data['title'])) json_err('title is required');
    if (empty($data['content'])) json_err('content is required');

    $slug = make_slug($data['title'], $data['slug'] ?? '');

    $db   = db();
    $stmt = $db->prepare('
        INSERT INTO articles (title, slug, excerpt, content, category, tags, meta_title, meta_desc, cover_image, author, published)
        VALUES (:title,:slug,:excerpt,:content,:category,:tags,:meta_title,:meta_desc,:cover_image,:author,:published)
    ');
    $stmt->execute([
        ':title'       => clean($data['title']),
        ':slug'        => $slug,
        ':excerpt'     => clean($data['excerpt'] ?? ''),
        ':content'     => $data['content'],      // raw HTML — sanitise client-side via editor
        ':category'    => clean($data['category'] ?? 'General'),
        ':tags'        => clean($data['tags'] ?? ''),
        ':meta_title'  => clean($data['meta_title'] ?? ''),
        ':meta_desc'   => clean($data['meta_desc'] ?? ''),
        ':cover_image' => clean($data['cover_image'] ?? ''),
        ':author'      => clean($data['author'] ?? 'Maifa Team'),
        ':published'   => (int) ($data['published'] ?? 1),
    ]);
    json_ok(['id' => $db->lastInsertId(), 'slug' => $slug], 201);
}

if ($method === 'PUT') {
    $data = json_body();
    if (empty($data['id'])) json_err('id is required');

    $db   = db();
    $slug = make_slug($data['title'] ?? '', $data['slug'] ?? '');

    $stmt = $db->prepare('
        UPDATE articles SET
            title=:title, slug=:slug, excerpt=:excerpt, content=:content,
            category=:category, tags=:tags, meta_title=:meta_title, meta_desc=:meta_desc,
            cover_image=:cover_image, author=:author, published=:published
        WHERE id=:id
    ');
    $stmt->execute([
        ':title'       => clean($data['title'] ?? ''),
        ':slug'        => $slug,
        ':excerpt'     => clean($data['excerpt'] ?? ''),
        ':content'     => $data['content'] ?? '',
        ':category'    => clean($data['category'] ?? 'General'),
        ':tags'        => clean($data['tags'] ?? ''),
        ':meta_title'  => clean($data['meta_title'] ?? ''),
        ':meta_desc'   => clean($data['meta_desc'] ?? ''),
        ':cover_image' => clean($data['cover_image'] ?? ''),
        ':author'      => clean($data['author'] ?? 'Maifa Team'),
        ':published'   => (int) ($data['published'] ?? 1),
        ':id'          => (int) $data['id'],
    ]);
    json_ok(['slug' => $slug]);
}

if ($method === 'DELETE') {
    $data = json_body();
    if (empty($data['id'])) json_err('id is required');
    db()->prepare('DELETE FROM articles WHERE id = ?')->execute([(int) $data['id']]);
    json_ok();
}

json_err('Method not allowed', 405);
