```sql
CREATE TABLE `promotion_info` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`page_id` varchar(16) DEFAULT NULL,
`pos_id` varchar(218) DEFAULT NULL,
`platform_id` varchar(16) DEFAULT NULL,
`flag` int(11) DEFAULT NULL,
`uid` bigint(20) DEFAULT NULL,
`create_time` bigint(20) DEFAULT NULL,
`category` int(4) DEFAULT NULL,
`score` double(5, 2) DEFAULT NULL,
`target_category` varchar(16) DEFAULT NULL,
`name` varchar(218) DEFAULT NULL,
`total_show_count` bigint(20) DEFAULT NULL,
`is_target` int(4) DEFAULT NULL,
`updated_at` bigint(20) DEFAULT NULL,
`is_hour` int(4) NOT NULL DEFAULT '0' COMMENT '小时推送',
`total_click_count` bigint(20) NOT NULL DEFAULT '0' COMMENT 'CPC点击数',
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 10000038400 DEFAULT CHARSET = utf8


CREATE TABLE `promotion_instance` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`date` varchar(16) DEFAULT NULL,
`promotion_id` bigint(20) DEFAULT NULL,
`flag` int(11) DEFAULT NULL,
`show_count` bigint(20) DEFAULT NULL,
`click_count` bigint(20) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `idx_promotion_id` (`promotion_id`),
KEY `idx_flag_date` (`flag`, `date`)
) ENGINE = InnoDB AUTO_INCREMENT = 69678 DEFAULT CHARSET = utf8


CREATE TABLE `promotion_position` (
`id` int(32) NOT NULL AUTO_INCREMENT,
`label` varchar(256) DEFAULT NULL,
`value` varchar(256) DEFAULT NULL,
`parent_id` int(32) DEFAULT NULL,
`category` int(32) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 149 DEFAULT CHARSET = utf8


Create Table
CREATE TABLE `promotion_schedule` (
`id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
`promotion_id` bigint(20) NOT NULL COMMENT '推广id',
`instance_id` bigint(20) NOT NULL COMMENT '推广日期id',
`date` bigint(20) NOT NULL COMMENT '推广日期',
`begin` int(4) NOT NULL COMMENT '排期起始时间(小时)',
`end` int(4) NOT NULL COMMENT '排期终止时间',
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 55710 DEFAULT CHARSET = utf8


CREATE TABLE `promotion_scheduling_position` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`name` varchar(218) NOT NULL,
`page_id` varchar(16) NOT NULL,
`pos_id` varchar(16) NOT NULL,
`platform_id` varchar(16) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8


CREATE TABLE `display_promotion_material` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`promotion_id` bigint(20) DEFAULT NULL,
`image` varchar(256) DEFAULT NULL,
`link` varchar(1024) DEFAULT NULL,
`version_expr` varchar(256) DEFAULT NULL,
`timer` int(4) NOT NULL DEFAULT '3' COMMENT '展示时间',
`video` varchar(256) NOT NULL DEFAULT '' COMMENT '视频连接',
`is_full_screen` int(4) NOT NULL DEFAULT '0' COMMENT '是否全屏',
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 41279 DEFAULT CHARSET = utf8
```



```sql
ads_info,ads_instance,ads_material,ads_position_statistics,ads_schedule,ads_statistics,ads_target,ads_test_user,ads_whitelist_user,feature_dict,user_profile
```



```sql
CREATE TABLE `ads_info` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`category` varchar(64) DEFAULT NULL,
`type` varchar(64) DEFAULT NULL,
`name` varchar(256) DEFAULT NULL,
`status` tinyint(1) DEFAULT '0',
`advertiser` varchar(256) DEFAULT NULL,
`created_at` bigint(20) DEFAULT NULL,
`updated_at` bigint(20) DEFAULT NULL,
`rank` bigint(20) NOT NULL COMMENT '排名',
`target_categroy` varchar(32) NOT NULL COMMENT '定向类型',
`position` bigint(20) NOT NULL COMMENT '位置',
`is_hour` int(4) NOT NULL DEFAULT '0' COMMENT '小时推送',
`total_show_count` bigint(20) NOT NULL DEFAULT '0' COMMENT 'CPM展示数',
PRIMARY KEY (`id`),
KEY `idx_ads_info_status` (`status`),
KEY `idx_rank` (`rank`)
) ENGINE = InnoDB AUTO_INCREMENT = 8186 DEFAULT CHARSET = utf8


