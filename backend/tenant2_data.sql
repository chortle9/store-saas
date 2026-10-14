-- 创建第二个租户：第二家店
INSERT INTO tenants (id, name, phone, address, businessHours, description, plan, planExpireAt, status) 
VALUES (2, '优雅美甲连锁店', '020-66666666', '广州市天河区珠江新城花城汇', '11:00-22:00', '专业美甲美睫，时尚美甲专家', 'basic', '2027-12-31 23:59:59', 1);

-- 第二家店的管理员账号（密码同样是123456）
INSERT INTO users (id, tenantId, username, password, realName, phone, role, status)
VALUES (2, 2, 'admin2', '$2a$10$JrYBuHBFWw2LTiwTFVwcZOQgu1gnYvzsTjF2rNJqnjHE0Q.aKPGPe', '美甲店老板', '13800138000', 'admin', 1);

-- 第二家店的会员数据（和第一家店完全不同）
INSERT INTO members (tenantId, name, phone, gender, source, tags, balance, points, remark, status) VALUES
(2, '张小姐', '13700137001', '女', '到店', '["VIP","美甲控"]', 300.00, 50, '喜欢日系款式', 1),
(2, '刘女士', '13700137002', '女', '抖音', '["老客户"]', 150.00, 30, '', 1);

-- 第二家店的服务项目
INSERT INTO service_items (tenantId, name, category, price, duration, description, status, sort) VALUES
(2, '日式纯色美甲', '美甲', 128.00, 60, '日式简约纯色美甲', 1, 1),
(2, '网红款式美甲', '美甲', 228.00, 90, '当下最流行款式', 1, 2),
(2, '貂毛睫毛嫁接', '美睫', 328.00, 120, '进口貂毛，自然浓密', 1, 3);
