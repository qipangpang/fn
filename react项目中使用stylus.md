## 0. 说明:
	create-react-app创建的项目没有stylus相关的webpack配置和包, 需要修改配置和下载相关包

## 1. 把配置文件暴露出来
	npm run eject  // 选择Y

## 2. 解决开发环境运行缺包问题(也有可能提示缺少别的包或不缺)
	npm start  查看控制台提示
	yarn add @babel/plugin-transform-react-jsx-source
	yarn add @babel/plugin-transform-react-jsx-self

## 3. 修改配置文件: config/webpack.config.js
	// 注意: 根据已有的sass的配置修改, 并添加在相应的位置

	const stylusRegex = /\.(stylus|styl)$/;
	const stylusModuleRegex = /\.module\.(stylus|styl)$/;

	{
      test: stylusRegex,
      exclude: stylusModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
        'stylus-loader'
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },

	{
      test: stylusModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
          sourceMap: isEnvProduction && shouldUseSourceMap,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent,
        },
        'stylus-loader'
      ),
    },
	
	不仅如此还可以使用另外一种方式配置：
	const stylRegex = /\.styl$/;
	const stylModuleRegex = /\.module\.styl$/;
	
	对应的正则匹配文件和模块配置：
	{
	  test: stylRegex,
	  exclude: stylModuleRegex,
	  use: getStyleLoaders({
		  importLoaders: 3,
		  sourceMap: isEnvProduction && shouldUseSourceMap,
		},
		'stylus-loader'
	  ),
	  // Don't consider CSS imports dead code even if the
	  // containing package claims to have no side effects.
	  // Remove this when webpack adds a warning or an error for this.
	  // See https://github.com/webpack/webpack/issues/6571
	  sideEffects: true,
	},
	// Adds support for CSS Modules, but using SASS
	// using the extension .module.scss or .module.sass
	{
	  test: stylModuleRegex,
	  use: getStyleLoaders({
		  importLoaders: 3,
		  sourceMap: isEnvProduction && shouldUseSourceMap,
		  modules: true,
		  getLocalIdent: getCSSModuleLocalIdent,
		},
		'stylus-loader'
	  ),
	}
	
	通过对应的stylus风格的样式代码被引入到React中的话 如果提示这样的错误： 
	expected "indent", got "outdent" 则表示 预期“缩进” 实际是 "突出"的
	说明对应的缩进有问题！ 等出现对应的代码高亮则可以正常使用！
	
	
	

## 4. 安装stylus依赖
	yarn add stylus stylus-loader

## 5. 编码测试
	1). index.css => index.styl
		body
		  margin: 0
		  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
		    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
		  -webkit-font-smoothing: antialiased
		  -moz-osx-font-smoothing: grayscale
		  code
		    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
		      monospace

	2). App.css => App.styl
		.App
		  text-align center
		  .App-header
		    background-color #282c34
		    min-height 100vh
		    display flex
		    flex-direction column
		    align-items center
		    justify-content center
		    font-size calc(10px + 2vmin)
		    color white
		    .App-logo
		      animation App-logo-spin infinite 20s linear
		      height 40vmin
		      pointer-events none
		    .App-link
		      color #61dafb
	3). 开发环境运行/生产环境打包运行 ==> 访问
		npm start
		npm run build / serve build

	