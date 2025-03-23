# PhotoMark Pro - 照片水印工具

<div align="right">
    <a href="README.md">🇺🇸 English</a>
</div>

PhotoMark Pro 是一个浏览器端照片水印工具，可以为照片添加风格化水印，完全基于纯HTML/JavaScript实现，无需后端支持。支持从多种相机品牌中提取EXIF信息并生成小米风格的水印照片。

## 📸 功能特点

- **完全浏览器端处理**：所有操作在浏览器中完成，无需上传图片到服务器
- **多品牌支持**：支持佳能、尼康、索尼、苹果、华为、小米、大疆等多种相机品牌
- **EXIF数据提取**：自动读取照片中的EXIF数据（相机型号、光圈、快门速度、ISO等）
- **自定义信息**：支持添加自定义文字、位置信息等
- **图片格式支持**：支持JPEG、PNG格式，以及苹果设备的HEIC格式
- **轻量级部署**：无需服务器，可直接部署到GitHub Pages等静态网站托管服务



## 🚀 在线使用

访问 [watermarkphoto.org](https://watermarkphoto.org) 在线体验

## 💻 本地使用

1. 克隆仓库
   ```bash
   git clone https://github.com/huashengyou92/photo-marks.git
   ```

2. 直接打开`index.html`文件，或通过HTTP服务器提供服务
   ```bash
   # 使用任意HTTP服务器，例如：
   npx http-server -p 8000
   ```

3. 在浏览器中访问 http://localhost:8000

## 🔧 技术栈

- HTML5 / CSS3 / JavaScript
- [EXIF.js](https://github.com/exif-js/exif-js) - 提取照片EXIF信息
- [dom-to-image](https://github.com/tsayen/dom-to-image) - 将DOM元素转换为图像
- [heic2any](https://github.com/alexcorvi/heic2any) - HEIC格式图像转换

## 📱 支持的相机品牌

- 📷 佳能 (Canon)
- 📷 尼康 (Nikon)
- 📷 索尼 (Sony)
- 📱 苹果 (Apple)
- 📱 华为 (Huawei)
- 📱 小米 (Xiaomi)
- 🚁 大疆 (DJI)
- 📷 富士 (Fujifilm)
- 📷 莱卡 (Leica)
- 📷 奥林巴斯 (Olympus)
- 📷 松下 (Panasonic)
- 📷 理光 (Ricoh)
- 📷 INSTA360

## 📄 许可证

此项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件
