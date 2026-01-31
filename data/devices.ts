// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	BOOX: [
		{
			name: "BOOX 7.8'' Tab Mini C",
			image: "/images/device/BOOX_7.8.png",
			specs: "彩色墨水屏 | 300ppi黑白/150ppi彩色",
			description: "彩色墨水瓶，看书看漫画。",
			link: "https://www.boox.com/",
		},
	],
	Apple: [
		{
			name: "MacBook Air (M4)",
			image: "/images/device/macbook_air_m4.png",
			specs:
				"Apple M4芯片 | 16GB统一内存 | 512GB存储 | 13.6英寸Liquid视网膜显示屏",
			description: "顶级续航，用了国补就是爽。",
			link: "https://www.apple.com/macbook-air/",
		},
	],
	Xiaomi: [
		{
			name: "Redmi K60 Pro",
			image: "/images/device/Redmi_K60_Pro.png",
			specs: "第二代骁龙8移动平台 | 120W有线快充+30W无线快充",
			description: "主力机。",
			link: "https://www.mi.com/",
		},
		{
			name: "小米平板5",
			image: "/images/device/Xiaomi_Pad_5.png",
			specs: "骁龙860处理器 | 11英寸2.5K 120Hz屏幕 | 8720mAh电池 | 33W快充",
			description: "澎湃os+win11，无敌了。",
			link: "https://www.mi.com/",
		},
		{
			name: "小米11",
			image: "/images/device/Xiaomi_11.png",
			specs:
				"骁龙888处理器 | 2K AMOLED四曲面屏 | 1亿像素主摄 | 4600mAh电池 | 55W有线+50W无线闪充",
			description: "换过主板，还好免费。",
			link: "https://www.mi.com/",
		},
	],
	Huawei: [
		{
			name: "MateBook E 2024",
			image: "/images/device/Huawei_MateBook_E_2024.png",
			specs:
				"第11代英特尔酷睿i7 | 16GB双通道内存 | 1TB PCIe SSD | 12.6英寸OLED屏幕",
			description: "续航差，发热大，没mac轻多少。",
			link: "https://www.huawei.com/",
		},
	],
	Samsung: [
		{
			name: "Galaxy Watch6 Classic",
			image: "/images/device/Galaxy_Watch6_Classic.png",
			specs: "1.5英寸Super AMOLED | 480×480分辨率 | LTE支持 | IP68防水",
			description: "6classic之后的三星表都没这个好看",
			link: "https://www.samsung.com/",
		},
		{
			name: "Galaxy Watch5",
			image: "/images/device/Galaxy_Watch5.png",
			specs: "1.4英寸Super AMOLED | 450×450分辨率 | 蓝牙连接 | IP68防水",
			description:
				"tmd竟然给我推送了安卓16，比我主力手机系统还新，几年前的设备了......",
			link: "https://www.samsung.com/",
		},
	],
	Sony: [
		{
			name: "WH-1000XM5",
			image: "/images/device/Sony_WH-1000XM5.png",
			specs: "双芯片降噪系统 | 8麦克风系统 | LDAC蓝牙 | 30小时续航",
			description: "降噪，无需多言。",
			link: "https://www.sony.com/",
		},
	],
	Insta360: [
		{
			name: "Insta360 GO Ultra",
			image: "/images/device/Insta360_GO_Ultra.png",
			specs: "1/1.28英寸传感器 | 5nm AI芯片 | 4K60fps视频 | 5000万像素",
			description: "拍到>拍得好，愿意带>拍的更清晰。",
			link: "https://www.insta360.com/",
		},
	],
	DJI: [
		{
			name: "DJI Mic Mini",
			image: "/images/device/DJI_Mic_Mini.png",
			specs: "10克发射器 | 全指向无线收音 | 48小时续航 | 充电盒",
			description: "买了没用，最后用来做英语听说。",
			link: "https://www.dji.com/",
		},
	],
	水月雨: [
		{
			name: "水月雨星野2",
			image: "/images/device/水月雨星野2.png",
			specs: "10mm动圈单元 | 3D打印树脂腔体 | 0.78双针接口",
			description: "Hifi多少不知道，反正效果薄纱小米999的tws，有线耳机的实力。",
			link: "https://moondrop.cn/",
		},
	],
};
