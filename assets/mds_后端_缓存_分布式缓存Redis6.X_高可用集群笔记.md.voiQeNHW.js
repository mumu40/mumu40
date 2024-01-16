import{_ as s,c as i,o as a,U as l}from"./chunks/framework.pR8v3qv_.js";const g=JSON.parse('{"title":"分布式缓存Redis6.X+高可用集群笔记","description":"","frontmatter":{"urlname":"redis","title":"分布式缓存Redis6.X+高可用集群笔记","updated":"2024-01-16 15:04:37","date":"2024-01-16 15:04:15","status":"已发布","catalog":["后端","缓存"]},"headers":[],"relativePath":"mds/后端/缓存/分布式缓存Redis6.X+高可用集群笔记.md","filePath":"mds/后端/缓存/分布式缓存Redis6.X+高可用集群笔记.md"}'),e={name:"mds/后端/缓存/分布式缓存Redis6.X+高可用集群笔记.md"},n=l(`<h2 id="q-为什么要学习redis" tabindex="-1">Q: 为什么要学习Redis <a class="header-anchor" href="#q-为什么要学习redis" aria-label="Permalink to &quot;Q: 为什么要学习Redis&quot;">​</a></h2><h4 id="a-解决高并发下性能问题" tabindex="-1">A: 解决高并发下性能问题 <a class="header-anchor" href="#a-解决高并发下性能问题" aria-label="Permalink to &quot;A: 解决高并发下性能问题&quot;">​</a></h4><ul><li>高并发解决方案： <ul><li>队列：Rabbitmq、Kafka <ul><li>缓存</li><li>分布式缓存：Redis、Memcached <ul><li>本地缓存：Mybatis、Redis本地单机服务</li></ul></li></ul></li></ul></li></ul><h3 id="怎么选择缓存方案" tabindex="-1">怎么选择缓存方案？ <a class="header-anchor" href="#怎么选择缓存方案" aria-label="Permalink to &quot;怎么选择缓存方案？&quot;">​</a></h3><p>结合业务数据选择，一般都是共同存在的。</p><h3 id="衍生问题及解决-热点key问题" tabindex="-1">衍生问题及解决：热点key问题 <a class="header-anchor" href="#衍生问题及解决-热点key问题" aria-label="Permalink to &quot;衍生问题及解决：热点key问题&quot;">​</a></h3><h4 id="定义" tabindex="-1">定义 <a class="header-anchor" href="#定义" aria-label="Permalink to &quot;定义&quot;">​</a></h4><p>缓存中的某些key对应的value存储在集群中的某台机器，使得所有流量集中涌向这台机器，造成系统瓶颈，并且无法通过扩容来解决。比如：热搜词、热点新闻、热卖商品</p><h4 id="解决方案" tabindex="-1">解决方案 <a class="header-anchor" href="#解决方案" aria-label="Permalink to &quot;解决方案&quot;">​</a></h4><p>排除带宽或者传输影响，服务在拿到分布式缓存数据后，在本地缓存一份（可以设置过期时间），以后每次请求，都先检查本地缓存是否存在缓存key，如果存在则直接返回，如果不存在则再去访问分布式缓存机器获取数据。</p><h2 id="redis简介" tabindex="-1">Redis简介 <a class="header-anchor" href="#redis简介" aria-label="Permalink to &quot;Redis简介&quot;">​</a></h2><ul><li><p>属于Nosql的一种</p><ul><li>Nosql <ul><li>是一种非关系型数据库管理系统 <ul><li>不使用SQL作为查询语言</li><li>不需要固定的表格模式：键值对、列存储、文档存储、图形数据库</li><li>产品：Redis、Memcached、Mongodb、Hbase</li></ul></li></ul></li></ul></li><li><p>是一个开源的由C语言编写的存储数据库，支持网络，支持基于内存、分布式、可选持久化。并且它提供了多种语言的API，比如Java、JavaScript、Python都可以使用Redis</p></li><li><p>Redis是内存中的数据结构存储系统，它可以被用作数据库、缓存、消息中间件，支持字符串（strings）、散列（hashes）、列表（lists）、集合（sets）、有序集合（sorted sets）等</p></li></ul><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><h4 id="源码编译安装" tabindex="-1">源码编译安装 <a class="header-anchor" href="#源码编译安装" aria-label="Permalink to &quot;源码编译安装&quot;">​</a></h4><ul><li>源码安装Redis-上传到Linux服务(先安装升级gcc再编译)</li></ul><p>注意：安装编译redis6需要升级gcc，默认自带的gcc版本比较老</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#安装gcc</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gcc-c++</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> autoconf</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> automake</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#centos7 默认的 gcc 默认是4.8.5,版本小于 5.3 无法编 译,需要先安装gcc新版才能编译</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">gcc</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#升级新版gcc，配置永久生效</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> centos-release-scl</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> devtoolset-9-gcc</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> devtoolset-9-gcc-c++</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> devtoolset-9-binutils</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">scl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> enable</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> devtoolset-9</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bash</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;source /opt/rh/devtoolset-9/enable&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/etc/profile</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#编译redis </span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> redis</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">make</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#安装到指定目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mkdir</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/local/redis</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">make</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> PREFIX=/usr/local/redis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span></span></code></pre></div><h4 id="docker安装" tabindex="-1">Docker安装 <a class="header-anchor" href="#docker安装" aria-label="Permalink to &quot;Docker安装&quot;">​</a></h4><ul><li>安装docker</li></ul><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker-io</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span></span></code></pre></div><ul><li>运行docker</li></ul><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker</span></span></code></pre></div>`,22),t=[n];function h(p,k,d,r,c,o){return a(),i("div",null,t)}const u=s(e,[["render",h]]);export{g as __pageData,u as default};
