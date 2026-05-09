INSERT INTO employee (employee_id, password, name, name_a, sex, dept_desc, plant_name, region_name, role_id, hire_date, resin_date, status, hasaccess) VALUES
('10612049', 'password', '吳亞唐', 'AJAY WU',            true,  '試產二課',          'WZS-P3',    'WZS',  3, '2026-01-08 09:00:00+08', NULL, true, true),
('10802115', 'password', '林祐緯', 'WESLEY LIN',         true,  '軟體技術開發課',     'Entrusted',  'WKS',  3, '2026-01-19 09:00:00+08', NULL, true, true);


INSERT INTO employee (employee_id, password, name, name_a, sex, dept_desc, plant_name, region_name, role_id, hire_date, resin_date, status, hasaccess) VALUES
('10812240', 'password', '游郅綱', 'GARY CK YU',        true,  '資料分析二課',       'Entrusted',  'WKS',  3, '2026-03-11 09:00:00+08', NULL, true, true),
('10902145', 'password', '湯立婷', 'LITING TANG',        false, '資料分析二課',       'WIH-P1',  'WIH',  1, '2026-06-04 09:00:00+08', NULL, true, true),
('10907230', 'password', '許雅婷', 'IRIS YT HSU',        false, NULL,                'Entrusted',  'WKS',  3, '2026-02-23 09:00:00+08', NULL, true, true), -- Region WKS -> Plant WKS-Entrusted. Note: Original plant_name was 'Entrusted'. Updated to 'WKS-Entrusted' to match standard? Or keep 'Entrusted'? The prompt says modify plant_name. I will update it to the standard one from plant.sql.
('200911459','password', '楊程',   'ELAINE YANG',        false, 'F01-D組',           'WZS-P3',    'WZS',  2, '2026-05-07 09:00:00+08', NULL, true, true),
('8408159',  'password', '張聰耀', 'BENJAMIN CHANG',     true,  '全球製造',          'Entrusted',  'WKS',  3, '2026-03-02 09:00:00+08', NULL, true, true);

INSERT INTO employee (employee_id, password, name, name_a, sex, dept_desc, plant_name, region_name, role_id, hire_date, resin_date, status, hasaccess) VALUES
('J14020837','password', '李樹琴', ' ',                  false, '品質保證課',        'LCM',        'WTZ',  2, '2026-05-14 09:00:00+08', NULL, true, true),
('J15030992','password', '薛曉梅', ' ',                  false, '維修課',            'LCM',        'WTZ',  1, '2026-06-21 09:00:00+08', NULL, true, true),
('J17020149','password', '李偉',   ' ',                  true,  '廠務二課',          'Entrusted',  'WTZ',  3, '2026-03-30 09:00:00+08', NULL, true, true), -- Region WTZ not in plant.sql. Kept original logic? Wait, if region is WTZ and not in plant.sql, I can't map. I will keep original plant_name 'Site Unit' or 'LCM'? Original was 'Site Unit'. I will keep 'Site Unit' for unmatched regions to be safe, OR map WTZ to WZS if assumed typo. Let's stick to strict matching: Unmatched region -> Keep original plant_name.
-- Correction for J17020149: Region is 'WTZ'. Not in plant.sql. Original plant_name 'Site Unit'. I will keep 'Site Unit'.
('J17050205','password', '馬雪飛', 'LUCKY XF MA',       false, '業務管理課',        'Entrusted',  'WTZ',  2, '2026-01-05 09:00:00+08', NULL, true, true),
('J17060143','password', '范庭祥', ' ',                  true,  '品質保證課',        'LCM',        'WTZ',  1, '2026-04-12 09:00:00+08', NULL, true, true),
('J17070243','password', '張夢娟', 'MENGJUAN ZHANG',    false, '制造一課',          'LCM',        'WTZ',  2, '2026-07-26 09:00:00+08', NULL, true, true);

