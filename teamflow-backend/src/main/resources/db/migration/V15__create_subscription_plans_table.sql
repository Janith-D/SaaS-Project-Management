CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    max_members INTEGER NOT NULL,
    max_projects INTEGER NOT NULL,
    storage_bytes BIGINT NOT NULL,
    price_monthly DOUBLE PRECISION NOT NULL DEFAULT 0,
    price_yearly DOUBLE PRECISION NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
