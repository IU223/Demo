INSERT INTO region (region_id, region_name, longitude, latitude) VALUES
    (1, 'WKS',   120.9800,   31.3500),
    (2, 'WZS',   113.4200,   22.5200),
    (3, 'XTRKS', 120.9700,   31.3600),
    (4, 'WIH',   120.9686,   24.8036),
    (5, 'WCQ',   106.5516,   29.5630),
    (6, 'WCD',   103.9500,   30.5500),
    (7, 'WMY',   100.3500,    5.3500),
    (8, 'WMX',  -106.4245,   31.6904),
    (9, 'WVN',   105.9600,   20.5400),
    (10, 'WTZ',   119,   32.4);

    UPDATE region SET region_name_cn = '昆山厂'       WHERE region_id = 1;
UPDATE region SET region_name_cn = '中山厂'       WHERE region_id = 2;
UPDATE region SET region_name_cn = '昆山蔚隆厂'   WHERE region_id = 3;
UPDATE region SET region_name_cn = '新竹厂'       WHERE region_id = 4;
UPDATE region SET region_name_cn = '重庆厂'       WHERE region_id = 5;
UPDATE region SET region_name_cn = '成都厂'       WHERE region_id = 6;
UPDATE region SET region_name_cn = '马来西亚厂'   WHERE region_id = 7;
UPDATE region SET region_name_cn = '墨西哥厂'     WHERE region_id = 8;
UPDATE region SET region_name_cn = '越南厂'       WHERE region_id = 9;
UPDATE region SET region_name_cn = '泰州厂'       WHERE region_id = 10;