CREATE TABLE `ads_instance` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`ads_id` bigint(20) NOT NULL,
`category` varchar(64) DEFAULT NULL,
`type` varchar(64) DEFAULT NULL,
`date` bigint(20) DEFAULT NULL,
`status` tinyint(1) DEFAULT '0',
`created_at` bigint(20) DEFAULT NULL,
`updated_at` bigint(20) DEFAULT NULL,
`traffic` double(16, 2) NOT NULL COMMENT '流量分配',
PRIMARY KEY (`id`),
KEY `idx_ads_instance_ads_id_date_status` (`ads_id`, `date`, `status`),
KEY `idx_ads_instance_date` (`date`)
) ENGINE = InnoDB AUTO_INCREMENT = 43553 DEFAULT CHARSET = utf8


CREATE TABLE `ads_material` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`ads_id` bigint(20) NOT NULL,
`title` varchar(256) DEFAULT NULL,
`description` varchar(1024) DEFAULT NULL,
`target_url` varchar(1024) DEFAULT NULL,
`tag` varchar(256) DEFAULT NULL,
`images` varchar(1024) DEFAULT NULL,
`highlight` tinyint(1) DEFAULT NULL,
`created_at` bigint(20) DEFAULT NULL,
`updated_at` bigint(20) DEFAULT NULL,
`style` varchar(256) DEFAULT 'defalut' COMMENT '展示时间',
`advertiser_image_url` varchar(1024) DEFAULT '' COMMENT '广告主头像',
`video` varchar(256) DEFAULT '' COMMENT '视频',
`duration` bigint(20) DEFAULT '0' COMMENT '视频时长',
PRIMARY KEY (`id`),
KEY `idx_ads_material_ads_id` (`ads_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 8170 DEFAULT CHARSET = utf8


CREATE TABLE `ads_position_statistics` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`date` bigint(20) NOT NULL,
`position` bigint(20) NOT NULL,
`show_count` bigint(20) DEFAULT NULL,
`created_at` bigint(20) DEFAULT NULL,
`updated_at` bigint(20) DEFAULT NULL,
`click_count` bigint(20) DEFAULT '0',
`ctr` decimal(32, 8) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `date` (`date`)
) ENGINE = InnoDB AUTO_INCREMENT = 15761 DEFAULT CHARSET = utf8


CREATE TABLE `ads_schedule` (
`id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
`ads_id` bigint(20) NOT NULL COMMENT '推广id',
`instance_id` bigint(20) NOT NULL COMMENT '推广日期id',
`date` bigint(20) NOT NULL COMMENT '推广日期',
`begin` int(4) NOT NULL COMMENT '排期起始时间(小时)',
`end` int(4) NOT NULL COMMENT '排期终止时间',
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 40059 DEFAULT CHARSET = utf8


CREATE TABLE `ads_statistics` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`ads_id` bigint(20) NOT NULL,
`date` bigint(20) NOT NULL,
`show_count` bigint(20) DEFAULT NULL,
`click_count` bigint(20) DEFAULT NULL,
`created_at` bigint(20) DEFAULT NULL,
`updated_at` bigint(20) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `idx_ads_statistics_ads_id` (`ads_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 19409 DEFAULT CHARSET = utf8


CREATE TABLE `ads_target` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`ads_id` bigint(20) NOT NULL,
`feature_id` bigint(20) NOT NULL,
PRIMARY KEY (`id`),
KEY `ads_id` (`ads_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 18 DEFAULT CHARSET = utf8


CREATE TABLE `ads_test_user` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`uid` bigint(20) NOT NULL,
`remark` varchar(512) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8

CREATE TABLE `ads_whitelist_user` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`uid` bigint(20) NOT NULL,
`remark` varchar(512) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8


CREATE TABLE `feature_dict` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`name` varchar(32) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8


CREATE TABLE `user_profile` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`user_id` bigint(20) NOT NULL,
`feature_id` bigint(20) NOT NULL,
PRIMARY KEY (`id`),
KEY `user_id` (`user_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 132355 DEFAULT CHARSET = utf8
```