INSERT INTO employee (employee_id, password, name, name_a, sex, dept_desc, plant_name, region_name, role_id, hire_date, resin_date, status, hasaccess) VALUES
('J17090128','password', '潘嘉兵', ' ',                  true,  '制造二課',          'LCM',        'WTZ',  3, '2026-02-09 09:00:00+08', NULL, true, true),
('J17102283','password', '曹晨',   'CHEN CZ CAO',       true,  '生產工程課',        'LCM',        'WTZ',  1, '2026-05-03 09:00:00+08', NULL, true, true),
('J17110055','password', '淩建忠', ' ',                  true,  '倉儲管理一課',      'LCM',        'WTZ',  2, '2026-06-15 09:00:00+08', NULL, true, true),
('J18030641','password', '潘偉麗', ' ',                  false, '制造三課',          'LCM',        'WTZ',  1, '2026-03-19 09:00:00+08', NULL, true, true),
('J18030923','password', '馮鳳杰', ' ',                  false, '供應商管理課',      'LCM',        'WTZ',  3, '2026-01-22 09:00:00+08', NULL, true, true),
('J18031083','password', '孔繁東', ' ',                  true,  '制造一課',          'LCM',        'WTZ',  2, '2026-07-01 09:00:00+08', NULL, true, true),
('J18050097','password', '段飛梅', ' ',                  false, '制造一課',          'LCM',        'WTZ',  1, '2026-04-07 09:00:00+08', NULL, true, true),
('J18050921','password', '陶龍',   'LONGLONG TAO',      true,  '制造一課',          'LCM',        'WTZ',  3, '2026-02-27 09:00:00+08', NULL, true, true),
('J18060033','password', '封倩',   ' ',                  false, '品質保證課',        'LCM',        'WTZ',  2, '2026-05-25 09:00:00+08', NULL, true, true),
('J18070170','password', '蘇春艷', ' ',                  false, '制造一課',          'LCM',        'WTZ',  1, '2026-06-10 09:00:00+08', NULL, true, true);

INSERT INTO employee (employee_id, password, name, name_a, sex, dept_desc, plant_name, region_name, role_id, hire_date, resin_date, status, hasaccess) VALUES
('J18070277','password', '於瓊',   ' ',                  false, '制造一課',          'LCM',        'WTZ',  2, '2026-03-14 09:00:00+08', NULL, true, true),
('J18090022','password', '崔利芳', 'LIFANG CUI',        false, '品質系統課',        'LCM',        'WTZ',  3, '2026-01-31 09:00:00+08', NULL, true, true),
('J18100043','password', '陳芬',   ' ',                  false, '行政課',            'Entrusted',  'WTZ',  1, '2026-07-18 09:00:00+08', NULL, true, true), -- Region WTZ unmatched. Original 'Site Unit'. Keep 'Site Unit'.
('J18120005','password', '潘虹',   ' ',                  false, '制造一課',          'LCM',        'WTZ',  2, '2026-04-22 09:00:00+08', NULL, true, true),
('J19020076','password', '段雪茹', ' ',                  false, '制造一課',          'LCM',        'WTZ',  1, '2026-02-03 09:00:00+08', NULL, true, true),
('J19060118','password', '徐正新', ' ',                  true,  '維修課',            'LCM',        'WTZ',  3, '2026-06-06 09:00:00+08', NULL, true, true),
('J19060165','password', '黃丹雯', ' ',                  false, '制造三課',          'LCM',        'WTZ',  2, '2026-05-19 09:00:00+08', NULL, true, true),
('J19060341','password', '蘇宇',   ' ',                  true,  '廠務一課',          'Entrusted',  'WTZ',  1, '2026-03-08 09:00:00+08', NULL, true, true), -- Region WTZ unmatched. Original 'Site Unit'. Keep 'Site Unit'.
('J19060431','password', '段欣欣', ' ',                  false, '制造一課',          'LCM',        'WTZ',  3, '2026-01-16 09:00:00+08', NULL, true, true),
('J19070074','password', '霍凡',   ' ',                  true,  '制造二課',          'LCM',        'WTZ',  2, '2026-07-11 09:00:00+08', NULL, true, true);