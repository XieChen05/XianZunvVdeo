// API配置
const API_CONFIG = {
    baseUrl: 'https://api.yaohud.cn/api/v5/yingshi',
    key: 'scKVWZehRm18uT4IFwD',
    defaultN: '',      // n默认为空
    defaultType: ''    // type默认为空
};

// DOM元素
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const resultsContainer = document.getElementById('results');
const detailPage = document.getElementById('detailPage');
const backBtn = document.getElementById('backBtn');
const videoPlayer = document.getElementById('videoPlayer');
const playerContainer = document.getElementById('playerContainer');
const episodesList = document.getElementById('episodesList');

// 当前播放状态
let currentMovieData = null;
let currentSearchKeyword = ''; // 保存当前搜索关键词
let hls = null; // HLS播放器实例

// 搜索功能
async function searchMovie(keyword) {
    if (!keyword || keyword.trim() === '') {
        showMessage('请输入搜索关键词', 'error');
        return;
    }

    // 显示加载状态
    showLoading(true);
    clearResults();

    try {
        // 构建API URL
        const url = `${API_CONFIG.baseUrl}?key=${API_CONFIG.key}&msg=${encodeURIComponent(keyword)}&n=${API_CONFIG.defaultN}&type=${API_CONFIG.defaultType}`;
        
        console.log('正在请求搜索URL:', url);
        
        // 发起请求
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('搜索返回数据:', data);

        // 隐藏加载状态
        showLoading(false);

        // 处理响应数据
        if (data.code === 200 && data.data && data.data.list && data.data.list.length > 0) {
            currentSearchKeyword = keyword; // 保存搜索关键词
            displayResults(data.data.list);
        } else {
            showMessage('没有找到相关影视作品，请尝试其他关键词', 'no-results');
        }
    } catch (error) {
        showLoading(false);
        console.error('搜索错误:', error);
        showMessage(`搜索失败: ${error.message}`, 'error');
    }
}

// 显示搜索结果
function displayResults(list) {
    resultsContainer.innerHTML = '';
    
    list.forEach(item => {
        const card = createMovieCard(item);
        resultsContainer.appendChild(card);
    });
}

// 创建影视卡片
function createMovieCard(item) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // 处理图片加载失败
    const imgElement = document.createElement('img');
    imgElement.className = 'card-image';
    imgElement.src = item.pic;
    imgElement.alt = item.name;
    imgElement.onerror = function() {
        this.src = 'https://via.placeholder.com/280x400?text=' + encodeURIComponent(item.name);
    };
    
    card.innerHTML = `
        <div class="card-image-wrapper">
            ${imgElement.outerHTML}
        </div>
        <div class="card-content">
            <h3 class="card-title">${item.name}</h3>
            ${item.subtitle ? `<p class="card-subtitle">${item.subtitle}</p>` : ''}
            
            <div class="card-meta">
                ${item.remarks ? `<span class="tag">${item.remarks}</span>` : ''}
                ${item.year ? `<span class="tag">${item.year}</span>` : ''}
            </div>
            
            <div class="card-info">
                ${item.area ? `<div>📍 地区: ${item.area}</div>` : ''}
                ${item.type ? `<div>🎭 类型: ${item.type}</div>` : ''}
                ${item.director ? `<div>🎬 导演: ${item.director}</div>` : ''}
                ${item.actor ? `<div>👥 主演: ${item.actor}</div>` : ''}
                ${item.total_episodes ? `<div>📺 集数: ${item.total_episodes}集</div>` : ''}
                ${item.update_time ? `<div>⏰ 更新: ${item.update_time}</div>` : ''}
            </div>
            
            ${item.blurb || item.content ? `
                <div class="card-desc">
                    ${item.blurb || item.content}
                </div>
            ` : ''}
        </div>
    `;
    
    // 添加点击事件，查看详情
    card.addEventListener('click', () => {
        loadMovieDetail(item.n); // 使用n参数（序号）而不是id
    });
    
    return card;
}

// 加载影视详情（使用n参数）
async function loadMovieDetail(n) {
    showLoading(true);
    
    try {
        // 使用msg（搜索关键词）+ n（序号）获取详细信息
        const url = `${API_CONFIG.baseUrl}?key=${API_CONFIG.key}&msg=${encodeURIComponent(currentSearchKeyword)}&n=${n}&type=${API_CONFIG.defaultType}`;
        
        console.log('正在请求详情URL:', url);
        console.log('搜索关键词:', currentSearchKeyword, '序号:', n);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API返回数据:', data);

        showLoading(false);

        if (data.code === 200 && data.data) {
            currentMovieData = data.data;
            displayMovieDetail(data.data);
        } else {
            console.error('API返回错误:', data);
            showMessage(`获取详情失败: ${data.msg || '未知错误'}`, 'error');
        }
    } catch (error) {
        showLoading(false);
        console.error('详情加载错误:', error);
        showMessage(`加载详情失败: ${error.message}`, 'error');
    }
}

