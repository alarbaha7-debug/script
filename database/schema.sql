-- ============================================
-- FacelessScriptPro Database Schema
-- PostgreSQL 15+
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users
-- Stores user information from Discord OAuth
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,

    -- Subscription info
    subscription_active BOOLEAN DEFAULT false,
    subscription_tier VARCHAR(50) DEFAULT 'free',

    -- Usage tracking
    scripts_generated_today INTEGER DEFAULT 0,
    scripts_generated_total INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================
-- TABLE: scripts
-- Stores generated scripts
-- ============================================
CREATE TABLE IF NOT EXISTS scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Script metadata
    title VARCHAR(500) NOT NULL,
    niche VARCHAR(100) NOT NULL,
    style_type VARCHAR(100) NOT NULL,

    -- Input data
    script_example TEXT,
    plot_details TEXT,
    extra_instructions TEXT,

    -- Analysis and output
    analysis_json JSONB,
    generated_script TEXT NOT NULL,

    -- Stats
    character_count INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    chunk_count INTEGER NOT NULL,
    generation_time_seconds INTEGER,

    -- Status
    status VARCHAR(50) DEFAULT 'completed',

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);
CREATE INDEX idx_scripts_niche ON scripts(niche);
CREATE INDEX idx_scripts_style_type ON scripts(style_type);

-- ============================================
-- TABLE: api_keys
-- Stores encrypted API keys for users
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Key data (should be encrypted in production)
    encrypted_key TEXT NOT NULL,
    key_type VARCHAR(50) DEFAULT 'gemini',

    -- Validation
    is_valid BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- ============================================
-- TABLE: usage_logs
-- Tracks API usage and errors
-- ============================================
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Request info
    endpoint VARCHAR(255) NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    api_provider VARCHAR(50),

    -- Result
    success BOOLEAN DEFAULT true,
    error_message TEXT,

    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX idx_usage_logs_endpoint ON usage_logs(endpoint);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert a demo user
INSERT INTO users (discord_id, username, email, avatar_url, subscription_tier)
VALUES (
    'demo-123456789',
    'Demo User',
    'demo@facelessscriptpro.com',
    'https://cdn.discordapp.com/embed/avatars/0.png',
    'free'
) ON CONFLICT (discord_id) DO NOTHING;

-- ============================================
-- VIEWS (optional - for analytics)
-- ============================================

-- View for script statistics
CREATE OR REPLACE VIEW script_statistics AS
SELECT
    u.username,
    COUNT(s.id) as total_scripts,
    AVG(s.character_count) as avg_characters,
    AVG(s.generation_time_seconds) as avg_generation_time,
    s.niche,
    s.style_type
FROM scripts s
JOIN users u ON s.user_id = u.id
WHERE s.deleted_at IS NULL
GROUP BY u.username, s.niche, s.style_type;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Stores user account information from Discord OAuth';
COMMENT ON TABLE scripts IS 'Stores all generated scripts with metadata and analytics';
COMMENT ON TABLE api_keys IS 'Stores encrypted API keys for external services (Gemini)';
COMMENT ON TABLE usage_logs IS 'Tracks all API requests for monitoring and debugging';

-- ============================================
-- SCHEMA VERSION
-- ============================================

CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_version (version, description)
VALUES ('1.0.0', 'Initial schema for FacelessScriptPro')
ON CONFLICT (version) DO NOTHING;
