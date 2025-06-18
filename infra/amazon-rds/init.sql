-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for filtering by user
CREATE INDEX idx_files_user_id ON files (user_id);

-- Optional: Index if you sort/filter by filename or mimetype
CREATE INDEX idx_files_filename ON files (filename);

-- Article Pages Table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on user_id for filtering by author
CREATE INDEX idx_articles_user_id ON articles (user_id);

-- Index for fast search by title (especially if using LIKE or ILIKE)
CREATE INDEX idx_articles_title ON articles (title);

-- Index for sorting
CREATE INDEX idx_articles_created_at ON articles (created_at);

-- Files Table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  page_id UUID REFERENCES knowledge_pages(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for filtering by user
CREATE INDEX idx_files_user_id ON files (user_id);

-- Optional: Index if you sort/filter by filename or mimetype
CREATE INDEX idx_files_filename ON files (filename);