// 显示影视详情
function displayMovieDetail(data) {
    // 隐藏搜索结果，显示详情页
    resultsContainer.style.display = 'none';
    detailPage.style.display = 'block';

    // 设置海报
    const posterImg = document.getElementById('detailPoster');
    posterImg.src = data.pic;
    posterImg.alt = data.name;
    posterImg.onerror = function() {
        this.src = 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(data.name);
    };

    // 设置标题和副标题
    document.getElementById('detailTitle').textContent = data.name;
    document.getElementById('detailSubtitle').textContent = data.subtitle || '';

    // 设置元信息
    const metaHtml = `
        ${data.year ? `<div>📅 年份: ${data.year}</div>` : ''}
        ${data.area ? `<div>📍 地区: ${data.area}</div>` : ''}
        ${data.type ? `<div>🎭 类型: ${data.type}</div>` : ''}
        ${data.director ? `<div>🎬 导演: ${data.director}</div>` : ''}
        ${data.actors || data.actor ? `<div>👥 主演: ${data.actors || data.actor}</div>` : ''}
        ${data.language ? `<div>🗣️ 语言: ${data.language}</div>` : ''}
        ${data.total_episodes ? `<div>📺 总集数: ${data.total_episodes}集</div>` : ''}
        ${data.remarks ? `<div>✨ 状态: ${data.remarks}</div>` : ''}
        ${data.update_time ? `<div>⏰ 更新时间: ${data.update_time}</div>` : ''}
    `;
    document.getElementById('detailMeta').innerHTML = metaHtml;

    // 设置简介
    document.getElementById('detailDesc').textContent = data.intro || data.blurb || data.content || '暂无简介';

    // 显示剧集列表
    displayEpisodes(data.episodes || []);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 显示剧集列表
function displayEpisodes(episodes) {
    episodesList.innerHTML = '';

    if (!episodes || episodes.length === 0) {
        episodesList.innerHTML = '<p style="text-align: center; color: #999;">暂无剧集信息</p>';
        return;
    }

    episodes.forEach((episode, index) => {
        const btn = document.createElement('button');
        btn.className = 'episode-btn';
        btn.textContent = episode.title.trim();
        btn.addEventListener('click', () => {
            playEpisode(episode, btn);
        });
        episodesList.appendChild(btn);
    });
}

// 播放剧集
function playEpisode(episode, btnElement) {
    // 移除其他按钮的active状态
    document.querySelectorAll('.episode-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 设置当前按钮为active
    btnElement.classList.add('active');

    // 显示播放器容器
    playerContainer.style.display = 'block';
    document.getElementById('currentEpisode').textContent = episode.title.trim();

    // 优先使用原始URL，因为m3u8url代理有CORS限制
    const videoUrl = episode.url || episode.m3u8url;
    console.log('准备播放视频:', videoUrl);
    console.log('原始URL:', episode.url);
    console.log('代理URL:', episode.m3u8url);

    // 销毁之前的HLS实例
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // 如果是m3u8格式，使用HLS.js播放
    if (videoUrl.includes('.m3u8') || videoUrl.includes('m3u8')) {
        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hls.loadSource(videoUrl);
            hls.attachMedia(videoPlayer);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                console.log('HLS manifest 加载成功');
                videoPlayer.play().catch(e => {
                    console.error('播放失败:', e);
                });
            });
            
            hls.on(Hls.Events.ERROR, function(event, data) {
                console.error('HLS错误:', data);
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('网络错误，尝试恢复...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('媒体错误，尝试恢复...');
                            hls.recoverMediaError();
                            break;
                        default:
                            console.error('无法恢复的错误');
                            hls.destroy();
                            break;
                    }
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari等原生支持HLS的浏览器
            videoPlayer.src = videoUrl;
            videoPlayer.addEventListener('loadedmetadata', function() {
                videoPlayer.play();
            });
        } else {
            alert('您的浏览器不支持HLS播放，请使用Chrome、Edge或Safari浏览器');
        }
    } else {
        // 普通视频格式
        videoPlayer.src = videoUrl;
        videoPlayer.load();
        videoPlayer.play();
    }

    // 滚动到播放器
    playerContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 显示加载状态
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

// 清空结果
function clearResults() {
    resultsContainer.innerHTML = '';
}

// 显示提示信息
function showMessage(message, type = 'error') {
    resultsContainer.innerHTML = `
        <div class="${type === 'error' ? 'error-message' : 'no-results'}">
            ${message}
        </div>
    `;
}

// 返回搜索结果
function backToSearch() {
    detailPage.style.display = 'none';
    resultsContainer.style.display = 'grid';
    playerContainer.style.display = 'none';
    
    // 停止播放并清理
    videoPlayer.pause();
    if (hls) {
        hls.destroy();
        hls = null;
    }
    videoPlayer.src = '';
    currentMovieData = null;
}

// 事件监听
searchBtn.addEventListener('click', () => {
    const keyword = searchInput.value.trim();
    searchMovie(keyword);
});

// 回车搜索
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const keyword = searchInput.value.trim();
        searchMovie(keyword);
    }
});

// 返回按钮
backBtn.addEventListener('click', backToSearch);

// 页面加载时的欢迎信息
window.addEventListener('load', () => {
    resultsContainer.innerHTML = `
        <div class="no-results">
            <h2 style="margin-bottom: 20px;">👋 欢迎使用追剧网站</h2>
            <p>在搜索框中输入您想观看的剧名，即可快速查找影视资源</p>
        </div>
    `;
});

