# PhotoMark Pro - Photo Watermarking Tool

<div align="left">
    <a href="README_ch.md">🇨🇳 中文版</a>
</div>

PhotoMark Pro is a browser-based photo watermarking tool that adds stylized watermarks to your photos, built entirely with HTML/JavaScript without requiring any backend support. It extracts EXIF information from various camera brands and generates Xiaomi-style watermarked photos.

## 📸 Features

- **Complete Browser-side Processing**: All operations are performed in the browser, no need to upload images to a server
- **Multi-brand Support**: Compatible with Canon, Nikon, Sony, Apple, Huawei, Xiaomi, DJI, and other camera brands
- **EXIF Data Extraction**: Automatically reads EXIF data from photos (camera model, aperture, shutter speed, ISO, etc.)
- **Custom Information**: Supports adding custom text, location information, etc.
- **Image Format Support**: Supports JPEG, PNG formats, as well as HEIC format from Apple devices
- **Lightweight Deployment**: No server required, can be deployed directly to GitHub Pages or other static website hosting services

## 🚀 Online Usage

Visit [watermarkphoto.org](https://watermarkphoto.org) to experience it online

## 💻 Local Usage

1. Clone the repository
   ```bash
   git clone https://github.com/huashengyou92/photo-marks.git
   ```

2. Open the `index.html` file directly, or serve it through an HTTP server
   ```bash
   # Using any HTTP server, for example:
   npx http-server -p 8000
   ```

3. Visit http://localhost:8000 in your browser

## 🔧 Technology Stack

- HTML5 / CSS3 / JavaScript
- [EXIF.js](https://github.com/exif-js/exif-js) - Extract photo EXIF information
- [dom-to-image](https://github.com/tsayen/dom-to-image) - Convert DOM elements to images
- [heic2any](https://github.com/alexcorvi/heic2any) - HEIC format image conversion

## 📱 Supported Camera Brands

- 📷 Canon
- 📷 Nikon
- 📷 Sony
- 📱 Apple
- 📱 Huawei
- 📱 Xiaomi
- 🚁 DJI
- 📷 Fujifilm
- 📷 Leica
- 📷 Olympus
- 📷 Panasonic
- 📷 Ricoh
- 📷 INSTA360

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
