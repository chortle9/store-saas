-- 演示会员数据
INSERT INTO members (tenantId, name, phone, gender, source, tags, balance, points, remark, status) VALUES
(1, '王小红', '13800138001', '女', '到店', '["VIP","敏感肌"]', 500.00, 120, '对酒精过敏', 1),
(1, '李美丽', '13800138002', '女', '抖音', '["老客户"]', 200.00, 80, '', 1),
(1, '张小芳', '13800138003', '女', '小红书', '["新客户"]', 0.00, 0, '', 1),
(1, '陈婷婷', '13800138004', '女', '老客推荐', '["VIP","产后修复"]', 1200.00, 350, '产后需温和护理', 1),
(1, '刘小美', '13800138005', '女', '到店', '[]', 100.00, 20, '', 1);

-- 演示服务项目
INSERT INTO service_items (tenantId, name, category, price, duration, description, status, sort) VALUES
(1, '深层清洁护理', '面部护理', 198.00, 60, '深层清洁毛孔，去除黑头粉刺', 1, 1),
(1, '补水保湿SPA', '面部护理', 298.00, 90, '深层补水，滋润肌肤', 1, 2),
(1, '肩颈放松理疗', '身体护理', 168.00, 45, '缓解肩颈疲劳，放松肌肉', 1, 3),
(1, '眼部护理', '面部护理', 128.00, 30, '淡化黑眼圈，去除眼袋', 1, 4),
(1, '美甲纯色', '美甲美睫', 158.00, 60, '经典纯色美甲，持久亮丽', 1, 5),
(1, '睫毛嫁接', '美甲美睫', 298.00, 90, '自然浓密睫毛嫁接', 1, 6);

-- 演示员工
INSERT INTO staff (tenantId, name, phone, position, commissionRate, status) VALUES
(1, '小美老师', '13900139001', '技师', 15.00, 1),
(1, '小丽老师', '13900139002', '技师', 12.00, 1),
(1, '小芳老师', '13900139003', '技师', 15.00, 1),
(1, '前台小张', '13900139004', '前台', 5.00, 1);

-- 演示卡项
INSERT INTO cards (tenantId, name, type, price, totalTimes, storedValue, validDays, description, status) VALUES
(1, '10次面部护理卡', 'times', 1680.00, 10, 0, 365, '面部护理项目通用，每次抵扣一次', 1),
(1, '储值卡1000元', 'stored_value', 1000.00, 0, 1000, 365, '店内所有项目通用储值卡', 1),
(1, '新客体验套餐', 'package', 99.00, 3, 0, 30, '新客专享：清洁+补水+肩颈放松', 1);

-- 演示优惠券
INSERT INTO coupons (tenantId, name, type, value, minAmount, totalCount, receivedCount, validDays, status) VALUES
(1, '新人满减券', 'cash', 30.00, 100.00, 100, 15, 30, 1),
(1, '8.5折体验券', 'discount', 8.5, 0, 50, 8, 15, 1),
(1, '生日专享券', 'cash', 50.00, 200.00, 0, 5, 7, 1);

-- 演示订单
INSERT INTO orders (orderNo, tenantId, memberId, memberName, totalAmount, discountAmount, payAmount, payMethod, status, staffId, paidAt) VALUES
('ORD20261010001', 1, 1, '王小红', 198.00, 0, 198.00, 'wechat', 'completed', 1, '2026-10-10 14:30:00'),
('ORD20261011002', 1, 2, '李美丽', 298.00, 30, 268.00, 'wechat', 'completed', 2, '2026-10-11 15:00:00'),
('ORD20261012003', 1, 4, '陈婷婷', 168.00, 0, 168.00, 'alipay', 'completed', 3, '2026-10-12 16:00:00'),
('ORD20261013004', 1, 3, '张小芳', 158.00, 0, 158.00, 'cash', 'completed', 1, '2026-10-13 11:00:00'),
('ORD20261014005', 1, 5, '刘小美', 198.00, 0, 198.00, 'wechat', 'completed', 2, '2026-10-14 10:30:00');

-- 演示预约
INSERT INTO appointments (tenantId, memberId, serviceId, serviceName, staffId, staffName, appointmentTime, duration, status, notified) VALUES
(1, 1, 1, '深层清洁护理', 1, '小美老师', '2026-10-14 14:00:00', 60, 'confirmed', 1),
(1, 2, 2, '补水保湿SPA', 2, '小丽老师', '2026-10-14 15:30:00', 90, 'pending', 0),
(1, 4, 3, '肩颈放松理疗', 3, '小芳老师', '2026-10-14 16:00:00', 45, 'confirmed', 1),
(1, 3, 5, '美甲纯色', 1, '小美老师', '2026-10-15 10:00:00', 60, 'pending', 0);
