/**
 * Created by sjin on 17/2/21.
 */
define(['jquery'], function ($) {
  $.fn['tree'] = function (options) {
    new initTree(options, $(this));
  };

  var initTree = function (options, $this) {
    // console.log('init gx tree');
    // console.log(options.data);
    // console.log($this);

    var option = {
      activeClassName: 'active',
      dataKey: 'obj',
      pathAttrName: options.pathAttrName || 'path',
      codeAttrName: options.codeAttrName || 'code',
      nameAttrName: options.nameAttrName || 'name',
      subListAttrName: options.subListAttrName || 'items',
      iconClassAttrName: options.iconClassAttrName || 'iconClass',
      curCode: options.cur || null,
      curClass: options.curClass || 'cur'
    };

    var $main, nodeList = [], node$List = [];

    var TEMPLATE = {
      main: '<ul class="gx-tree"></ul>',
      subMain: '<ul class="gx-sub-tree"></ul>'
    };

    /**
     * 递归 构建 html 结构
     */
    var construct = function (list, $target, level) {
      $target.addClass('level'+level);
      for (var i = 0; i < list.length; i++) {
        var item = list[i]; // 暂存对象
        // 对象对应的 一项 html dom 节点
        var htmlStr = '<li>' +
          '<a href="' + item[option.pathAttrName] + '">' +
          '<i class="'+item[option.iconClassAttrName]+'"></i>' +
          '<span class="tree-text">' + item[option.nameAttrName] + '</span>' +
          '</a></li>';
        $target.append(htmlStr);

        // jquery 方式获取当前节点
        var $curObj = $target.find('li:last');
        // item 数据存到当前节点 data 下
        $curObj.data(option.dataKey, item);

        // 对象和相应的 dom jquery对象,存 数组
        var index = nodeList.length;
        nodeList[index] = item;
        node$List[index] = $curObj;

        // 当前菜单 高亮
        if(option.curCode && option.curCode == item[option.codeAttrName]){
          $curObj.find('a').addClass(option.curClass);
        }

        // 如果有子数据, 递归
        if (item[option.subListAttrName] && item[option.subListAttrName].length > 0) {
          $curObj.append(TEMPLATE.subMain);
          construct(item[option.subListAttrName], $curObj.find('.gx-sub-tree'), level+1);
        }
      }
    };

    /**
     * 分析数据, 高亮和展开 当前 节点
     */
    var cur = function (){
      // console.log(nodeList);
      // console.log(node$List);
      if(option.curCode){
        var $curNode = $main.find('.' + option.curClass);
        $curNode.parents('li').addClass(option.activeClassName);
        $main.find('.' + option.activeClassName).find('a:first').addClass(option.curClass);
      }else{
        // 展示第一个
        node$List[0].addClass(option.activeClassName);
      }

    };

    var init = function (treeData) {
      $this.append(TEMPLATE.main);
      $main = $this.find('.gx-tree');
      construct(treeData, $main, 1);   // 生成 树结构 dom
      cur();  // 根据当前高亮, 设置默认展开

      // 绑定事件
      $('.gx-tree a').on('click.gxTree', function () {
        var $pa = $(this).parent();
        var obj = $pa.data(option.dataKey);

        if (obj[option.subListAttrName] && obj[option.subListAttrName].length > 0) {
          if ($pa.hasClass(option.activeClassName)) {
            $pa.removeClass(option.activeClassName).find('li').removeClass(option.activeClassName);
          } else {
            $pa.addClass(option.activeClassName);
          }

          // 根据 配置 是否回调 ( 非叶子节点 )
          if (options.onNodeClick && options.allClickCallBack) options.onNodeClick(obj);
          return false;
        }

        // 叶子节点,根据配置 看是回调还是直接访问 href
        if (options.onNodeClick) {
          options.onNodeClick(obj);
          return false;
        }
        // console.log('to path..');
      });
    };

    if (options.data) {
      init(options.data);
    } else if (options.dataUrl) {
      $.ajax({
        url: options.dataUrl,
        data: null,
        type: 'GET',
        dataType: 'JSON',
        success: function (result) {
          if (result) {
            init(result);
          }
        }
      });
    }

  };

});