/**
 * PhotoMark Pro - 照片水印工具
 * 主要JavaScript文件
 */

// HEIC库加载逻辑
// 检测HEIC库是否已加载
function isHeicLibLoaded() {
    return typeof window.heic2any !== 'undefined';
  }
  
  // 加载HEIC库的函数
  function loadHeicLib() {
    // 标记正在加载
    window.heicLibLoading = true;
    
    // 尝试从不同CDN加载，按顺序尝试
    const sources = [
      'https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js',
      'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js'
    ];
    
    let currentIndex = 0;
    
    function tryNextSource() {
      if (currentIndex >= sources.length) {
        console.error('所有HEIC库来源均加载失败');
        window.heicLibLoading = false;
        return;
      }
      
      const script = document.createElement('script');
      script.src = sources[currentIndex];
      console.log('尝试加载HEIC库:', script.src);
      
      script.onload = function() {
        console.log('HEIC库加载成功:', script.src);
        window.heicLibLoading = false;
      };
      
      script.onerror = function() {
        console.log('HEIC库加载失败:', script.src);
        currentIndex++;
        tryNextSource();
      };
      
      document.head.appendChild(script);
    }
    
    tryNextSource();
  }
  
  // 页面加载后检查HEIC库
  window.addEventListener('DOMContentLoaded', function() {
    if (!isHeicLibLoaded()) {
      console.log('HEIC库未加载，开始加载...');
      loadHeicLib();
    }
  });
  
  // 常量定义
  const BrandsMap = {
    'Apple': 'apple',
    'Canon': 'canon',
    'Dji': 'dji',
    'Fujifilm': 'fujifilm',
    'Huawei': 'huawei',
    'Leica': 'leica',
    'Xiaomi': 'xiaomi',
    'Nikon Corporation': 'nikon corporation',
    'Sony': 'sony',
    'Panasonic': 'panasonic',
    'Ricoh': 'ricoh',
    'Olympus': 'olympus',
    'Arashi Vision': 'insta360',
    '未收录': 'unknow'
  };
  
  // 添加各品牌的默认信息配置
  const BrandDefaultInfo = {
    'Apple': {
      model: 'iPhone 15 Pro Max',
      date: formatDate(new Date()),
      gps: '40°45\'28"N 73°58\'56"W',
      device: '24mm f/1.8 1/125s ISO64'
    },
    'Canon': {
      model: 'Canon EOS R5',
      date: formatDate(new Date()),
      gps: '37°46\'30"N 122°25\'07"W',
      device: '70mm f/2.8 1/250s ISO400'
    },
    'Dji': {
      model: 'DJI Mavic 3 Pro',
      date: formatDate(new Date()),
      gps: '34°00\'28"N 118°28\'42"W',
      device: '24mm f/2.8 1/60s ISO100'
    },
    'Fujifilm': {
      model: 'FUJIFILM X-T5',
      date: formatDate(new Date()),
      gps: '35°39\'32"N 139°44\'31"E',
      device: '35mm f/1.4 1/500s ISO200'
    },
    'Huawei': {
      model: 'HUAWEI P60 Pro',
      date: formatDate(new Date()),
      gps: '22°32\'48"N 114°03\'36"E',
      device: '27mm f/1.4 1/100s ISO250'
    },
    'Leica': {
      model: 'Leica M11',
      date: formatDate(new Date()),
      gps: '48°51\'24"N 2°20\'55"E',
      device: '50mm f/2.0 1/500s ISO100'
    },
    'Xiaomi': {
      model: 'XIAOMI 14 Ultra',
      date: formatDate(new Date()),
      gps: '39°54\'26"N 116°23\'29"E',
      device: '23mm f/1.6 1/80s ISO320'
    },
    'Nikon Corporation': {
      model: 'Nikon Z9',
      date: formatDate(new Date()),
      gps: '43°39\'28"N 79°22\'59"W',
      device: '85mm f/1.8 1/200s ISO800'
    },
    'Sony': {
      model: 'SONY α7R V',
      date: formatDate(new Date()),
      gps: '51°30\'30"N 0°07\'32"W',
      device: '24-70mm f/2.8 1/160s ISO500'
    },
    'Panasonic': {
      model: 'Panasonic LUMIX S5 II',
      date: formatDate(new Date()),
      gps: '48°08\'24"N 11°34\'32"E',
      device: '35mm f/1.8 1/125s ISO400'
    },
    'Ricoh': {
      model: 'RICOH GR IIIx',
      date: formatDate(new Date()),
      gps: '35°40\'18"N 139°45\'5"E',
      device: '40mm f/2.8 1/60s ISO800'
    },
    'Olympus': {
      model: 'OM SYSTEM OM-1',
      date: formatDate(new Date()),
      gps: '34°59\'38"N 135°45\'9"E',
      device: '25mm f/1.2 1/250s ISO200'
    },
    'Arashi Vision': {
      model: 'Insta360 ONE X3',
      date: formatDate(new Date()),
      gps: '31°13\'52"N 121°28\'9"E',
      device: '6.7mm f/1.9 1/30s ISO100'
    },
    '未收录': {
      model: '未知型号',
      date: formatDate(new Date()),
      gps: '0°0\'0"N 0°0\'0"E',
      device: '未知参数'
    }
  };
  
  const BrandsList = Object.keys(BrandsMap);
  
  const DefaultPictureExif = BrandDefaultInfo['Leica']; // 使用Leica作为默认
  
  const ExhibitionImages = [
    './exhibition/apple.jpg',
    './exhibition/canon.jpg',
    './exhibition/dji.jpg',
    './exhibition/fujifilm.jpg',
    './exhibition/huawei.jpg',
    './exhibition/leica.jpg',
    './exhibition/xiaomi.jpg',
    './exhibition/nikon.jpg',
    './exhibition/sony.jpg',
    './exhibition/panasonic.jpg'
  ];
  
  // DOM 元素
  let previewPicture, infoModel, infoDate, infoBrandImg, infoDevice, infoGps;
  let imageUpload, randomImageBtn, downloadBtn, exifForm, brandSelect;
  let fontSizeInput, fontWeightInput, githubCornerDiv;
  let loadingIndicator, uploadBtn;
  
  // 当前状态
  let currentFormValues = { ...DefaultPictureExif };
  
  // 初始化DOM元素引用
  function initDomElements() {
    // 上传图片元素
    imageUpload = document.getElementById('image-upload');
    randomImageBtn = document.getElementById('random-image');
    
    // 预览元素
    previewPicture = document.getElementById('preview-picture');
    loadingIndicator = document.getElementById('loading-indicator');
    
    // 信息显示元素
    infoModel = document.getElementById('info-model');
    infoDevice = document.getElementById('info-device');
    infoDate = document.getElementById('info-date');
    infoGps = document.getElementById('info-gps');
    infoBrandImg = document.getElementById('info-brand-img');
    
    // 表单元素
    exifForm = document.getElementById('exif-form');
    fontSizeInput = document.getElementById('font-size');
    fontWeightInput = document.getElementById('font-weight');
    brandSelect = document.getElementById('brand');
    
    // 下载按钮
    downloadBtn = document.getElementById('download-btn');
    
    // 上传按钮
    uploadBtn = document.getElementById('upload-btn');
    
    // GitHub 角落
    githubCornerDiv = document.getElementById('github-corner');
  }
  
  // 初始化函数
  function init() {
    console.log('初始化应用...');
    
    // 初始化DOM元素引用
    initDomElements();
    
    // 检查DOM元素是否正确获取
    if (!previewPicture || !brandSelect) {
      console.error('DOM元素未找到，请检查HTML结构');
      return;
    }
    
    // 预加载展示图片
    preloadExhibitionImages();
    
    // 初始化品牌下拉列表
    initBrandSelect();
    
    // 初始化GitHub角落
    initGithubCorner();
    
    // 加载随机图片
    loadRandomImage();
    
    // 绑定事件监听器
    bindEventListeners();
  }
  
  // 预加载展示图片
  function preloadExhibitionImages() {
    console.log('预加载展示图片...');
    ExhibitionImages.forEach(imgUrl => {
      const img = new Image();
      img.src = imgUrl;
    });
  }
  
  // 初始化品牌下拉列表
  function initBrandSelect() {
    console.log('初始化品牌下拉列表...');
    
    // 确保brandSelect元素已获取
    if (!brandSelect) {
      console.error('brandSelect元素未找到');
      return;
    }
    
    // 清空现有选项
    brandSelect.innerHTML = '';
    
    // 添加品牌选项
    BrandsList.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
    
    console.log(`已添加${BrandsList.length}个品牌选项`);
  }
  
  // 初始化GitHub角落
  function initGithubCorner() {
    githubCornerDiv.innerHTML = `
      <a href="https://github.com/huashengyou92/photo-marks" class="github-corner" target="_blank" rel="noopener">
        <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
        </svg>
      </a>
    `;
  }
  
  // 绑定事件监听器
  function bindEventListeners() {
    // 文件上传按钮事件
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
    
    // 随机图片按钮事件
    document.getElementById('random-image').addEventListener('click', loadRandomImage);
    
    // 表单变更事件
    document.getElementById('exif-form').addEventListener('change', handleFormChange);
    
    // 字体大小变更事件
    document.getElementById('font-size').addEventListener('change', handleFontSizeChange);
    document.getElementById('font-size').addEventListener('input', handleFontSizeChange);
    
    // 字体粗细变更事件
    document.getElementById('font-weight').addEventListener('change', handleFontWeightChange);
    document.getElementById('font-weight').addEventListener('input', handleFontWeightChange);
    
    // 下载按钮事件
    document.getElementById('download-btn').addEventListener('click', handleDownload);
    
    // 上传按钮事件 - 点击触发文件选择器
    document.getElementById('upload-btn').addEventListener('click', function() {
      document.getElementById('image-upload').click();
    });
  }
  
  // 加载随机图片
  function loadRandomImage() {
    const randomIndex = Math.floor(Math.random() * ExhibitionImages.length);
    const randomImageUrl = ExhibitionImages[randomIndex];
    
    console.log('加载随机图片:', randomImageUrl);
    
    // 显示加载状态
    previewPicture.classList.remove('loaded');
    previewPicture.classList.add('loading');
    
    // 创建一个新的Image对象来预加载图片
    const img = new Image();
    
    img.onload = function() {
      console.log('随机图片加载成功');
      // 图片加载完成后，设置到预览区域
      previewPicture.src = randomImageUrl;
      previewPicture.classList.remove('loading');
      previewPicture.classList.add('loaded');
      
      // 设置默认表单值（这里可以根据实际情况修改）
      const defaultValues = { ...DefaultPictureExif };
      updateFormValues(defaultValues);
      updatePreview();
    };
    
    img.onerror = function() {
      console.error('随机图片加载失败:', randomImageUrl);
      // 显示错误信息给用户
      alert('无法加载示例图片，请尝试上传您自己的图片');
      
      // 尝试使用默认图片
      previewPicture.src = 'public/simple.jpg';
      previewPicture.classList.remove('loading');
      previewPicture.classList.add('loaded');
      
      // 使用默认值
      updateFormValues(DefaultPictureExif);
      updatePreview();
    };
    
    // 开始加载图片
    img.src = randomImageUrl;
  }
  
  // 处理图片上传
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 立即显示加载状态
    previewPicture.classList.remove('loaded');
    previewPicture.classList.add('loading');
    
    // 获取加载指示器
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'flex';
    
    // 检查文件类型
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
    
    // 更可靠的文件类型检测 - 同时检查MIME类型和文件扩展名
    let isHeic = false;
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      isHeic = true;
    } else if (file.type === '' || file.type === 'application/octet-stream') {
      // 当浏览器无法识别MIME类型时，检查文件扩展名
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
        isHeic = true;
      }
    }
    
    // 对于非接受的文件类型，显示错误
    if (!isHeic && !acceptedTypes.includes(file.type)) {
      alert('请上传JPG、JPEG、PNG或HEIC格式的图片\nEXIF数据可从JPG/JPEG和HEIC格式读取');
      previewPicture.classList.remove('loading');
      loadingIndicator.style.display = 'none';
      return;
    }
    
    // 提前显示文件类型警告
    if (file.type === 'image/png') {
      console.log('PNG图片不包含EXIF数据，将使用默认值');
    }
    
    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件过大，请上传小于10MB的图片');
      previewPicture.classList.remove('loading');
      loadingIndicator.style.display = 'none';
      return;
    }
    
    // 处理HEIC/HEIF格式
    if (isHeic) {
      console.log('检测到HEIC/HEIF格式图片');
      loadingIndicator.textContent = '检测到HEIC图片...';
      
      // 检查HEIC库是否已加载
      if (!isHeicLibLoaded()) {
        if (window.heicLibLoading) {
          // 如果库正在加载中，等待加载完成
          loadingIndicator.textContent = 'HEIC转换库正在加载，请稍候...';
          let checkCount = 0;
          const maxChecks = 20; // 最多等待10秒
          
          const checkInterval = setInterval(function() {
            if (isHeicLibLoaded()) {
              clearInterval(checkInterval);
              console.log('HEIC库已加载完成，开始转换...');
              loadingIndicator.textContent = 'HEIC库加载完成，开始转换...';
              processHeicFile(file, loadingIndicator);
            } else if (checkCount >= maxChecks || !window.heicLibLoading) {
              clearInterval(checkInterval);
              console.error('HEIC库加载超时或失败');
              loadingIndicator.textContent = 'HEIC库加载失败';
              alert('HEIC转换库加载失败，请使用JPG格式图片或先将HEIC转换为JPG格式');
              previewPicture.classList.remove('loading');
              loadingIndicator.style.display = 'none';
            }
            checkCount++;
          }, 500);
        } else {
          // 尝试加载HEIC库
          loadingIndicator.textContent = '加载HEIC转换库...';
          loadHeicLib();
          
          setTimeout(function() {
            if (isHeicLibLoaded()) {
              processHeicFile(file, loadingIndicator);
            } else {
              console.error('HEIC库加载失败');
              loadingIndicator.textContent = 'HEIC库加载失败';
              alert('无法加载HEIC转换库，请使用JPG格式图片或先将HEIC转换为JPG格式\n推荐使用在线转换工具或应用进行预处理');
              previewPicture.classList.remove('loading');
              loadingIndicator.style.display = 'none';
            }
          }, 3000);
        }
      } else {
        // HEIC库已加载，直接处理
        processHeicFile(file, loadingIndicator);
      }
    } else {
      // 直接处理JPG/JPEG/PNG文件
      loadingIndicator.style.display = 'none';
      processImageFile(file);
    }
  }
  
  // 处理HEIC文件的函数
  function processHeicFile(file, loadingIndicator) {
    loadingIndicator.textContent = 'HEIC图片转换中...';
    console.log('开始转换HEIC图片...');
    
    try {
      // 首先尝试从原始HEIC文件解析EXIF数据
      parseExifFromImage(file)
        .then(exifDataFromHeic => {
          console.log('从HEIC文件提取的EXIF数据:', exifDataFromHeic);
          
          // 然后开始转换HEIC为JPEG
          loadingIndicator.textContent = '提取EXIF完成，正在转换格式...';
          
          heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          })
          .then(convertedBlob => {
            console.log('HEIC转换成功，大小: ' + convertedBlob.size);
            loadingIndicator.textContent = 'HEIC转换成功!';
            
            // 为转换后的Blob对象创建一个新的File对象
            const convertedFile = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
              type: 'image/jpeg',
              lastModified: new Date().getTime()
            });
            
            // 重要：标记此文件为已转换HEIC，以便在processImageFile中处理
            convertedFile._convertedFromHeic = true;
            convertedFile._heicExifData = exifDataFromHeic;
            
            // 使用转换后的JPEG文件进行处理
            processImageFile(convertedFile);
            
            // 隐藏加载指示器
            setTimeout(() => {
              loadingIndicator.style.display = 'none';
            }, 1000);
          })
          .catch(err => {
            console.error('HEIC转换失败:', err);
            loadingIndicator.textContent = 'HEIC转换失败';
            alert('HEIC图片转换失败: ' + (err.message || '未知错误') + '\n请尝试将HEIC图片转换为JPG格式后再上传');
            previewPicture.classList.remove('loading');
            loadingIndicator.style.display = 'none';
          });
        })
        .catch(error => {
          console.error('从HEIC解析EXIF数据失败，继续转换流程:', error);
          loadingIndicator.textContent = 'EXIF提取失败，尝试直接转换...';
          
          // 仍然尝试转换HEIC为JPEG
          heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          })
          .then(convertedBlob => {
            console.log('HEIC转换成功，大小: ' + convertedBlob.size);
            loadingIndicator.textContent = 'HEIC转换成功!';
            
            // 为转换后的Blob对象创建一个新的File对象
            const convertedFile = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
              type: 'image/jpeg',
              lastModified: new Date().getTime()
            });
            
            // 使用转换后的JPEG文件进行处理
            processImageFile(convertedFile);
            
            // 隐藏加载指示器
            setTimeout(() => {
              loadingIndicator.style.display = 'none';
            }, 1000);
          })
          .catch(err => {
            console.error('HEIC转换失败:', err);
            loadingIndicator.textContent = 'HEIC转换失败';
            alert('HEIC图片转换失败: ' + (err.message || '未知错误') + '\n请尝试将HEIC图片转换为JPG格式后再上传');
            previewPicture.classList.remove('loading');
            loadingIndicator.style.display = 'none';
          });
        });
    } catch (error) {
      console.error('HEIC库调用失败:', error);
      loadingIndicator.textContent = 'HEIC转换出错';
      alert('HEIC转换过程中出错，请使用其他格式或先将HEIC转换为JPG后上传');
      previewPicture.classList.remove('loading');
      loadingIndicator.style.display = 'none';
    }
  }
  
  // 处理图片文件（提取共用逻辑）
  function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgUrl = e.target.result;
      
      // 创建一个新的Image对象来预加载图片
      const img = new Image();
      img.onload = function() {
        // 图片加载完成后，设置到预览区域
        previewPicture.src = imgUrl;
        previewPicture.classList.remove('loading');
        previewPicture.classList.add('loaded');
        
        // 首先使用默认值，以防解析失败
        updateFormValues(DefaultPictureExif);
        
        // 检查是否是从HEIC转换的文件且已有EXIF数据
        if (file._convertedFromHeic && file._heicExifData) {
          console.log('使用从HEIC文件提取的EXIF数据');
          const exifData = file._heicExifData;
          // 检查解析出的EXIF数据是否有效
          const hasValidData = exifData.brand || exifData.model || 
                             exifData.date !== formatDate(new Date()) || 
                             exifData.device || exifData.gps;
          
          if (hasValidData) {
            updateFormValues(exifData);
            updatePreview();
          } else {
            console.warn('从HEIC提取的EXIF数据无效，使用默认值');
          }
        }
        // 对于JPG/JPEG和无已提取EXIF的转换文件，解析EXIF数据
        else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          console.log('开始从JPG/JPEG图片解析EXIF数据...');
          
          parseExifFromImage(file)
            .then(exifData => {
              console.log('成功解析EXIF数据:', exifData);
              // 检查解析出的EXIF数据是否有效
              const hasValidData = exifData.brand || exifData.model || 
                                 exifData.date !== formatDate(new Date()) || 
                                 exifData.device || exifData.gps;
              
              if (hasValidData) {
                updateFormValues(exifData);
                updatePreview();
              } else {
                console.warn('解析的EXIF数据无效，使用默认值');
              }
            })
            .catch(error => {
              console.error('解析EXIF数据失败:', error);
            });
        } else {
          // 对于PNG格式，直接使用默认值
          console.log('非JPG格式，使用默认值');
        }
        
        // 始终更新预览
        updatePreview();
      };
      
      img.onerror = function() {
        console.error('加载上传图片失败');
        previewPicture.classList.remove('loading');
        alert('图片加载失败，请尝试其他图片');
        // 如果解析失败，使用默认值
        updateFormValues(DefaultPictureExif);
        updatePreview();
      };
      
      // 开始加载图片
      img.src = imgUrl;
    };
    
    reader.onerror = function() {
      console.error('读取文件失败');
      previewPicture.classList.remove('loading');
      alert('读取图片文件失败，请重试');
    };
    
    reader.readAsDataURL(file);
  }
  
  // 解析图片EXIF数据的函数
  function parseExifFromImage(file) {
    return new Promise((resolve, reject) => {
      try {
        console.log('开始解析EXIF数据，文件类型:', file.type);
        
        // 确保EXIF.js库已加载
        if (typeof EXIF === 'undefined') {
          console.error('EXIF库未加载');
          return reject('EXIF库未加载');
        }
        
        // 初始化默认数据对象
        const exifData = {
          brand: '',
          model: '',
          date: formatDate(new Date()),
          device: '',
          gps: ''
        };
        
        // 处理HEIC文件类型 - 使用ArrayBuffer方式
        if (file.type === 'image/heic' || file.type === 'image/heif') {
          const reader = new FileReader();
          reader.onload = function(e) {
            try {
              const arrayBuffer = e.target.result;
              // 使用EXIF.js解析二进制数据
              let tags = EXIF.readFromBinaryFile(arrayBuffer);
              
              // 输出完整的HEIC标签，用于调试
              console.log('========== HEIC原始EXIF数据开始 ==========');
              console.log('文件名称:', file.name);
              console.log('文件大小:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
              
              // 打印所有标签，特别关注包含型号信息的可能字段
              for (let key in tags) {
                const value = tags[key];
                console.log(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
                
                // 检查对象类型的标签，可能包含型号信息
                if (typeof value === 'object' && value !== null) {
                  for (let subKey in value) {
                    if (typeof value[subKey] === 'string' && 
                        (subKey.toLowerCase().includes('model') || 
                         value[subKey].toLowerCase().includes('iphone') ||
                         value[subKey].toLowerCase().includes('canon') ||
                         value[subKey].toLowerCase().includes('nikon') ||
                         value[subKey].toLowerCase().includes('sony'))) {
                      console.log(`发现潜在型号信息 - ${key}.${subKey}: ${value[subKey]}`);
                    }
                  }
                }
              }
              console.log('========== HEIC原始EXIF数据结束 ==========');
  
              // 特殊处理HEIC文件的相机型号 - 扩展检测逻辑
              if (!tags.Model) {
                console.log('未找到标准Model字段，尝试从其他字段提取...');
                
                // 尝试从备用字段获取型号信息
                if (tags.CanonModelID) {
                  tags.Model = "Canon " + tags.CanonModelID;
                } else if (tags.CanonModelName) {
                  tags.Model = tags.CanonModelName;
                } else if (tags.SonyModelID) {
                  tags.Model = "Sony " + tags.SonyModelID;
                } else if (tags.NikonModelID) {
                  tags.Model = "Nikon " + tags.NikonModelID;
                } else if (tags.FujiModelID) {
                  tags.Model = "Fujifilm " + tags.FujiModelID;
                } else if (tags.Apple && tags.Apple.length > 0) {
                  // 对于iPhone照片，尝试提取型号
                  tags.Model = "iPhone";
                  // 尝试查找完整型号信息
                  for (let i = 0; i < tags.Apple.length; i++) {
                    if (tags.Apple[i] && typeof tags.Apple[i] === 'string' && 
                        (tags.Apple[i].includes('iPhone') || tags.Apple[i].includes('iPad'))) {
                      tags.Model = tags.Apple[i];
                      break;
                    }
                  }
                } 
                // 尝试在标签中搜索任何可能包含型号信息的字段
                else {
                  // 查找任何包含"model"的键
                  const modelKeys = Object.keys(tags).filter(key => 
                    key.toLowerCase().includes('model') || 
                    (key.toLowerCase().includes('description') && tags[key])
                  );
                  
                  if (modelKeys.length > 0) {
                    console.log('发现可能的型号信息字段:', modelKeys);
                    // 使用第一个找到的字段
                    for (const key of modelKeys) {
                      if (tags[key] && typeof tags[key] === 'string') {
                        tags.Model = tags[key];
                        console.log('使用替代字段作为型号:', key, tags.Model);
                        break;
                      }
                    }
                  }
                }
                
                // 如果以上都失败，使用品牌信息
                if (!tags.Model && tags.Make) {
                  // 如果只有品牌没有型号，尝试从其他数据推断
                  const makeUpper = tags.Make.toUpperCase();
                  if (makeUpper.includes('APPLE')) {
                    // 特殊处理苹果设备
                    if (tags.ImageDescription && typeof tags.ImageDescription === 'string') {
                      if (tags.ImageDescription.includes('iPhone')) {
                        const match = tags.ImageDescription.match(/(iPhone\s*\d+\S*)/i);
                        if (match) {
                          tags.Model = match[1];
                        } else {
                          tags.Model = 'iPhone';
                        }
                      } else {
                        tags.Model = 'iPhone';
                      }
                    } else {
                      tags.Model = 'iPhone';
                    }
                  } else if (makeUpper.includes('SAMSUNG')) {
                    tags.Model = 'Galaxy'; // 默认Samsung为Galaxy系列
                  } else if (makeUpper.includes('HUAWEI')) {
                    tags.Model = 'Huawei Phone';
                  } else if (makeUpper.includes('XIAOMI')) {
                    tags.Model = 'Xiaomi Phone';
                  } else {
                    // 尝试使用相机对应的默认型号
                    if (makeUpper.includes('CANON')) {
                      tags.Model = 'EOS'; // Canon常见系列
                    } else if (makeUpper.includes('NIKON')) {
                      tags.Model = 'Nikon Camera';
                    } else if (makeUpper.includes('SONY')) {
                      tags.Model = 'Alpha'; // Sony常见系列
                    } else if (makeUpper.includes('FUJI') || makeUpper.includes('FUJIFILM')) {
                      tags.Model = 'X Series'; // Fuji常见系列
                    } else if (makeUpper.includes('OLYMPUS')) {
                      tags.Model = 'OM-D'; // Olympus常见系列
                    } else {
                      tags.Model = tags.Make + ' Camera'; // 通用后备选项
                    }
                  }
                  console.log('基于品牌推断的型号:', tags.Model);
                }
              }
              
              // 确保品牌和型号都有值
              if (tags.Model && !tags.Make) {
                // 如果只有型号没有品牌，尝试从型号提取品牌
                if (tags.Model.includes('iPhone') || tags.Model.includes('iPad')) {
                  tags.Make = 'Apple';
                } else if (tags.Model.includes('Galaxy')) {
                  tags.Make = 'Samsung';
                } else if (tags.Model.toLowerCase().includes('canon')) {
                  tags.Make = 'Canon';
                } else if (tags.Model.toLowerCase().includes('nikon')) {
                  tags.Make = 'Nikon';
                } else if (tags.Model.toLowerCase().includes('sony')) {
                  tags.Make = 'Sony';
                }
              }
              
              console.log('最终提取的品牌和型号:', tags.Make, tags.Model);
              processExifTags(tags, exifData, resolve);
            } catch (err) {
              console.error('HEIC EXIF解析错误:', err);
              resolve(exifData); // 返回默认数据
            }
          };
          reader.onerror = function() {
            console.error('读取HEIC文件失败');
            resolve(exifData); // 返回默认数据
          };
          reader.readAsArrayBuffer(file);
        } 
        // 处理JPG文件类型 - 使用标准的EXIF.getData方法
        else {
          // 创建一个URL以加载图像
          const url = URL.createObjectURL(file);
          const img = new Image();
          
          img.onload = function() {
            try {
              EXIF.getData(img, function() {
                console.log('JPG原始EXIF数据:', this.exifdata);
                const tags = this.exifdata;
                processExifTags(tags, exifData, resolve);
                
                // 添加更多调试信息
                if (Object.keys(tags).length === 0) {
                  console.warn('JPG图片没有EXIF数据 - 图片可能已被处理或来自不写入元数据的应用');
                }
              });
            } catch (err) {
              console.error('JPG EXIF解析错误:', err);
              resolve(exifData); // 返回默认数据
            } finally {
              // 清理URL对象
              URL.revokeObjectURL(url);
            }
          };
          
          img.onerror = function() {
            console.error('加载JPG图片失败');
            URL.revokeObjectURL(url);
            resolve(exifData); // 返回默认数据
          };
          
          img.src = url;
        }
        
      } catch (error) {
        console.error('解析EXIF过程中出错:', error);
        reject(error);
      }
    });
  }
  
  // 处理EXIF标签 - 提取为单独函数以避免代码重复
  function processExifTags(tags, exifData, resolve) {
    if (!tags || Object.keys(tags).length === 0) {
      console.warn('未找到EXIF数据或EXIF数据为空');
      return resolve(exifData); // 返回默认数据
    }
    
    // 提取品牌和型号信息
    if (tags.Make) {
      exifData.brand = tags.Make.trim();
      console.log('相机品牌:', exifData.brand);
    }
    
    if (tags.Model) {
      // 移除型号中可能包含的品牌名称，避免重复
      let modelStr = tags.Model.trim();
      if (exifData.brand && modelStr.startsWith(exifData.brand)) {
        modelStr = modelStr.substring(exifData.brand.length).trim();
      }
      
      exifData.model = modelStr;
      console.log('相机型号:', exifData.model);
    }
    
    // 提取设备信息 (组合光圈、快门速度和ISO)
    let deviceInfo = [];
    
    // 光圈值
    if (tags.FNumber) {
      let fNumber;
      if (typeof tags.FNumber === 'number') {
        fNumber = tags.FNumber;
      } else if (tags.FNumber && tags.FNumber.numerator && tags.FNumber.denominator) {
        fNumber = tags.FNumber.numerator / tags.FNumber.denominator;
      }
      
      if (fNumber) {
        deviceInfo.push('f/' + fNumber.toFixed(1));
      }
    }
    
    // 快门速度
    if (tags.ExposureTime) {
      let exposureTime;
      if (typeof tags.ExposureTime === 'number') {
        exposureTime = tags.ExposureTime;
      } else if (tags.ExposureTime && tags.ExposureTime.numerator && tags.ExposureTime.denominator) {
        exposureTime = tags.ExposureTime.numerator / tags.ExposureTime.denominator;
      }
      
      if (exposureTime) {
        // 格式化快门速度为分数形式 (如1/125)
        if (exposureTime < 1) {
          const denominator = Math.round(1 / exposureTime);
          deviceInfo.push('1/' + denominator + 's');
        } else {
          deviceInfo.push(exposureTime.toFixed(1) + 's');
        }
      }
    }
    
    // ISO值
    if (tags.ISOSpeedRatings) {
      deviceInfo.push('ISO' + tags.ISOSpeedRatings);
    }
    
    exifData.device = deviceInfo.join(' ');
    console.log('设备信息:', exifData.device);
    
    // 提取日期信息
    if (tags.DateTimeOriginal) {
      const dateParts = tags.DateTimeOriginal.split(' ');
      if (dateParts.length >= 1) {
        const dateStr = dateParts[0].replace(/:/g, '-');
        exifData.date = dateStr;
        console.log('拍摄日期:', exifData.date);
      }
    }
    
    // 提取GPS信息
    if (tags.GPSLatitude && tags.GPSLongitude && 
        tags.GPSLatitudeRef && tags.GPSLongitudeRef) {
      
      function convertDMSToDD(degrees, minutes, seconds, direction) {
        let dd = degrees + minutes/60 + seconds/3600;
        if (direction === 'S' || direction === 'W') {
          dd = dd * -1;
        }
        return dd;
      }
      
      // 解析纬度
      const latDegrees = tags.GPSLatitude[0];
      const latMinutes = tags.GPSLatitude[1];
      const latSeconds = tags.GPSLatitude[2];
      const latDirection = tags.GPSLatitudeRef;
      
      // 解析经度
      const lonDegrees = tags.GPSLongitude[0];
      const lonMinutes = tags.GPSLongitude[1];
      const lonSeconds = tags.GPSLongitude[2];
      const lonDirection = tags.GPSLongitudeRef;
      
      const latitude = convertDMSToDD(latDegrees, latMinutes, latSeconds, latDirection);
      const longitude = convertDMSToDD(lonDegrees, lonMinutes, lonSeconds, lonDirection);
      
      exifData.gps = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      console.log('GPS坐标:', exifData.gps);
    }
    
    resolve(exifData);
  }
  
  // 格式化日期函数
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // 更新表单值
  function updateFormValues(values) {
    console.log('更新表单值:', values);
    
    // 更新当前表单值
    currentFormValues = { ...currentFormValues, ...values };
    
    // 更新表单输入
    document.getElementById('model').value = currentFormValues.model || '';
    document.getElementById('device').value = currentFormValues.device || '';
    document.getElementById('date').value = currentFormValues.date || '';
    document.getElementById('gps').value = currentFormValues.gps || '';
    
    // 更新品牌选择器
    const brandSelect = document.getElementById('brand');
    if (brandSelect) {
      // 在设置前检查品牌是否在列表中
      const brandValue = currentFormValues.brand || '未收录';
      
      // 找到对应的选项并设置
      let found = false;
      for (let i = 0; i < brandSelect.options.length; i++) {
        if (brandSelect.options[i].value === brandValue) {
          brandSelect.selectedIndex = i;
          found = true;
          break;
        }
      }
      
      // 如果没找到匹配的选项，默认选择"未收录"
      if (!found) {
        console.log(`品牌'${brandValue}'未在列表中找到，使用默认值`);
        for (let i = 0; i < brandSelect.options.length; i++) {
          if (brandSelect.options[i].value === '未收录') {
            brandSelect.selectedIndex = i;
            currentFormValues.brand = '未收录';
            break;
          }
        }
      }
    } else {
      console.error('品牌选择器元素未找到');
    }
  }
  
  // 处理表单变更
  function handleFormChange(event) {
    const { name, value } = event.target;
    console.log(`表单变更: ${name} = ${value}`);
    
    // 更新当前值
    currentFormValues[name] = value;
    
    // 如果是品牌发生变化，自动更新其他信息
    if (name === 'brand' && BrandDefaultInfo[value]) {
      console.log(`品牌变更为: ${value}，正在更新相关信息`);
      
      // 获取所选品牌的默认信息
      const brandDefaults = BrandDefaultInfo[value];
      
      // 更新表单和当前值
      document.getElementById('model').value = brandDefaults.model;
      document.getElementById('device').value = brandDefaults.device;
      document.getElementById('date').value = brandDefaults.date;
      document.getElementById('gps').value = brandDefaults.gps;
      
      // 同步更新当前表单值对象
      currentFormValues = {
        ...currentFormValues,
        model: brandDefaults.model,
        device: brandDefaults.device,
        date: brandDefaults.date,
        gps: brandDefaults.gps
      };
      
      console.log('更新后的表单值:', currentFormValues);
    }
    
    // 更新预览
    updatePreview();
  }
  
  // 处理字体大小变更
  function handleFontSizeChange(event) {
    const value = event.target.value;
    document.documentElement.style.setProperty('--current-font-size', value / 16);
  }
  
  // 处理字体粗细变更
  function handleFontWeightChange(event) {
    const value = event.target.value;
    document.documentElement.style.setProperty('--current-font-weight', value);
  }
  
  // 获取品牌图标URL
  function getBrandUrl(brand) {
    console.log('获取品牌图标:', brand);
    
    // 如果品牌为空，返回未知图标
    if (!brand) {
      console.warn('品牌为空，使用默认图标');
      return './brand/unknow.svg';
    }
    
    // 从BrandsMap获取文件名
    const fileName = BrandsMap[brand] || 'unknow';
    const url = `./brand/${fileName}.svg`;
    
    console.log('图标URL:', url);
    return url;
  }
  
  // 更新预览
  function updatePreview() {
    // 更新文本内容
    infoModel.textContent = currentFormValues.model || '';
    infoDate.textContent = currentFormValues.date || '';
    infoDevice.textContent = currentFormValues.device || '';
    infoGps.textContent = currentFormValues.gps || '';
    
    // 获取品牌图标URL
    const brandUrl = getBrandUrl(currentFormValues.brand);
    
    // 设置品牌图标
    if (brandUrl) {
      infoBrandImg.style.display = 'block';
      infoBrandImg.src = brandUrl;
      
      // 添加图片加载错误处理
      infoBrandImg.onerror = function() {
        console.error('品牌图标加载失败:', brandUrl);
        // 使用默认图标
        infoBrandImg.src = './brand/unknow.svg';
        
        // 二次错误处理 - 如果默认图标也加载失败
        infoBrandImg.onerror = function() {
          console.error('默认图标也加载失败');
          infoBrandImg.style.display = 'none'; // 隐藏图片
        };
      };
    } else {
      // 如果没有品牌URL，隐藏图片
      infoBrandImg.style.display = 'none';
    }
  }
  
  // 处理下载
  function handleDownload() {
    const preview = document.getElementById('preview');
    
    console.log('开始下载图片...');
    
    if (typeof domtoimage === 'undefined') {
      console.error('找不到dom-to-image库，请确保已正确加载');
      alert('下载功能暂时不可用，请检查控制台错误');
      return;
    }
    
    console.log('dom-to-image库已加载，准备生成图片');
    
    // 尝试添加一个简单的导出方式 - 使用toPng而不是toBlob
    try {
      // 备用方式1: 使用toPng
      domtoimage.toPng(preview, {
        quality: 0.95,
        bgcolor: '#fff',
        scale: 2
      })
      .then(function(dataUrl) {
        console.log('图片生成成功(toPng)，准备下载');
        const link = document.createElement('a');
        link.download = `${currentFormValues.model}-${currentFormValues.date.replace(/[\s:]/g, '-')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(function(error) {
        console.error('toPng生成失败，尝试toBlob:', error);
        
        // 备用方式2: 使用原始方式
        domtoimage.toBlob(preview, {
          quality: 0.95,
          bgcolor: '#fff',
          scale: 2,
          imagePlaceholder: undefined,
          cacheBust: true
        })
        .then(function(blob) {
          console.log('图片生成成功(toBlob)，准备下载');
          const link = document.createElement('a');
          link.download = `${currentFormValues.model}-${currentFormValues.date.replace(/[\s:]/g, '-')}.png`;
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(function(error) {
          console.error('所有下载方式都失败:', error);
          alert('生成图片失败，请检查控制台错误');
        });
      });
    } catch (e) {
      console.error('下载功能执行出错:', e);
      alert('下载功能执行出错，请检查控制台错误');
    }
  }
  
  // 加载图片函数
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
  
  // 初始化应用
  document.addEventListener('DOMContentLoaded', init);